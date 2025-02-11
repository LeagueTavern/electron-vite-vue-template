export const ERRORS_ENUM = {
  0: 'UNKNOWN_ERROR'
} as const

export function createErrorMessage(code: keyof typeof ERRORS_ENUM, data: unknown) {
  return {
    code,
    message: ERRORS_ENUM[code],
    data
  }
}
