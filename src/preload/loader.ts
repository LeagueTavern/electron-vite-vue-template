import icon from '@shared/assets/vector/icon-leaguetavern.svg?raw'

export class AppLoader {
  private static className = `loader-icon`
  private static classHideDuration = 320
  private static conditionStatus: DocumentReadyState[] = ['complete', 'interactive']
  private static styleContent = `
    .${AppLoader.className} svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      transform-origin: 0% 0%;
      width: 128px;
      height: 128px;
    }

    .app-loading-wrap {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0;
      padding: 0;
      border: 0;
      background: #0F1119;
      overflow: hidden;
      z-index: 100000;
      -webkit-app-region: drag;
      -webkit-user-drag: none;
    }

    .app-loading-wrap.hide {
      opacity: 0;
      transition: opacity ${AppLoader.classHideDuration}ms;
    }

    .app-loading-wrap.hide .${AppLoader.className} svg {
      transform: scale(0.9) translate(-50%, -50%);
      transition: transform ${AppLoader.classHideDuration}ms;
    }
  `
  private static oStyle = document.createElement('style')
  private static oDiv = document.createElement('div')

  static {
    AppLoader.oStyle.id = 'app-loading-style'
    AppLoader.oStyle.innerHTML = AppLoader.styleContent
    AppLoader.oDiv.className = 'app-loading-wrap'
    AppLoader.oDiv.innerHTML = `<div class="${AppLoader.className}">${icon}</div>`
  }

  static whenReady(): Promise<boolean> {
    return new Promise((resolve) => {
      const checkReadyState = () => {
        if (AppLoader.conditionStatus.includes(document.readyState)) {
          resolve(true)
          document.removeEventListener('readystatechange', checkReadyState)
        }
      }

      checkReadyState() // Initial check
      document.addEventListener('readystatechange', checkReadyState)
    })
  }

  static whenLoaded(): Promise<boolean> {
    return new Promise((resolve) => {
      window.addEventListener('message', (ev) => {
        if (ev.data.payload === 'preload:removeLoading') {
          resolve(true)
        }
      })
    })
  }

  static appendLoading() {
    document.head.appendChild(AppLoader.oStyle)
    document.body.appendChild(AppLoader.oDiv)
  }

  static removeLoading() {
    AppLoader.oDiv.classList.add('hide')
    setTimeout(() => {
      AppLoader.oStyle.remove()
      AppLoader.oDiv.remove()
    }, AppLoader.classHideDuration)
  }
}
