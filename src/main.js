const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { exec, spawn } = require("child_process");
const path = require("node:path");

if (process.platform === "win32") {
  process.env.LANG = "en_US.UTF-8";
  process.env.CHCP = "65001";
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // Add this line
    },
  });

  win.webContents.openDevTools(); // For debugging
  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("Failed to load:", errorDescription);
  });
  win.loadFile("src/index.html");
}

app.whenReady().then(createWindow);

ipcMain.on("process-file", (event, paths) => {
  console.log("1. Process file triggered");
  const { filePath, directoryPath } = paths;

  const command = `faster-whisper-xxl.exe "${filePath}" -l Portuguese --output_format txt --output_dir "${directoryPath}"`;
  console.log("2. Command to execute:", command);

  const process = spawn(command, [], {
    shell: true,
    windowsHide: false,
    stdio: ["inherit", "pipe", "pipe"],
  });

  process.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  process.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  console.log("5. After exec call");
});

ipcMain.handle("show-open-dialog", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      { name: "Media Files", extensions: ["mp3", "wav", "mp4", "avi", "mov"] },
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
