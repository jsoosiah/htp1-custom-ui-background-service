import { contextBridge, ipcRenderer } from 'electron';
import find from 'local-devices';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ['ipListToMain', 'connected', 'installUpdateRequested'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ['ipListFromMain', 'readyToInstall'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});

find().then((devices) => {
  console.log(
    'dev',
    devices.map((device) => device.ip)
  );
  // mainWindow.webContents.send('ipList', devices.map(device => device.ip));
  ipcRenderer.send(
    'ipListToMain',
    devices.map((device) => device.ip)
  );
});
