const electron = require("electron");
const ffmpeg = require('fluent-ffmpeg');
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({width: 800, height: 600,icon: __dirname + '/eta.png'});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on("video:submit", (event, path) => {
    ffmpeg.ffprobe(path, (err, metaData) => {
        mainWindow.webContents.send("video:metadata", metaData.format.duration);
    });
});