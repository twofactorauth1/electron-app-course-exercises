const electron = require("electron");

const { app, BrowserWindow, Menu } = electron;

let mainWindwo;

app.on("ready", () => {
    mainWindwo = new BrowserWindow({});
    mainWindwo.loadURL(`file://${__dirname}/main.html`);
    
    const mainMenu = Menu.buildFromTemplate(menuTemplate);

    // set menu for app
    Menu.setApplicationMenu(mainMenu);

});

const menuTemplate = [
    {
        label: "File",
        submenu: [
            { label: "New Todo" },
            { label: "Quit" , click(){
                app.quit();
            }}
       ]
    }
];

// platform check
if(process.platform === "darwin"){
    menuTemplate.unshift({});
}