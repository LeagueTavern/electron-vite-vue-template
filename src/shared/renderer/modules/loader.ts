import { Module } from '@shared/module'

export class AppLoader extends Module {
  loaded() {
    setTimeout(() => {
      postMessage({ payload: 'preload:removeLoading' }, '*')
    }, 200)
  }
}
