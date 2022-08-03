const { app, dialog, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");
const path = require("path");
const { shell } = require("electron");
const getmac = require("getmac");
const electron = require("electron");
const Menu = electron.Menu;
// require("@electron/remote/main").initialize()

function createWindow() {
  const window = new BrowserWindow({
    height: 720,
    width: 1280,
    minWidth: 600,
    minHeight: 200,
    icon: __dirname + "/icon.ico",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });
  window.webContents.on("did-finish-load", () => {
    let data = getmac.default();
    window.webContents.send("sending", data);
    // localStorage.setItem("macId", data);
  });
  window.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  autoUpdater.checkForUpdates();
}

// app.on("ready", createWindow);

app.on("ready", function () {
  createWindow();

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Exit",
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "Undo" },
        { role: "Redo" },
        { role: "Cut" },
        { role: "Copy" },
        { role: "Paste" },
        { role: "SelectAll" },
      ],
    },
    {
      label: "View",
      submenu: [{ role: "Togglefullscreen" }],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About ImageProof",
          click: function () {
            electron.shell.openExternal("https://imageproof.ai/");
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on("window-all-closed", () => {
  if (process.platform === "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["OK"],
    title: "Application Updates",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail: "A new version is being downloaded",
  };
  dialog.showMessageBox(dialogOpts, (response) => {});
});

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Updates",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "A new version has been downloaded restart the application to apply the updates",
  };
  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});
