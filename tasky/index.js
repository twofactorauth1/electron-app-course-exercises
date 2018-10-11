const electron = require("electron");
const path  = require("path");
const { app, BrowserWindow, Tray } = electron;

let mainWindow, tray;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        height: 470,
        width: 300,
        frame: false,
        resizable: false,
        show: false,
    });

    mainWindow.loadURL(`file://${__dirname}/src/index.html`);
    
    const iconName = process.platform === "win32" ? "windows-icon.png" : "iconTemplate@2x.png";
    const iconPath = path.join(__dirname + `/src/assets/${iconName}`);
    tray = new Tray(iconPath);
    tray.on("click", (event, bounds) => {
        // click enent bounds
        const { x, y } = bounds;

        // window height and width
        const { height, width } = mainWindow.getBounds();

        console.log(bounds.x, bounds.y);
        if(mainWindow.isVisible()){
            mainWindow.hide();
        }else{
            mainWindow.setBounds({
                x: x - width / 2,
                y,
                height,
                width,
            })
            mainWindow.show();
        } 
    })
});