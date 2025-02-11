import { BrowserWindow, shell } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import { Module } from '@shared/module'
import { Dependency } from '@shared/module/injector'
import { ElectronModule } from './electron'

export class MainWindow extends Module {
  @Dependency('ElectronModule') private app!: ElectronModule

  static MAINWINDOW_NAME = 'DanmaCat'
  static MAINWINDOW_PAGE_NAME = 'main'
  static MAINWINDOW_WIDTH = 1378
  static MAINWINDOW_HEIGHT = 768
  static MAINWINDOW_PARTITION = 'partition:main'

  static IS_DEV_ENV = is.dev && process.env['ELECTRON_RENDERER_URL']
  static ENTRY_DEV_ENTRY = `${process.env['ELECTRON_RENDERER_URL']}/${MainWindow.MAINWINDOW_PAGE_NAME}.html`
  static ENTRY_PRODUCTION_ENTRY = join(
    __dirname,
    `../renderer/${MainWindow.MAINWINDOW_PAGE_NAME}.html`
  )

  private mainWindow!: BrowserWindow

  onInit() {
    this.mainWindow = this._createWindow()
    this.app.on('app:second-instance', this._handleSecondInstance)
  }

  onDestroy() {
    this.mainWindow?.destroy()
    this.app.removeListener('app:second-instance', this._handleSecondInstance)
  }

  show() {
    this.mainWindow.show()
  }

  hide() {
    this.mainWindow.hide()
  }

  private _createWindow(): BrowserWindow {
    const width = MainWindow.MAINWINDOW_WIDTH
    const height = MainWindow.MAINWINDOW_HEIGHT

    const mainWindow = new BrowserWindow({
      title: MainWindow.MAINWINDOW_NAME,
      width: width,
      height: height,
      show: false,
      minWidth: width,
      minHeight: height,
      autoHideMenuBar: true,
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#00000000',
        symbolColor: '#FFFFFF',
        height: 32
      },
      backgroundColor: '#0F1119',
      webPreferences: {
        preload: join(__dirname, '../preload/index.mjs'),
        sandbox: false,
        partition: MainWindow.MAINWINDOW_PARTITION
      }
    })

    mainWindow.on('ready-to-show', () => {
      mainWindow.show()
    })

    mainWindow.webContents.setZoomFactor(1)
    mainWindow.webContents.setVisualZoomLevelLimits(1, 1)
    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (MainWindow.IS_DEV_ENV) {
      mainWindow.loadURL(MainWindow.ENTRY_DEV_ENTRY)
    } else {
      mainWindow.loadFile(MainWindow.ENTRY_PRODUCTION_ENTRY)
    }

    return mainWindow
  }

  private _handleSecondInstance = () => {
    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore()
    }
    this.mainWindow.show()
    this.mainWindow.focus()
  }

  get webContents() {
    return this.mainWindow?.webContents
  }

  get session() {
    return this.mainWindow?.webContents.session
  }
}
