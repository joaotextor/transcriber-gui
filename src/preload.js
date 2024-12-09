const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  showOpenDialog: () => ipcRenderer.invoke("show-open-dialog"),
  onWhisperOutput: (callback) => ipcRenderer.on("whisper-output", callback),
  onWhisperComplete: (callback) => ipcRenderer.on("whisper-complete", callback),
  ipcRenderer: {
    send: (channel, data) => {
      let validChannels = ["process-file", "cancel-transcription"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
  },
});
