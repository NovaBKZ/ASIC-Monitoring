const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC обработчики
ipcMain.on('run-monitor', (event, args) => {
  exec('python3 monitor.py', (error, stdout, stderr) => {
    if (error) {
      event.reply('monitor-output', `Ошибка: ${error.message}`);
      return;
    }
    if (stderr) {
      event.reply('monitor-output', `Сбой: ${stderr}`);
      return;
    }
    event.reply('monitor-output', stdout);
  });
});

ipcMain.on('restart-asic', (event, ip) => {
  // Пример команды для перезагрузки
  exec(`curl -u admin:admin --digest "http://${ip}/cgi-bin/reboot.cgi"`, (error, stdout, stderr) => {
    if (error) {
      event.reply('asic-action-response', `Ошибка: ${error.message}`);
      return;
    }
    if (stderr) {
      event.reply('asic-action-response', `Сбой: ${stderr}`);
      return;
    }
    event.reply('asic-action-response', `Устройство ${ip} перезагружено.`);
  });
});
