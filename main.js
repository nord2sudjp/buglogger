const path = require("path");
const url = require("url");
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const connectDB = require("./config/db.js");
const Log = require("./models/Log.js");

connectDB();

let mainWindow;

let isDev = false;

const isMac = process.platform == "darwin" ? true : false;

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  isDev = true;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1400 : 1100,
    height: 800,
    show: false,
    backgroundColor: "white",
    icon: `${__dirname}/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  let indexPath;

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Open devtools if dev
    if (isDev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools: ", err)
      );
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
});

const menu = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  { role: "fileMenu" },
  { role: "editMenu" },
  {
    label: "Logs",
    submenu: [{ label: "Clear Logs", click: () => clearLogs() }],
  },
  {
    label: "Developer",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "separator" },
      { role: "toggledevtools" },
    ],
  },
];

ipcMain.on("logs:load", sendLogs);

ipcMain.on("logs:add", async (e, item) => {
  console.log("logs@add:", item);
  try {
    await Log.create(item);
    sendLogs();
  } catch (err) {
    console.log("logs@add:", err);
  }
});

ipcMain.on("logs:delete", async (e, _id) => {
  console.log("logs@delete:", _id);
  try {
    await Log.findOneAndDelete({ _id: _id });
    sendLogs();
  } catch (err) {
    console.log("logs@delete:", err);
  }
});

async function sendLogs() {
  try {
    const logs = await Log.find().sort({ created: 1 });
    console.log("sendLogs: ", logs);
    mainWindow.webContents.send("logs:get", JSON.stringify(logs));
  } catch (err) {
    console.log(err);
  }
}

async function clearLogs() {
  try {
    await Log.deleteMany({});
    mainWindow.webContents.send("logs:clear");
  } catch (err) {
    console.log("clearLogs:", err);
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Stop error
app.allowRendererProcessReuse = true;
