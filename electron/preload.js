const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('controlAPI', {
    setScreen: (status) => ipcRenderer.send('set-screen', status),
    checkUpdate: (callback) => ipcRenderer.on('check-update', callback)
})