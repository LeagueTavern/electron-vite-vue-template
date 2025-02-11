import App from './App.tsx'
import { AppLoader } from '@shared/renderer/modules/loader'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter } from './router'
import { module } from './module'
import '@shared/renderer/styles/index.css'

const router = createRouter()
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(module)
module.setup()

app.mount('#app').$nextTick(handleLoaded)

function handleLoaded() {
  const loader = module.resolve<AppLoader>('AppLoader')
  const timeout = 0.3 * 1000
  // 看完LOGO

  setTimeout(() => {
    loader.loaded()
  }, timeout)
}
