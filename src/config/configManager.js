const path = require("node:path");
const fs = require("fs");
const ini = require("ini");
const { dialog } = require("electron");

function getWhisperPath() {
  try {
    const configPath = path.join(__dirname, "..", "..", "config.ini");
    const config = ini.parse(fs.readFileSync(configPath, "utf-8"));
    const whisperPath = config.Paths.whisper_exe;

    if (!fs.existsSync(whisperPath)) {
      throw new Error(`Executable not found at: ${whisperPath}`);
    }

    return whisperPath;
  } catch (error) {
    dialog.showErrorBox(
      "Configuration Error",
      `Error with whisper executable: ${error.message}\nPlease check the path in config.ini`
    );
    return null;
  }
}

module.exports = {
  getWhisperPath,
};
