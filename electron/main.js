const {app, BrowserWindow } = require('electron')

const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 450,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // 加载页面文件
    if (app.isPackaged) {
        // 如果是打包好的就加载打包的 HTML 文件
        win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);
    } else {
        // 如果没有打包就直接从本地服务器加载
        win.loadURL('http://localhost:3000/');
    }

    // win.webContents.openDevTools()
};

app.whenReady().then(() => {
    createWindow();

    // 启用特定域名的跨域资源共享 (CORS)
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        const { hostname } = new URL(details.url);
        if (hostname === 'https://chen-1302611521.cos.ap-nanjing.myqcloud.com') { // 这里替换为您的腾讯云存储域名
            callback({
                responseHeaders: {
                    ...details.responseHeaders,
                    'Access-Control-Allow-Origin': ['*'],
                    'Access-Control-Allow-Methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                    'Access-Control-Allow-Headers': ['Content-Type', 'Authorization']
                }
            });
        } else {
            callback({ responseHeaders: details.responseHeaders });
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});