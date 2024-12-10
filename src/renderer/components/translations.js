let fileSelectedLabel = "Arquivo selecionado";
let errorLabel = "Erro";
let transcriptionCompletedText = "Transcrição concluída!";
let transcriptionCanceledText = "Transcrição cancelada!";
let whisperLoaded = "Whisper Carregado";
let whisperNotFound = "Whisper não encontrado!";

async function updateWhisperStatus() {
  const whisperBtn = document.getElementById("whisperStatusBtn");
  const exists = await window.electron.checkWhisperExists();

  if (exists) {
    whisperBtn.textContent = whisperLoaded;
    whisperBtn.classList.add("found");
    whisperBtn.classList.remove("not-found");
    whisperBtn.disabled = true;
  } else {
    whisperBtn.textContent = whisperNotFound;
    whisperBtn.classList.add("not-found");
    whisperBtn.classList.remove("found");
    whisperBtn.disabled = false;
  }
}

function bindWhisperButton() {
  console.log("Binding whisper button...");
  const whisperBtn = document.getElementById("whisperStatusBtn");
  if (!whisperBtn) {
    console.error("Whisper button not found!");
    return;
  }

  whisperBtn.addEventListener("click", async () => {
    try {
      const success = await window.electron.selectWhisperExe();
      if (success) {
        updateWhisperStatus();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
}

function bindLanguageSelector() {
  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) {
    languageSelect.addEventListener("change", (event) => {
      changeLanguage(event.target.value);
    });
  }
}

async function loadTranslations() {
  const translations = await window.electron.getCurrentTranslations();
  updatePageText(translations);
  updateWhisperStatus(translations);
}

async function changeLanguage(lang) {
  const translations = await window.electron.setLanguage(lang);
  updatePageText(translations);
}

function updatePageText(translations) {
  document.title = translations.title;
  document.querySelector("h1").textContent = translations.title;
  document.querySelector("h2").textContent = translations.subtitle;
  document.querySelector("#selectedFile").textContent =
    translations.noFileSelected;

  document.querySelector(
    "#selectFileBtn"
  ).innerHTML = `${translations.selectFile} <span style="display: block; font-size: 14px">(Ctrl+Alt+A)</span>`;
  document.querySelector(
    "#processBtn"
  ).innerHTML = `${translations.transcribe} <span style="display: block; font-size: 14px">(Ctrl+Alt+D)</span>`;
  document.querySelector(
    "#cancelBtn"
  ).innerHTML = `${translations.cancel} <span style="display: block; font-size: 14px">(Ctrl+Alt+C)</span>`;
  document.querySelector(
    "#cleanConsoleBtn"
  ).innerHTML = `${translations.cancel} <span style="display: block; font-size: 14px">(Ctrl+Alt+X)</span>`;

  fileSelectedLabel = translations.fileSelected;
  errorLabel = translations.error;
  transcriptionCompletedText = translations.transcriptionCompleted;
  transcriptionCanceledText = translations.transcriptionCanceled;
  whisperLoaded = translations.whisperLoaded;
  whisperNotFound = translations.whisperNotFound;
  updateWhisperStatus();
}

export {
  loadTranslations,
  changeLanguage,
  bindLanguageSelector,
  fileSelectedLabel,
  bindWhisperButton,
  errorLabel,
  transcriptionCompletedText,
  transcriptionCanceledText,
};
