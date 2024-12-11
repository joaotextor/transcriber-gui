const path = require("node:path");
const fs = require("fs");
const ini = require("ini");
const { dialog, app } = require("electron");

function getConfigPath() {
  return app.isPackaged
    ? path.join(app.getPath("exe"), "..", "config.ini")
    : path.join(__dirname, "..", "..", "config.ini");
}

function ensureConfigFile() {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    const defaultConfig = `[Paths]
whisper_exe=C:\\path\\to\\faster-whisper-xxl`;
    try {
      fs.writeFileSync(configPath, defaultConfig, "utf8");
    } catch (err) {
      console.error("Failed to create configuration file:", err);
    }
  }
}

async function selectWhisperDialog() {
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
      return selectWhisperDialog(); // Recursively show dialog again
    }
    updateWhisperPath(selectedPath);
    return true;
  }
  return false;
}

function getWhisperPath() {
  try {
    const configPath = getConfigPath();
    const config = ini.parse(fs.readFileSync(configPath, "utf-8"));
    const whisperPath = config.Paths.whisper_exe;

    if (!fs.existsSync(whisperPath)) {
      throw new Error(`Executable not found at: ${whisperPath}`);
    }

    return whisperPath;
  } catch (error) {
    dialog.showErrorBox(
      "Configuration Error",
      `Whisper executable not found: ${error.message}\nCheck the path on config.ini file`
    );
    return null;
  }
}

function updateWhisperPath(newPath) {
  const configPath = getConfigPath();
  const config = ini.parse(fs.readFileSync(configPath, "utf-8"));
  config.Paths.whisper_exe = newPath;
  fs.writeFileSync(configPath, ini.stringify(config), "utf-8");
}

function checkWhisperExists() {
  try {
    const configPath = getConfigPath();
    const config = ini.parse(fs.readFileSync(configPath, "utf-8"));
    const whisperPath = config.Paths.whisper_exe;
    return fs.existsSync(whisperPath);
  } catch (error) {
    return false;
  }
}

module.exports = {
  getWhisperPath,
  ensureConfigFile,
  updateWhisperPath,
  checkWhisperExists,
  selectWhisperDialog,
};
