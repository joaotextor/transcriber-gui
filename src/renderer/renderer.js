let selectedFilePaths = null;
let fileSelectedLabel = "Arquivo selecionado";
let errorLabel = "Erro";
let transcriptionCompletedText = "Transcrição concluída!";
let transcriptionCanceledText = "Transcrição cancelada!";

const terminal = document.getElementById("terminal");

async function loadTranslations() {
  const translations = await window.electron.getCurrentTranslations();
  updatePageText(translations);
}

async function changeLanguage(lang) {
  const translations = await window.electron.setLanguage(lang);
  updatePageText(translations);
}

function updatePageText(translations) {
  // Labels
  document.title = translations.title;

  document.querySelector("h1").textContent = translations.title;
  document.querySelector("h2").textContent = translations.subtitle;
  document.querySelector("#selectedFile").textContent =
    translations.noFileSelected;

  // Buttons
  document.querySelector(
    "#selectFileBtn"
  ).innerHTML = `${translations.selectFile} <span style="display: block; font-size: 14px">(Ctrl+Alt+A)</span>`;
  document.querySelector(
    "#processBtn"
  ).innerHTML = `${translations.transcribe} <span style="display: block; font-size: 14px">(Ctrl+Alt+D)</span>`;
  document.querySelector(
    "#cancelBtn"
  ).innerHTML = `${translations.cancel} <span style="display: block; font-size: 14px">(Ctrl+Alt+C)</span>`;

  // Dynamic text
  fileSelectedLabel = translations.fileSelected;
  errorLabel = translations.error;
  transcriptionCompletedText = translations.transcriptionCompleted;
  transcriptionCanceledText = translations.transcriptionCanceled;
}

// Call this when page loads
document.addEventListener("DOMContentLoaded", loadTranslations);

window.electron.onWhisperOutput((event, data) => {
  terminal.innerHTML += data.replace(/\n/g, "<br>");
  terminal.scrollTop = terminal.scrollHeight;
});

window.electron.onWhisperComplete((event, code) => {
  const message =
    code === 0 ? transcriptionCompletedText : transcriptionCanceledText;
  terminal.innerHTML += `<br>${message}<br>`;
});

document.addEventListener("keydown", (event) => {
  // Check for both 'a' and 'á' for file selection
  if (
    event.ctrlKey &&
    event.altKey &&
    (event.key === "a" || event.key === "á")
  ) {
    event.preventDefault();
    handleFile();
  }

  // Check for both 'd' and 'ð' for transcribe
  if (
    event.ctrlKey &&
    event.altKey &&
    (event.key === "d" || event.key === "ð")
  ) {
    event.preventDefault();
    if (!document.getElementById("processBtn").disabled) {
      processFile();
    }
  }

  if (event.ctrlKey && event.altKey && event.key === "c") {
    event.preventDefault();
    if (!document.getElementById("cancelBtn").disabled) {
      cancelTranscription();
    }
  }
});

async function handleFile() {
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

function processFile() {
  if (selectedFilePaths) {
    document.getElementById("cancelBtn").disabled = false;
    document.getElementById("processBtn").disabled = true;
    window.electron.ipcRenderer.send("process-file", selectedFilePaths);
  }
}

function cancelTranscription() {
  window.electron.ipcRenderer.send("cancel-transcription");
  document.getElementById("cancelBtn").disabled = true;
  document.getElementById("processBtn").disabled = false;
}
