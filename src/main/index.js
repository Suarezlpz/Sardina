import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
const path = require('path')
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { PythonShell } from 'python-shell'
import icon from '../../resources/icon.png?asset'

const DBISAM_DATASOURCE = 'MATERIA_PRIMABD'
let options = {
  mode: 'text',
  args: [DBISAM_DATASOURCE]
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (require('electron-squirrel-startup')) app.quit();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  //ipcMain.handle('get-excel', async (event, someArgument) => {
  //  console.log(process.resourcesPath)

  //  return JSON.parse(messages[0])
 // })

  ipcMain.handle('get_proveedor', async (event, someArgument) => {
    console.log(process.resourcesPath)
    let messages = await PythonShell.run(
      app.isPackaged ? path.join(process.resourcesPath, 'extraResources/python_scripts','get_proveedor.py') : 'src/python_scripts/get_proveedor.py',
      options
    )
    return JSON.parse(messages[0])
  })

  ipcMain.handle('get_zona', async (event, someArgument) => {
    console.log(process.resourcesPath)
    let messages = await PythonShell.run(
      app.isPackaged ? path.join(process.resourcesPath, 'extraResources/python_scripts','get_zona.py') : 'src/python_scripts/get_zona.py',
      options
    )
    return JSON.parse(messages[0])
  })

  ipcMain.handle('get_reporte_materia_prima', async (event, args) => {
    let messages = await PythonShell.run(
      app.isPackaged ? path.join(process.resourcesPath, 'extraResources/python_scripts','get_reporte_materia_prima.py') : 'src/python_scripts/get_reporte_materia_prima.py',
      {
      mode: 'text',
      args: [DBISAM_DATASOURCE, args.fechaInicio, args.fechaFin, args.zonaQuery, args.proveedorStatusQuery, args.proveedorQuery, args.materiaPrimaQuery]
    })

    return JSON.parse(messages[0])
  })
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
