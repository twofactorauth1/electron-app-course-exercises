const electron = require("electron");

const { app, BrowserWindow, Menu } = electron;

let mainWindwo;
let addWindow;

app.on("ready", () => {
    mainWindwo = new BrowserWindow({});
    mainWindwo.loadURL(`file://${__dirname}/main.html`);
    
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
}

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