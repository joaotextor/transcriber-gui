const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const whisperService = require("./services/whisperService");
const languageService = require("./services/languageService");
const {
  ensureConfigFile,
  updateWhisperPath,
  checkWhisperExists,
} = require("./config/configManager");

if (process.platform === "win32") {
  process.env.LANG = "en_US.UTF-8";
  process.env.CHCP = "65001";
}

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 800,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });
  // win.removeMenu();
  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("Failed to load:", errorDescription);
  });
  win.loadFile("src/index.html");
}

app.whenReady().then(() => {
  ensureConfigFile();
  createWindow();
});

ipcMain.on("process-file", (event, paths) => {
  const { filePath, directoryPath } = paths;
  const window = BrowserWindow.getFocusedWindow();
  whisperService.transcribeFile(filePath, directoryPath, window);
});

ipcMain.on("cancel-transcription", () => {
  whisperService.cancelTranscription();
});

ipcMain.handle("show-open-dialog", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      {
        name: "Media Files",
        extensions: [
          "mp3",
          "wav",
          "mp4",
          "avi",
          "mov",
          "m4a",
          "mkv",
          "flv",
          "wmv",
          "ogg",
          "webm",
          "aac",
          "wma",
          "flac",
        ],
      },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    return {
      filePath: filePath,
      directoryPath: path.dirname(filePath),
    };
  }
  return null;
});

// Check whisper

ipcMain.handle("check-whisper-exists", async () => {
  return checkWhisperExists();
});

ipcMain.handle("select-whisper-exe", async () => {
  async function showDialog() {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Faster Whisper XXL", extensions: ["exe"] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const selectedPath = result.filePaths[0];
      if (
        path.basename(selectedPath).toLowerCase() !== "faster-whisper-xxl.exe"
      ) {
        await dialog.showErrorBox(
          "Invalid File",
          "Please select faster-whisper-xxl.exe"
        );
        return showDialog(); // Recursively show dialog again
      }
      updateWhisperPath(selectedPath);
      return true;
    }
    return false;
  }

  return showDialog();
});

// Translations

ipcMain.handle("set-language", async (event, lang) => {
  return languageService.setLanguage(lang);
});

ipcMain.handle("get-translations", async () => {
  return languageService.getCurrentTranslations();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
