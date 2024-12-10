import {
  transcriptionCanceledText,
  transcriptionCompletedText,
} from "./translations.js";

const terminal = document.getElementById("terminal");

function cleanConsole() {
  terminal.innerHTML = "";
}

function bindCleanConsoleButton() {
  document
    .getElementById("cleanConsoleBtn")
    .addEventListener("click", cleanConsole);
}

function setupTerminalListeners(window) {
  window.electron.onWhisperOutput((event, data) => {
    terminal.innerHTML += data.replace(/\n/g, "<br>");
    terminal.scrollTop = terminal.scrollHeight;
  });

  window.electron.onWhisperComplete((event, code) => {
    const message =
      code === 0 ? transcriptionCompletedText : transcriptionCanceledText;
    terminal.innerHTML += `<br>${message}<br>`;
    console.log("Transcription Finished");
    document.getElementById("cancelBtn").disabled = true;
    document.getElementById("processBtn").disabled = false;
  });
}

export { setupTerminalListeners, bindCleanConsoleButton, cleanConsole };
