import { createRouter as createRouterInstance, createWebHashHistory } from 'vue-router'

export function createRouter() {
  return createRouterInstance({
    history: createWebHashHistory(),
    routes: []
  })
}
