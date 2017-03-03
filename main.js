(()=>{
const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron');
const path = require('path');
const url = require('url');

let win; //global reference prevents garbage collection?

const registerMessages = () => {
    //respond to async msgs from renderer
    ipcMain.on('close-main-window', (event, arg) => {
        app.quit();
        event.returnValue = null; //sync reply
    });

    ipcMain.on('async-data', (event, arg) => {
        console.log(arg); //data perhaps

        let response = 'status:200';
        event.sender.send('async-reply', response);
    });    
}
registerMessages();

const registerShortcuts = () => {
    globalShortcut.register('CommandOrControl+1', () => {
        if(win) {
            win.webContents.send('global-shortcut'); //async like
        }
    });
};

const createWindow = () => {
    const width = 800;
    const height = 800;
    const options = {
        // frame: false,
        // resizable: false,
        width,
        height
    }

    win = new BrowserWindow(options);
    loadPage(win, 'index.html');
};

const loadPage = (window, page) => {
    window.loadURL(url.format({
        pathname: path.join(__dirname, page),
        protocol: 'file:',
        slashes: true
    }));

    window.webContents.openDevTools();
    window.on('closed', () => {
        win = null//get rid of it explicitly
    })
}

//once electron is up
app.on('ready', () => {
    registerShortcuts();
    createWindow();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

//weird mac code
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
});
})();