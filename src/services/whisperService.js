const { spawn } = require("child_process");
const { getWhisperPath } = require("../config/configManager");

function transcribeFile(filePath, directoryPath) {
  const whisperPath = getWhisperPath();

  if (!whisperPath) {
    return false;
  }

  const command = `"${whisperPath}" "${filePath}" -l Portuguese --output_format txt --output_dir "${directoryPath}"`;
  console.log("Command to execute:", command);

  const process = spawn(command, [], {
    shell: true,
    windowsHide: false,
    stdio: "inherit",
    detached: true,
  });

  return true;
}

module.exports = {
  transcribeFile,
};
