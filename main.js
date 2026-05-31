const { app, BrowserWindow } = require("electron");

function createWindow() {
  console.log("Electron started");

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
  });

  win.loadURL("http://localhost:3000/exam");

  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);