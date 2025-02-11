import { Server } from 'socket.io'
import { Module } from '@shared/module'
import { Dependency } from '@shared/module/injector'
import { HttpServer } from './http-server'

export class SocketServer extends Module {
  @Dependency('HttpServer') private http!: HttpServer

  private server: Server | null = null

  onInit(): void {
    this.server = new Server(this.http.serverInstance, {
      path: '/socket',
      serveClient: false,
      cors: {
        origin: ['https://amritb.github.io'],
        credentials: true
      }
    })
  }

  onDestroy(): void {
    this.server?.close()
  }

  get instance(): Server {
    return this.server!
  }
}
