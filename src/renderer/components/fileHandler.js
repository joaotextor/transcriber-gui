import { fileSelectedLabel, errorLabel } from "./translations.js";

let selectedFilePaths = null;

async function handleFile(window) {
  try {
    const result = await window.electron.showOpenDialog();
    if (result.filePath) {
      selectedFilePaths = result;
      document.getElementById("processBtn").disabled = false;
      document.getElementById(
        "selectedFile"
      ).textContent = `${fileSelectedLabel}: ${result.filePath}`;
    }
  } catch (error) {
    console.error(`${errorLabel}:`, error);
  }
}

function processFile(window) {
  if (selectedFilePaths) {
    document.getElementById("cancelBtn").disabled = false;
    document.getElementById("processBtn").disabled = true;
    window.electron.ipcRenderer.send("process-file", selectedFilePaths);
  }
}

function cancelTranscription(window) {
  window.electron.ipcRenderer.send("cancel-transcription");
  document.getElementById("cancelBtn").disabled = true;
  document.getElementById("processBtn").disabled = false;
}

function bindButtonEvents() {
  document
    .getElementById("selectFileBtn")
    .addEventListener("click", () => handleFile(window));
  document
    .getElementById("processBtn")
    .addEventListener("click", () => processFile(window));
  document
    .getElementById("cancelBtn")
    .addEventListener("click", () => cancelTranscription(window));
}

export { handleFile, processFile, cancelTranscription, bindButtonEvents };