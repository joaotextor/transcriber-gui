const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  showOpenDialog: () => ipcRenderer.invoke("show-open-dialog"),
  ipcRenderer: {
    send: (channel, data) => {
      let validChannels = ["process-file"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
  },
});
