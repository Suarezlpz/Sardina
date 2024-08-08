import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer

const api = {
  getProveedor: () => ipcRenderer.invoke('get_proveedor'),
  getCuentasPorPagarCuerpo: (args) => ipcRenderer.invoke('get_cuentas_por_pagar_cuerpo', args),
  getZona: () => ipcRenderer.invoke('get_zona'),
  getReporteMateriaPrima: (args) => ipcRenderer.invoke('get_reporte_materia_prima', args),
  getConfiguration: () => ipcRenderer.invoke('get_configuration'),
  setConfiguration: (args) => ipcRenderer.invoke('set_configuration', args),
  getFlete: (args) => ipcRenderer.invoke('get_flete', args),
  getProveedorFlete: () => ipcRenderer.invoke('get_proveedor_flete'),
  getPlacasReporteFlete: (args) => ipcRenderer.invoke('get_placas_reporte_flete', args),
  
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

contextBridge.exposeInMainWorld('electronAPI', {
  obtenJSON: (callback) => ipcRenderer.on('datosJson', (_event, jsonData) => callback(jsonData))
})
