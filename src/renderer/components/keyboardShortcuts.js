import { cancelTranscription, handleFile, processFile } from "./fileHandler.js";
import { cleanConsole } from "./terminal.js";

function setupKeyboardShortcuts(window) {
  let ctrlPressed = false;
  let altPressed = false;
  if (!window) {
    console.error("Window object not available");
    return;
  }

  document.addEventListener("keyup", (event) => {
    if (event.key === "Control") ctrlPressed = false;
    if (event.key === "Alt") altPressed = false;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Control") ctrlPressed = true;
    if (event.key === "Alt") altPressed = true;

    console.log("Key pressed:", {
      key: event.key,
      ctrl: event.ctrlKey,
      alt: event.altKey,
      code: event.code,
      keyCode: event.keyCode,
    });
    if (ctrlPressed && altPressed && (event.key === "a" || event.key === "á")) {
      event.preventDefault();
      console.log("Alt+A detected");
      handleFile(window);
    }

    if (ctrlPressed && altPressed && (event.key === "d" || event.key === "ð")) {
      event.preventDefault();
      if (!document.getElementById("processBtn").disabled) {
        processFile(window);
      }
    }

    if ((ctrlPressed && altPressed && event.key === "c") || event.key === "©") {
      event.preventDefault();
      if (!document.getElementById("cancelBtn").disabled) {
        cancelTranscription(window);
      }
    }

    if (ctrlPressed && altPressed && event.key === "x") {
      event.preventDefault();
      if (!document.getElementById("cleanConsoleBtn").disabled) {
        cleanConsole(window);
      }
    }
  });
}

export { setupKeyboardShortcuts };
