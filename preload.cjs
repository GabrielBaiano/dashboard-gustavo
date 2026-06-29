// Preload script for Electron
// Exposes safe APIs to the renderer process if needed

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // We can add IPC methods here if we want to save files to disk or interact with the OS
  platform: process.platform,
});
