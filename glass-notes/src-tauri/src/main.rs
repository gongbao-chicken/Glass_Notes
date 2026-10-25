#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::str::FromStr;
use tauri::Manager;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

// 背景效果档位：0 = 全透明 / 1 = 液态玻璃（NSGlassEffectView，macOS 26+，默认）
//            2 = NSVisualEffectView 毛玻璃（也是液态玻璃在老系统上的回退）
#[cfg(target_os = "macos")]
const DEFAULT_BLUR_LEVEL: u8 = 1;

// NSGlassEffectViewStyle：Regular = 0，Clear = 1（见 SDK 头文件）
#[cfg(target_os = "macos")]
const LIQUID_GLASS_STYLE: isize = 1;

// 设置模糊档位。不能用 tauri 的 set_effects 做运行时切换：底层 window-vibrancy
// 每次调用都会新插入一个 NSVisualEffectView，反复切换会叠加视图层并泄漏。
// 这里每次先移除旧的效果视图再按档位重建，只动我们自己插入的视图，不碰
// WKWebView。必须在主线程调用
#[cfg(target_os = "macos")]
fn apply_blur_level(window: &tauri::WebviewWindow<tauri::Wry>, level: u8) {
    use objc2::runtime::AnyObject;
    use objc2::ClassType;
    use objc2_app_kit::{
        NSAutoresizingMaskOptions, NSView, NSVisualEffectBlendingMode, NSVisualEffectMaterial,
        NSVisualEffectState, NSVisualEffectView, NSWindowOrderingMode,
    };
    use objc2_foundation::MainThreadMarker;
    use raw_window_handle::{HasWindowHandle, RawWindowHandle};

    let Ok(handle) = window.window_handle() else { return };
    let RawWindowHandle::AppKit(appkit) = handle.as_raw() else {
        return;
    };
    let Some(mtm) = MainThreadMarker::new() else { return };

    unsafe {
        let content: &NSView = appkit.ns_view.cast().as_ref();
        // 两种效果视图都清掉，跨档切换不残留。
        // 注意不能用类名字符串精确匹配：NSGlassEffectView 实例运行时会被 KVO
        // 换成 NSKVONotifying_NSGlassEffectView 动态子类，必须用 isKindOfClass
        let glass_cls = objc2::runtime::AnyClass::get("NSGlassEffectView");
        for sub in content.subviews().iter() {
            let is_vibrancy: bool =
                objc2::msg_send![sub, isKindOfClass: NSVisualEffectView::class()];
            let is_glass = match glass_cls {
                Some(cls) => {
                    let r: bool = objc2::msg_send![sub, isKindOfClass: cls];
                    r
                }
                None => false,
            };
            if is_vibrancy || is_glass {
                sub.removeFromSuperview();
            }
        }
        let bounds = content.bounds();

        // 0 = 全透明：不加任何效果视图
        if level == 0 {
            return;
        }

        // 液态玻璃档：NSGlassEffectView 是 macOS 26 新 API，objc2-app-kit 0.2.2
        // 尚未收录，用运行时类查找 + 裸指针 msg_send；类不存在（老系统）则落到下方回退
        if level == 1 {
            if let Some(cls) = objc2::runtime::AnyClass::get("NSGlassEffectView") {
                let allocated: *mut AnyObject = objc2::msg_send![cls, alloc];
                let glass: *mut AnyObject =
                    objc2::msg_send![allocated, initWithFrame: bounds];
                let _: () = objc2::msg_send![glass, setStyle: LIQUID_GLASS_STYLE];
                // NSViewWidthSizable(2) | NSViewHeightSizable(16)
                let _: () = objc2::msg_send![glass, setAutoresizingMask: 18usize];
                let nil: *mut AnyObject = std::ptr::null_mut();
                let _: () = objc2::msg_send![
                    content,
                    addSubview: glass
                    positioned: NSWindowOrderingMode::NSWindowBelow
                    relativeTo: nil
                ];
                // addSubview 已持有引用，释放 alloc/init 持有的那份，避免切档泄漏
                let _: () = objc2::msg_send![glass, release];
                return;
            }
        }

        // NS 毛玻璃档：UnderWindowBackground 是最透的材质（UnderPageBackground
        // 在浅色外观下接近不透明白纸，会盖住背景）
        let effect = NSVisualEffectView::initWithFrame(mtm.alloc(), bounds);
        effect.setMaterial(NSVisualEffectMaterial::UnderWindowBackground);
        effect.setBlendingMode(NSVisualEffectBlendingMode::BehindWindow);
        effect.setState(NSVisualEffectState::Active);
        effect.setAutoresizingMask(
            NSAutoresizingMaskOptions::NSViewWidthSizable
                | NSAutoresizingMaskOptions::NSViewHeightSizable,
        );
        content.addSubview_positioned_relativeTo(
            &effect,
            NSWindowOrderingMode::NSWindowBelow,
            None,
        );
    }
}

