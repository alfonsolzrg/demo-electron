const { app, Menu, Notification } = require("electron");
const Pushy = require('pushy-electron');


function createWindow () {
  console.log('Creating mainWindow  !!')
  const window = require("./src/window");
  mainWindow = window.createBrowserWindow(app);    
  mainWindow.loadURL("https://app.hilos.io/inbox");
  // Display Dev Tools
  //mainWindow.openDevTools();
  mainWindow.webContents.on('did-finish-load', () => {
      // Initialize Pushy
      Pushy.listen();

      Pushy.register({ appId: 'pushy-app-id' }).then((deviceToken) => {
          // Display an alert with device token          
          Pushy.alert(mainWindow, 'Pushy device token: ' + deviceToken);
      }).catch((err) => {
          // Display error dialog
          Pushy.alert(mainWindow, 'Pushy registration error: ' + err.message);
      });

      // Listen for push notifications
      Pushy.setNotificationListener((data) => {
          // Display an alert with the "message" payload value          
          new Notification({ title: "Hilos", body: data.message }).show()          
      });
  });
  // Menu (for standard keyboard shortcuts)
  const menu = require("./src/menu");
  const template = menu.createTemplate(app.name);
  const builtMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(builtMenu);
}

// This method will be called when Electron has finished initialization and is ready to create browser windows
app.allowRendererProcessReuse = true;
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})