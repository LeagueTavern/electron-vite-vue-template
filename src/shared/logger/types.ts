import { createErrorMessage } from './error'

export type LoggerType = 'info' | 'warn' | 'error'
export type ErrorMessage = ReturnType<typeof createErrorMessage>
