const electron = require("electron");
const path  = require("path");
const { app, BrowserWindow, Tray } = electron;

let mainWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        height: 470,
        width: 300,
        frame: false,
        resizable: false,
    });
    mainWindow.loadURL(`file://${__dirname}/src/index.html`);
    
    const iconName = process.platform === "win32" ? "windows-icon.png" : "iconTemplate@2x.png";
    const iconPath = path.join(__dirname + `/src/assets/${iconName}`);
    new Tray(iconPath);
});