// 呼出/隐藏主窗口：全局快捷键的唯一处理逻辑。
// 插件 handler 在启动时注册一次，之后换快捷键只需要换注册项，不能再重复注册插件
fn toggle_main_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
        } else {
            let _ = window.set_focus();
            let _ = window.show();
        }
    }
}

// 覆盖层窗口要能出现在任何应用（包括原生全屏应用）之上，
// 需要 NSWindowCollectionBehaviorCanJoinAllSpaces | FullScreenAuxiliary；
// tao 只暴露了前者，后者必须直接设置 NSWindow（Spotlight 类工具的标准做法）
#[cfg(target_os = "macos")]
fn configure_mac_overlay(window: &tauri::WebviewWindow<tauri::Wry>) {
    use objc2_app_kit::{NSView, NSWindowCollectionBehavior};
    use objc2_foundation::{NSPoint, NSRect, NSSize};
    use raw_window_handle::{HasWindowHandle, RawWindowHandle};

    let Ok(handle) = window.window_handle() else { return };
    let RawWindowHandle::AppKit(appkit) = handle.as_raw() else {
        return;
    };
    unsafe {
        let view: &NSView = appkit.ns_view.cast().as_ref();
        if let Some(ns_window) = view.window() {
            ns_window.setCollectionBehavior(
                NSWindowCollectionBehavior::CanJoinAllSpaces
                    | NSWindowCollectionBehavior::FullScreenAuxiliary,
            );
            // NSStatusWindowLevel = 25：高于菜单栏(24)和程序坞(20)，
            // 覆盖层铺满整屏时连同菜单栏/程序坞一起盖住（与 Windows 全屏盖任务栏一致）
            let _: () = objc2::msg_send![&*ns_window, setLevel: 25isize];
            // 铺满整个屏幕（含菜单栏/程序坞区域）。tauri 的 set_size/set_position
            // 是投递到主线程队列的，会在 setup 之后执行并被 AppKit 约束回可见区域，
            // 所以这里直接 setFrame
            if let Some(screen) = ns_window.screen() {
                let full = screen.frame();
                let target = NSRect::new(
                    NSPoint::new(full.origin.x, full.origin.y),
                    NSSize::new(full.size.width, full.size.height),
                );
                ns_window.setFrame_display_animate(target, false, false);
            }
        }
    }
}

