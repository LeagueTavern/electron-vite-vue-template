import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { AppLoader } from './loader'

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electron', electronAPI)
}

AppLoader.whenReady().then(() => {
  AppLoader.appendLoading()
})

AppLoader.whenLoaded().then(() => {
  AppLoader.removeLoading()
})
