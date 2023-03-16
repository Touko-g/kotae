const {app, BrowserWindow, ipcMain} = require('electron')
const {autoUpdater} = require("electron-updater");
const path = require('path');

let win

//Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

const createWindow = () => {
    win = new BrowserWindow({
        width: 450,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: false
    });

    // 加载页面文件
    if (app.isPackaged) {
        // 如果是打包好的就加载打包的 HTML 文件
        win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);
    } else {
        // 如果没有打包就直接从本地服务器加载
        win.loadURL('http://localhost:3000/');
    }

    win.webContents.openDevTools()
};

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('set-screen', (event, args) => {
        switch (args) {
            case 'max':
                win.isMaximized() ? win.unmaximize() : win.maximize()
                break;
            case 'min':
                win.minimize()
                break;
            case 'close':
                win.close()
                break;
            default:
                break;
        }
    })

    // 启用特定域名的跨域资源共享 (CORS)
    // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    //     const {hostname} = new URL(details.url);
    //     if (hostname === 'https://chen-1302611521.cos.ap-nanjing.myqcloud.com') { // 这里替换为您的腾讯云存储域名
    //         callback({
    //             responseHeaders: {
    //                 ...details.responseHeaders,
    //                 'Access-Control-Allow-Origin': ['*'],
    //                 'Access-Control-Allow-Methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    //                 'Access-Control-Allow-Headers': ['Content-Type', 'Authorization']
    //             }
    //         });
    //     } else {
    //         callback({responseHeaders: details.responseHeaders});
    //     }
    // });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

autoUpdater.checkForUpdates();

/*New Update Available*/
autoUpdater.on("update-available", (info) => {
    let pth = autoUpdater.downloadUpdate();
    alert(`Update available. Current version ${app.getVersion()}`)
    win.webContents.send('check-update', pth, `Update available. Current version ${app.getVersion()}`)
});

autoUpdater.on("update-not-available", (info) => {
    alert(`No update available. Current version ${app.getVersion()}`)
    win.webContents.send('check-update', `No update available. Current version ${app.getVersion()}`)
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
    alert(`Update downloaded. Current version ${app.getVersion()}`)
    win.webContents.send('check-update', `Update downloaded. Current version ${app.getVersion()}`)
});

autoUpdater.on("error", (error) => {
    alert(JSON.stringify(error))
    win.webContents.send('check-update', error)
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});