#[tauri::command]
fn update_shortcut(app: tauri::AppHandle, new_shortcut: serde_json::Value) -> Result<(), String> {
    let ctrl = new_shortcut["ctrl"].as_bool().unwrap_or(false);
    let alt = new_shortcut["alt"].as_bool().unwrap_or(false);
    let shift = new_shortcut["shift"].as_bool().unwrap_or(false);
    let meta = new_shortcut["meta"].as_bool().unwrap_or(false);
    let key = new_shortcut["key"].as_str().unwrap_or("Space");
    let modifiers = {
        let mut m = Modifiers::empty();
        if ctrl {
            m |= Modifiers::CONTROL;
        }
        if alt {
            m |= Modifiers::ALT;
        }
        if shift {
            m |= Modifiers::SHIFT;
        }
        // meta：macOS 上是 Command，Windows 上是 Win 键
        if meta {
            m |= Modifiers::META;
        }
        m
    };
    let code = Code::from_str(&key).unwrap_or(Code::Space);

    // 先取消注册旧的快捷键，再注册新组合；handler 保持启动时那一份不变
    app.global_shortcut()
        .unregister_all()
        .map_err(|e| e.to_string())?;

    let shortcut = Shortcut::new(Some(modifiers), code);
    app.global_shortcut()
        .register(shortcut)
        .map_err(|e| e.to_string())?;

    Ok(())
}

// macOS：模糊档位命令。NSVisualEffectView 只能在主线程操作
#[cfg(target_os = "macos")]
#[tauri::command]
fn set_blur_level(app: tauri::AppHandle, level: u8) -> Result<(), String> {
    let handle = app.clone();
    app.run_on_main_thread(move || {
        if let Some(window) = handle.get_webview_window("main") {
            apply_blur_level(&window, level);
        }
    })
    .map_err(|e| e.to_string())
}

// Windows 亚克力是系统固定效果（无强度参数），空实现保持前端调用统一
#[cfg(not(target_os = "macos"))]
#[tauri::command]
fn set_blur_level(_app: tauri::AppHandle, _level: u8) -> Result<(), String> {
    Ok(())
}

fn main() {
    let builder = tauri::Builder::default();

    // 单实例保护必须最先注册：重复启动时唤起已有实例的窗口，
    // 避免两个实例用各自的 DOM 快照并发覆写 localStorage 导致便签随机丢失
    #[cfg(desktop)]
    let builder = builder.plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
        toggle_main_window(app);
    }));

    builder
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            #[cfg(desktop)]
            {
                // 默认呼出快捷键 (Ctrl+Alt+Space)
                let shortcut = Shortcut::new(
                    Some(Modifiers::CONTROL | Modifiers::ALT),
                    Code::Space,
                );

                // 注册快捷键处理器（整个应用生命周期只注册这一次）
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(|app, _shortcut, event| {
                            if event.state() == ShortcutState::Pressed {
                                toggle_main_window(app);
                            }
                        })
                        .build(),
                )?;

                app.global_shortcut().register(shortcut)?;
            }

            let window = app
                .get_webview_window("main")
                .expect("main window missing");

            #[cfg(not(target_os = "macos"))]
            {
                // Windows/Linux：保持原有的无边框全屏覆盖 + 置顶
                // （macOS 的层级在 configure_mac_overlay 里直接设 NSWindow，不经这里）
                let _ = window.set_fullscreen(true);
                let _ = window.set_always_on_top(true);
            }

            #[cfg(target_os = "macos")]
            {
                // macOS 原生全屏会独占一个 Space、隐藏菜单栏，且退出全屏的动画会把
                // 窗口压回可见区域，所以不用原生全屏：非全屏 + 无边框 + 铺满整屏 +
                // 高层级（连菜单栏/程序坞一起盖住）。
                // 几何也在这里一并设置：tauri 的 set_size/set_position 是投递到
                // 主线程队列的，会在 setup 之后执行并覆盖此处同步设置的 frame
                configure_mac_overlay(&window);
                // 毛玻璃默认中档；前端加载后会按 localStorage 保存的档位再调一次
                apply_blur_level(&window, DEFAULT_BLUR_LEVEL);
            }

            // 窗口配置为 visible:false 创建，待各平台几何/特效调整完成后再显示，
            // 避免 macOS 上先全屏再退出全屏的切换闪烁
            let _ = window.show();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![update_shortcut, set_blur_level])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
