#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut};

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      // 获取主窗口
      let window = app.get_webview_window("main").unwrap();
      window.hide().unwrap();

      // 注册全局快捷键 Ctrl+Alt+Space
      let shortcut = Shortcut::new(
        Some(Modifiers::CONTROL | Modifiers::ALT),
        Code::Space
      );
      
      // 直接使用app实例注册快捷键
      app.global_shortcut().register(shortcut)?;
      
      // 使用窗口的clone来处理快捷键回调
      let window_clone = window.clone();
      app.global_shortcut().on_shortcut(shortcut, move |_, _, _| {
        if window_clone.is_visible().unwrap() {
          window_clone.hide().unwrap();
        } else {
          window_clone.show().unwrap();
          window_clone.set_focus().unwrap();
        }
      })?;

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
