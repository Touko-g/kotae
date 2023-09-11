const {app, BrowserWindow, ipcMain} = require('electron')
const {autoUpdater} = require("electron-updater");
const path = require('path');

let win

//Basic flags
autoUpdater.autoDownload = false;

autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'https://kotae.cn/update/'
})

const createWindow = () => {
    win = new BrowserWindow({
        width: 450,
        height: 700,
        icon: path.join(__dirname, '../public/kotae.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity:false
        },
        frame:false
    });

    // 加载页面文件
    if (app.isPackaged) {
        // 如果是打包好的就加载打包的 HTML 文件
        win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);
    } else {
        // 如果没有打包就直接从本地服务器加载
        win.loadURL('http://localhost:3000/');
        win.webContents.openDevTools()
    }
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

const sendUpdateMessage = (win, key, value) => {
    win && win.webContents.send('check-update', {key, value})
}

autoUpdater.checkForUpdates();

/*New Update Available*/
autoUpdater.on("update-available", (info) => {
    let pth = autoUpdater.downloadUpdate();
    sendUpdateMessage(win, "update_available", "update_available")
});

autoUpdater.on("update-not-available", (info) => {
    sendUpdateMessage(win, "update_not_available", "update_not_available")
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
    sendUpdateMessage(win, "update_downloaded", "update_downloaded")
    autoUpdater.quitAndInstall()
    app.quit()
});

autoUpdater.on('download-progress', (progress) => {
    sendUpdateMessage(win, "download_progress", progress.percent)
})

autoUpdater.on("error", (error) => {
    sendUpdateMessage(win, "error", error || 'Error checking for updates')
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
