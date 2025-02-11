import path from 'node:path'
import chokidar from 'chokidar'
import { Module } from '@shared/module/module'
import type { Stats } from 'node:fs'
import type { FSWatcher } from 'chokidar'

export class FolderWatcher extends Module {
  private watchers = new Map<symbol, FSWatcher>()

  watch(
    dir: string,
    handleFileAdded: (fileName: string) => void,
    handleFileChanged: (fileName: string) => void,
    handleFileRemoved: (fileName: string) => void,
    filter?: (path: string, stat?: Stats) => boolean | Promise<boolean>
  ) {
    const mark = Symbol()
    const watcher = chokidar.watch(dir, {
      depth: 0,
      persistent: true,
      awaitWriteFinish: true,
      ignoreInitial: true
    })

    const eventTrigger = async (
      targetPath: string,
      targetStats: Stats | undefined,
      fn: (fileName: string) => void
    ) => {
      const fileName = path.basename(targetPath)
      const passed = filter ? await filter(targetPath, targetStats) : true
      if (passed) {
        fn(fileName)
      }
    }

    watcher
      .on('add', (path, stats) => eventTrigger(path, stats, handleFileAdded))
      .on('change', (path, stats) => eventTrigger(path, stats, handleFileChanged))
      .on('unlink', (path, stats) => eventTrigger(path, stats, handleFileRemoved))

    this.watchers.set(mark, watcher)

    return mark
  }

  unwatch(symbol: symbol) {
    const watcher = this.watchers.get(symbol)
    if (watcher) {
      watcher.close()
      watcher.removeAllListeners()
      this.watchers.delete(symbol)
    }
  }
}
