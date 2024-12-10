let fileSelectedLabel = "Arquivo selecionado";
let errorLabel = "Erro";
let transcriptionCompletedText = "Transcrição concluída!";
let transcriptionCanceledText = "Transcrição cancelada!";

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
}

export {
  loadTranslations,
  changeLanguage,
  bindLanguageSelector,
  fileSelectedLabel,
  errorLabel,
  transcriptionCompletedText,
  transcriptionCanceledText,
};
