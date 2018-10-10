const electron = require("electron");
const fs = require('fs');
const createFile = require('create-file');
const Notification = require('electron-native-notification');
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 600,

    });
    mainWindow.loadURL(`file://${__dirname}/main.html`);

    // if main window is close, close all child windows
    mainWindow.on("closed", () => app.quit());
    
    const mainMenu = Menu.buildFromTemplate(menuTemplate);

    // set menu for app
    Menu.setApplicationMenu(mainMenu);
     
});

function showNotifiction(title, body){
    const opt = { body };
 
    const notification = new Notification(title, opt);       

    setTimeout(() => notification.close(), 2000);
}

function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: "Add new todo"
    });

    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on("closed", () => addWindow = null);
}

function readFile(cb){
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else { 
            cb(data);
        }
    });
}

ipcMain.on("todo:all", (event, data) => {
    if (!fs.existsSync('data.json')) {
        createFile('data.json', '', () => {
            readFile((data) => {
                if(!data){        
                    mainWindow.webContents.send("todo:listAll", {});
                }else{
                    const todos = JSON.parse(data);
                    mainWindow.webContents.send("todo:listAll", todos);
                }
            });
        });
    }else{
        readFile((data) => {
            if(!data){        
                mainWindow.webContents.send("todo:listAll", {});
            }else{
                const todos = JSON.parse(data);
                mainWindow.webContents.send("todo:listAll", todos);
            }
        })
    }

    
});

ipcMain.on("todo:add", (event, todo) => {
    // save todo in file
    readFile((data) => { 
        const id = Math.random().toString(36).slice(-7);
        const saveTodo = { id , todo };
        if(!data){
            fs.writeFile('data.json', JSON.stringify([saveTodo]), 'utf8', () => {}); 
            
        }else{
            const todos = JSON.parse(data);
            todos.push(saveTodo);
            fs.writeFile('data.json', JSON.stringify(todos), 'utf8', () => {}); 

            mainWindow.webContents.send("todo:list", todos);
        }
        
        mainWindow.webContents.send("todo:add", saveTodo);

        showNotifiction('Todo Saved', `Todo: ${todo} saved`);
        // close child window
        addWindow.close();
 });
});

ipcMain.on("todo:delete", (event, id) => {
    readFile((data) => {      
        const todos = JSON.parse(data);
        const updatedTodos  = todos.filter((todo) => todo.id !== id);
        fs.writeFile('data.json', JSON.stringify(updatedTodos), 'utf8', () => {}); 
        showNotifiction('Todo Deleted', `Todo deleted`);
        mainWindow.webContents.send("todo:deleted", id);    
  });
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