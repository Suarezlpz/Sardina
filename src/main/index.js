import { app, BrowserWindow, ipcMain, shell, globalShortcut } from 'electron'
import { join } from 'path'
const path = require('path')
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { PythonShell } from 'python-shell'
import icon from '../../resources/icon.png?asset'
import {readConfigData, writeConfigData} from "../services/ConfigService";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: '100%',
    height: '100%',
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.maximize();

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


  ipcMain.handle('get_configuration', () => {
    return readConfigData()
  })

  ipcMain.handle('set_configuration', async (event, someArgument) => {
    return writeConfigData(someArgument)
  })

  ipcMain.handle('get_proveedor', async (event, someArgument) => {
    console.log(process.resourcesPath)
    let messages = await PythonShell.run(
      app.isPackaged ? path.join(process.resourcesPath, 'extraResources/python_scripts','get_proveedor.py') : 'src/python_scripts/get_proveedor.py',
      {
        mode: 'text',
        args: [readConfigData().db_name]
      }
    )
    return JSON.parse(messages[0])
  })

  ipcMain.handle('get_detalles_de_venta', async (event, args) => {
    console.log(readConfigData().db_name)
    let messages = await PythonShell.run(
      app.isPackaged ? path.join(process.resourcesPath , 'extraResources/python_scripts','get_detalles_de_venta.py') : 'src/python_scripts/get_detalles_de_venta.py',
      {
        mode: 'text',
        args: [readConfigData().db_name, args.fechaInicio, args.fechaFin]
        
      }
    )
    return JSON.parse(messages[0])
  })


  ipcMain.handle('get_placas_reporte_flete', async (event, args) => {
    console.log(process.resourcesPath)
    let messages = await PythonShell.run(
      app.isPackaged ? path.join(process.resourcesPath, 'extraResources/python_scripts','get_placas_reporte_flete.py') : 'src/python_scripts/get_placas_reporte_flete.py',
      {
        mode: 'text',
        args: [readConfigData().db_name2, args.placaQuery]
      }
    )
    return JSON.parse(messages[0])
  })

  ipcMain.handle('get_proveedor_flete', async (event, someArgument) => {
    console.log(process.resourcesPath)
    let messages = await PythonShell.run(
      app.isPackaged ? path.join(process.resourcesPath, 'extraResources/python_scripts','get_proveedor_flete.py') : 'src/python_scripts/get_proveedor_flete.py',
      {
        mode: 'text',
        args: [readConfigData().db_name]
      }
    )
    return JSON.parse(messages[0])
  })

  ipcMain.handle('get_cuentas_por_pagar_cuerpo', async (event, args) => {
    console.log(process.resourcesPath)
    let messages = await PythonShell.run(
      app.isPackaged ? path.join(process.resourcesPath, 'extraResources/python_scripts','get_cuentas_por_pagar_cuerpo.py') : 'src/python_scripts/get_cuentas_por_pagar_cuerpo.py',
      {
        mode: 'text',
        args: [readConfigData().db_name, args.fechaInicio, args.fechaFin, args.zonaQuery, args.proveedorQuery]
      }
    )
    return JSON.parse(messages[0])
  })

  ipcMain.handle('get_zona', async (event, someArgument) => {
    console.log(process.resourcesPath)
    let messages = await PythonShell.run(
      app.isPackaged ? path.join(process.resourcesPath, 'extraResources/python_scripts','get_zona.py') : 'src/python_scripts/get_zona.py',
      {
        mode: 'text',
        args: [readConfigData().db_name]
      }
    )
    return JSON.parse(messages[0])
  })

  ipcMain.handle('get_reporte_materia_prima', async (event, args) => {
    let messages = await PythonShell.run(
      app.isPackaged ? path.join(process.resourcesPath, 'extraResources/python_scripts','get_reporte_materia_prima.py') : 'src/python_scripts/get_reporte_materia_prima.py',
      {
      mode: 'text',
      args: [readConfigData().db_name, args.fechaInicio, args.fechaFin, args.zonaQuery, args.proveedorStatusQuery, args.proveedorQuery, args.materiaPrimaQuery]
    })

    return JSON.parse(messages[0])
  })

  ipcMain.handle('get_flete', async (event, args) => {
    console.log(process.resourcesPath)
    let messages = await PythonShell.run(
      app.isPackaged ? path.join(process.resourcesPath, 'extraResources/python_scripts','get_flete.py') : 'src/python_scripts/get_flete.py',
      {
        mode: 'text',
        args: [readConfigData().db_name, args.fechaInicio, args.fechaFin, args.proveedorQuery, args.proveedorStatusQuery, args.materiaPrimaQuery]
      }
    )
    return JSON.parse(messages[0])
  })

  globalShortcut.register('Alt+CommandOrControl+I', () => {
    console.log('Electron loves global shortcuts!')
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
