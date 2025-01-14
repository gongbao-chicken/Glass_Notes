#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut,ShortcutState};
use serde_json::Value;
use std::str::FromStr;
#[tauri::command]
fn update_shortcut(app: tauri::AppHandle, newShortcut: serde_json::Value) -> Result<(), String> {
    let ctrl = newShortcut["ctrl"].as_bool().unwrap_or(false);
    let alt = newShortcut["alt"].as_bool().unwrap_or(false);
    let shift = newShortcut["shift"].as_bool().unwrap_or(false);
    let key = newShortcut["key"].as_str().unwrap_or("Space");
    println!("{}",&newShortcut);
    println!("{},{},{},{}",&ctrl,&alt,&shift,&key);
    let modifiers = {
        let mut m = Modifiers::empty();
        if ctrl { m |= Modifiers::CONTROL; }
        if alt { m |= Modifiers::ALT; }
        if shift { m |= Modifiers::SHIFT; }
        m
    };
    let code = Code::from_str(&key).unwrap_or(Code::Space);
    
    println!("{}",&code);

    // 先取消注册旧的快捷键
    app.global_shortcut().unregister_all().map_err(|e| e.to_string())?;

    
    // 获取主窗口
    let window = app.get_webview_window("main").unwrap();
    
    // 使用Shortcut结构体注册快捷键
    let shortcut = Shortcut::new(
        Some(modifiers),
        code
    );
    println!("{}",&shortcut);
    // 注册快捷键
    app.global_shortcut().register(shortcut).map_err(|e| e.to_string())?;

    // 设置快捷键处理函数
    let result = app.plugin(
        tauri_plugin_global_shortcut::Builder::new().with_handler(move |app, _, event| {
            if event.state() == ShortcutState::Pressed {
                if let Some(window) = app.get_webview_window("main") {
                    if window.is_visible().unwrap() {
                        window.hide().unwrap();
                    } else {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                }
            }
        })
        .build(),
    );
    
    result.map_err(|e| e.to_string())?;

    Ok(())
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      #[cfg(desktop)]
      {
          // 定义快捷键 (Ctrl+Alt+Space)
          let shortcut = Shortcut::new(
              Some(Modifiers::CONTROL | Modifiers::ALT), // Ctrl + Alt
              Code::Space, // Space 键
          );

          // 注册快捷键处理器
          app.handle().plugin(
              tauri_plugin_global_shortcut::Builder::new().with_handler(move |app, shortcut, event| {
                  if event.state() == ShortcutState::Pressed {
                      let window = app.get_webview_window("main").unwrap();
                      if window.is_visible().unwrap() {
                          window.hide().unwrap();
                      } else {
                          window.show().unwrap();
                          window.set_focus().unwrap();
                      }
                  }
              })
              .build(),
          )?;

          // 注册快捷键
          app.global_shortcut().register(shortcut)?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![update_shortcut])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
