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

module.exports = {
  getWhisperPath,
  ensureConfigFile,
};
