const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  showOpenDialog: () => ipcRenderer.invoke("show-open-dialog"),
  onWhisperOutput: (callback) => ipcRenderer.on("whisper-output", callback),
  onWhisperComplete: (callback) => ipcRenderer.on("whisper-complete", callback),
  setLanguage: (lang) => ipcRenderer.invoke("set-language", lang),
  getCurrentTranslations: () => ipcRenderer.invoke("get-translations"),
  checkWhisperExists: () => ipcRenderer.invoke("check-whisper-exists"),
  selectWhisperExe: () => {
    console.log("Preload: selectWhisperExe called");
    return ipcRenderer.invoke("select-whisper-exe");
  },
  ipcRenderer: {
    send: (channel, data) => {
      let validChannels = ["process-file", "cancel-transcription"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
  },
});
