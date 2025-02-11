import 'reflect-metadata'
import { Module } from './module'
import { Logger } from '@shared/logger'
import { type ModuleConstructor } from './types'

export { Module }

export class ModuleManager {
  private services: Map<string, new (moduleId: string) => Module> = new Map()
  private instances: Map<string, Module> = new Map()
  private setupOrder: string[] = []

  // 注册模块
  register(serviceIdentifier: string, constructor: ModuleConstructor) {
    this.services.set(serviceIdentifier, constructor)
  }

  // 获取模块实例
  resolve<T extends Module>(serviceIdentifier: string): T {
    const instance = this.instances.get(serviceIdentifier)
    if (!instance) {
      throw new Error(`Service ${serviceIdentifier} not found`)
    }
    return instance as T
  }

  // 初始化
  setup() {
    const dependencyGraph: Map<string, Set<string>> = new Map()
    for (const [identifier, constructor] of this.services.entries()) {
      const injectedServices = Reflect.getMetadata('injected:services', constructor.prototype) || {}
      dependencyGraph.set(identifier, new Set(Object.values(injectedServices) as string[]))
    }

    // 排序
    const sortedServices = this._sort(dependencyGraph)
    this.setupOrder = sortedServices

    // 初始化
    for (const identifier of sortedServices) {
      if (this.instances.has(identifier)) continue

      const constructor = this.services.get(identifier)
      if (!constructor) continue

      const instance = new constructor(identifier)
      this.instances.set(identifier, instance)

      // 注入依赖
      const injectedServices = Reflect.getMetadata('injected:services', constructor.prototype) || {}

      for (const [key, dep] of Object.entries(injectedServices)) {
        instance[key] = this.resolve(dep as string)
      }

      instance.init()

      // log
      Logger.log('info', `Service ${identifier} initialized`)
    }
  }

  destroy() {
    for (const identifier of [...this.setupOrder].reverse()) {
      const instance = this.instances.get(identifier)
      if (instance) {
        instance.destroy()
        this.instances.delete(identifier)
        Logger.log('info', `Service ${identifier} destroyed`)
      }
    }
    this.setupOrder = []
  }

  // 拓扑排序
  private _sort(graph: Map<string, Set<string>>): string[] {
    const sorted: string[] = []
    const visited: Set<string> = new Set()
    const tempMark: Set<string> = new Set()

    const visit = (node: string) => {
      if (tempMark.has(node)) {
        throw new Error(`Circular dependency detected: ${node}`)
      }

      if (!visited.has(node)) {
        tempMark.add(node)
        const dependencies = graph.get(node) || new Set()
        for (const dep of dependencies) {
          visit(dep)
        }
        tempMark.delete(node)
        visited.add(node)
        sorted.push(node)
      }
    }

    for (const node of graph.keys()) {
      visit(node)
    }
    return sorted
  }
}
