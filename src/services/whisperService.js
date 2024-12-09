const { spawn } = require("child_process");
const { getWhisperPath } = require("../config/configManager");

class WhisperService {
  constructor() {
    this.currentProcess = null;
  }

  transcribeFile(filePath, directoryPath, window) {
    const whisperPath = getWhisperPath();
    if (!whisperPath) return false;

    const command = `"${whisperPath}" "${filePath}" --output_format txt --output_dir "${directoryPath}"`;

    this.currentProcess = spawn(command, [], {
      shell: true,
      windowsHide: true,
      stdio: "pipe",
      detached: false,
    });

    this.currentProcess.stdout.on("data", (data) => {
      window.webContents.send("whisper-output", data.toString());
    });

    this.currentProcess.stderr.on("data", (data) => {
      window.webContents.send("whisper-output", data.toString());
    });

    this.currentProcess.on("close", (code) => {
      window.webContents.send("whisper-complete", code);
      this.currentProcess = null;
    });

    return true;
  }

  cancelTranscription() {
    if (this.currentProcess) {
      if (process.platform === "win32") {
        require("child_process").exec(
          `taskkill /pid ${this.currentProcess.pid} /T /F`
        );
      } else {
        this.currentProcess.kill("SIGTERM");
      }
    }
  }
}

module.exports = new WhisperService();
