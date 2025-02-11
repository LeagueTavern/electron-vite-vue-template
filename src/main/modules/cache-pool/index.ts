import { Module } from '@shared/module'
import type { CacheInstance } from './types'

// LRU(?)
export class CachePool extends Module {
  private cache = new Map<string, CacheInstance>()
  private cacheCleanupTimer: NodeJS.Timeout | null = null

  static CACHE_MAXAGE = 5 * 60 * 1000
  static CACHE_MAXSIZE = 40
  static CACHE_CLEANUPINTERVAL = 60 * 1000

  public startAutoCleanup() {
    this.cacheCleanupTimer = setInterval(
      this.autoCleanupCacheMethod,
      CachePool.CACHE_CLEANUPINTERVAL
    )
  }

  public stopAutoCleanup() {
    if (this.cacheCleanupTimer) {
      clearInterval(this.cacheCleanupTimer)
      this.cacheCleanupTimer = null
    }
  }

  private autoCleanupCacheMethod = () => {
    this.cleanupExpireCache()
  }

  public cleanupOldestCache(amount: number = 1) {
    for (let i = 0; i < amount; i++) {
      let oldestKey = ''
      let oldestTime = Number.MAX_SAFE_INTEGER

      for (const [key, cache] of this.cache) {
        if (cache.lastAccessedAt < oldestTime) {
          oldestKey = key
          oldestTime = cache.lastAccessedAt
        }
      }

      this.cache.delete(oldestKey)
    }
  }

  public cleanupExpireCache() {
    const now = Date.now()

    for (const [key, cache] of this.cache) {
      if (now - cache.createdAt > CachePool.CACHE_MAXAGE) {
        this.cache.delete(key)
      }
    }
  }

  public addCache(path: string, buffer: Buffer) {
    const cache = {
      buffer,
      createdAt: Date.now(),
      lastAccessedAt: Date.now()
    }

    // 添加之前先清理过期缓存
    this.cleanupExpireCache()

    if (this.cache.size >= CachePool.CACHE_MAXSIZE) {
      this.cleanupOldestCache()
    }

    this.cache.set(path, cache)
  }

  public hasCache(path: string) {
    return this.cache.has(path)
  }

  public readCache(path: string) {
    const cache = this.cache.get(path)

    if (!cache) {
      return null
    }

    cache.lastAccessedAt = Date.now()

    return cache.buffer
  }

  public clearCache(prefix?: string) {
    if (prefix) {
      for (const [key] of this.cache) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }
}
