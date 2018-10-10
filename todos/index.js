const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);

    // if main window is close, close all child windows
    mainWindow.on("closed", () => app.quit());
    
    const mainMenu = Menu.buildFromTemplate(menuTemplate);

    // set menu for app
    Menu.setApplicationMenu(mainMenu);

});

function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: "Add new todo"
    });

    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on("closed", () => addWindow = null);
}

ipcMain.on("todo:add", (event, todo) => {
    mainWindow.webContents.send("todo:add", todo);

    // close child window
    addWindow.close();
});

const menuTemplate = [
    {
        label: "File",
        submenu: [
            { 
                label: "New Todo",
                click(){
                    createAddWindow();
                }
            },
            {
                label: "Quit" ,
                accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
                click(){
                app.quit();
            }}
       ]
    }
];

// platform check
if(process.platform === "darwin"){
    menuTemplate.unshift({});
}

if(process.env.NODE_ENV !== "production"){
    menuTemplate.push(
        {
            role: 'reload',
        },
        {
        label: 'View',
        accelerator: process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
        submenu: [{
            label: 'Toggle Developer Tools',
            click(item, focusedWindow){
              focusedWindow.toggleDevTools();
            }
        }]
    });
} 