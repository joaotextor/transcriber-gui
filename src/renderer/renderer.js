import {
  loadTranslations,
  bindLanguageSelector,
  bindWhisperButton,
} from "./components/translations.js";
import {
  setupTerminalListeners,
  bindCleanConsoleButton,
} from "./components/terminal.js";
import { setupKeyboardShortcuts } from "./components/keyboardShortcuts.js";
import { bindButtonEvents } from "./components/fileHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  loadTranslations();
  setupTerminalListeners(window);
  setupKeyboardShortcuts(window);
  bindButtonEvents();
  bindLanguageSelector();
  bindCleanConsoleButton();
  console.log("DOM loaded, binding button...");
  bindWhisperButton();
});
