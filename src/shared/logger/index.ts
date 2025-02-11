import type { LoggerType } from './types'

export * from './types'

export class Logger {
  private static latestLogTime = 0

  private static time() {
    const time = new Date()
    const hour = time.getHours().toString().padStart(2, '0')
    const minute = time.getMinutes().toString().padStart(2, '0')
    const second = time.getSeconds().toString().padStart(2, '0')

    return `${hour}:${minute}:${second}`
  }

  public static log(type: LoggerType, ...args: string[]) {
    const timeNow = Date.now()
    const prefix = `[${this.time()}][${type.toUpperCase()}]`
    const suffix = this.latestLogTime > 0 ? `(+${timeNow - this.latestLogTime}ms)` : ''

    console.info(prefix, ...args, suffix)

    this.latestLogTime = timeNow
  }
}
