const electron = require("electron");
const fs = require('fs');
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

ipcMain.on("todo:all", (event, data) => {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        if(!data){
            console.log('-----------todos----s--');

            mainWindow.webContents.send("todo:listAll", {});
        }else{
            const todos = JSON.parse(data);
            console.log('-----------todos------',todos);
            mainWindow.webContents.send("todo:listAll", todos);
        }

    }}); 
});

ipcMain.on("todo:add", (event, todo) => {
    // save todo in file
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        const id = Math.random().toString(36).slice(-7);
        const saveTodo = { id , todo };
        if(!data){
            fs.writeFile('data.json', JSON.stringify([saveTodo]), 'utf8', () => {}); 
            
        }else{
            const todos = JSON.parse(data);
            todos.push(saveTodo);
            console.log('-----------todos------',todos);
            fs.writeFile('data.json', JSON.stringify(todos), 'utf8', () => {}); 

            mainWindow.webContents.send("todo:list", todos);
        }
        
        mainWindow.webContents.send("todo:add", saveTodo);

        // close child window
        addWindow.close();
    }});
});

ipcMain.on("todo:delete", (event, id) => {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {       

        const todos = JSON.parse(data);
        const updatedTodos  = todos.filter((todo) => todo.id !== id);
        console.log('-----------todos------',updatedTodos);
        fs.writeFile('data.json', JSON.stringify(updatedTodos), 'utf8', () => {}); 

        mainWindow.webContents.send("todo:deleted", id);
       
    }});
    console.log("--------", id);
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