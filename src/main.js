const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const { transcribeFile } = require("./services/whisperService");
const { ensureConfigFile } = require("./config/configManager");

if (process.platform === "win32") {
  process.env.LANG = "en_US.UTF-8";
  process.env.CHCP = "65001";
}

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 300,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });
  win.removeMenu();
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
  transcribeFile(filePath, directoryPath);
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
