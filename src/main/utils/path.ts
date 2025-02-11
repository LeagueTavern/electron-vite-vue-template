import path from 'node:path'

/**
 * 判断目标路径是否以基础路径开头
 * @param {string} baseDir 基础路径
 * @param {string} targetDir 目标路径
 * @returns {boolean} 是否以基础路径开头
 */
export function startsWithPath(baseDir: string, targetDir: string) {
  if (baseDir === targetDir) {
    return true
  }

  const relative = getRelativePath(baseDir, targetDir)
  return !relative.startsWith('..') && !path.isAbsolute(relative)
}

export function getRelativePath(baseDir: string, targetDir: string) {
  if (baseDir === targetDir) {
    return ''
  }

  const base = path.normalize(baseDir + path.sep)
  const target = path.normalize(targetDir)
  const relative = path.relative(base, target)
  return relative
}

export function parsePathParams<T extends string = never>(
  template: string,
  text: string
): Record<T, string> | null {
  // 直接返回空对象
  if (template === text) {
    return {} as Record<T, string>
  }

  const formatParts = template.split('/')
  const textParts = text.split('/')
  const result: Partial<Record<T, string>> = {}

  let formatIndex = 0
  let textIndex = 0

  while (formatIndex < formatParts.length && textIndex < textParts.length) {
    const formatPart = formatParts[formatIndex]
    const textPart = textParts[textIndex]

    // 如果以:开头，代表是一个参数
    if (formatPart.startsWith(':')) {
      const key = formatPart.slice(1) as T
      result[key] = textPart
      formatIndex++
      textIndex++
    } else if (formatPart === textPart) {
      // 如果是普通字符串，直接比较
      formatIndex++
      textIndex++
    } else {
      return null
    }
  }

  // 分段数量对不上
  if (formatIndex !== formatParts.length || textIndex !== textParts.length) {
    return null
  }

  return result as Record<T, string>
}
