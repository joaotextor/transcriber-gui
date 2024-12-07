const path = require("node:path");
const fs = require("fs");
const { app } = require("electron");

function ensureConfigFile() {
  const configPath = path.join(app.getPath("exe"), "..", "config.ini");
  if (!fs.existsSync(configPath)) {
    // Create default config content
    const defaultConfig = `[Whisper]
model_path=C:\\path\\to\\faster-whisper-xxl`;

    try {
      fs.writeFileSync(configPath, defaultConfig, "utf8");
    } catch (err) {
      console.error("Failed to create config file:", err);
    }
  }
}
