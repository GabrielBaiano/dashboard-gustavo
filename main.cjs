const { app, BrowserWindow, Menu, Tray, nativeImage } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

// Base64 16x16 pink/fuchsia circle for a self-contained fallback tray icon
const trayIconBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAb0lEQVQ4T2P4//8/AyUYiKmPqQeEzTjEsGHTf4Z/DHzEazh+/M9w/fI9hscPHzJ8fveFwW2gL17D0eN/GHYu3cHw7/9/huxZuxxRDWNiNTAwQPz38/s/hjPbrzMiG8bEakBwA7oXb2d49eQtI7oawgAAv3M/gT+F1HkAAAAASUVORK5CYII=';

// Prevent app from quitting immediately when closing all windows
app.isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    backgroundColor: '#09090b', // zinc-950/dark theme background
    title: 'Yellowhood Instagram Engagement Dashboard',
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Open the DevTools automatically in dev mode.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Remove default menu for a cleaner, premium application look
  if (!isDev) {
    Menu.setApplicationMenu(null);
  }

  // Intercept close event to hide window instead of quitting (system tray mode)
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createTray() {
  const icon = nativeImage.createFromDataURL(trayIconBase64);
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar Painel',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Yellowhood Dashboard');
  tray.setContextMenu(contextMenu);

  // Toggle window on tray click
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && app.isQuitting) {
    app.quit();
  }
});
