import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { Module } from '@shared/module'
import { APP_ID } from '../constants'

export class ElectronModule extends Module<{
  'app:second-instance': () => void
}> {
  onInit() {
    electronApp.setAppUserModelId(APP_ID)

    app.on('window-all-closed', () => {
      app.quit()
    })

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    app.on('second-instance', () => {
      this.emit('app:second-instance')
    })
  }

  onDestroy() {
    // console.log('ElectronModule destroyed')
  }
}
