import axios from 'axios'

export type AppErrorReason =
  | 'NETWORK'
  | 'TIMEOUT'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'INVALID_CREDENTIALS'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION'
  | 'SERVER'
  | 'UNKNOWN'

type TranslationOverrides = Partial<Record<AppErrorReason, string>>

type MessageMatcher = {
  includes: string[]
  reason: AppErrorReason
}

export type NormalizeErrorOptions = {
  fallbackReason?: AppErrorReason
  translationOverrides?: TranslationOverrides
  statusReasonMap?: Partial<Record<number, AppErrorReason>>
  messageMatchers?: MessageMatcher[]
  defaultTranslationKey?: string
}

const DEFAULT_TRANSLATION_KEYS: Record<AppErrorReason, string> = {
  NETWORK: 'errors.network',
  TIMEOUT: 'errors.timeout',
  BAD_REQUEST: 'errors.bad_request',
  UNAUTHORIZED: 'errors.unauthorized',
  INVALID_CREDENTIALS: 'errors.invalid_credentials',
  FORBIDDEN: 'errors.forbidden',
  NOT_FOUND: 'errors.not_found',
  CONFLICT: 'errors.conflict',
  VALIDATION: 'errors.validation',
  SERVER: 'errors.server',
  UNKNOWN: 'errors.generic',
}

const NETWORK_ERROR_CODES = new Set(['ECONNRESET', 'ECONNABORTED', 'ERR_NETWORK', 'ETIMEDOUT'])

const DEFAULT_MESSAGE_MATCHERS: MessageMatcher[] = [
  {
    includes: ['network', 'connection', 'offline', 'internet'],
    reason: 'NETWORK',
  },
  {
    includes: ['timeout', 'timed out'],
    reason: 'TIMEOUT',
  },
  {
    includes: ['unauthorized', 'forbidden', 'invalid credentials', 'wrong password'],
    reason: 'INVALID_CREDENTIALS',
  },
  {
    includes: ['not found'],
    reason: 'NOT_FOUND',
  },
  {
    includes: ['validation', 'invalid input'],
    reason: 'VALIDATION',
  },
  {
    includes: ['conflict'],
    reason: 'CONFLICT',
  },
]

export class AppError extends Error {
  readonly reason: AppErrorReason
  readonly status?: number
  readonly translationKey: string
  declare readonly cause?: unknown

  constructor(
    reason: AppErrorReason,
    translationKey: string,
    options: { status?: number; cause?: unknown } = {},
  ) {
    super(translationKey)
    this.name = 'AppError'
    this.reason = reason
    this.translationKey = translationKey
    if (options.status !== undefined) {
      this.status = options.status
    }
    if (options.cause !== undefined) {
      this.cause = options.cause
    }
  }
}

const extractMessage = (error: unknown): string => {
  if (!error) return ''
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && 'message' in (error as Record<string, unknown>)) {
    const message = (error as { message?: unknown }).message
    return typeof message === 'string' ? message : ''
  }
  return ''
}

const mapStatusToReason = (status?: number): AppErrorReason => {
  if (!status) return 'UNKNOWN'
  if (status === 400) return 'BAD_REQUEST'
  if (status === 401) return 'UNAUTHORIZED'
  if (status === 403) return 'FORBIDDEN'
  if (status === 404) return 'NOT_FOUND'
  if (status === 409) return 'CONFLICT'
  if (status === 422) return 'VALIDATION'
  if (status >= 500) return 'SERVER'
  return 'UNKNOWN'
}

const applyMessageMatchers = (
  message: string,
  matchers: MessageMatcher[],
): AppErrorReason | undefined => {
  if (!message) return undefined
  const normalized = message.toLowerCase()
  for (const matcher of matchers) {
    if (matcher.includes.some((fragment) => normalized.includes(fragment))) {
      return matcher.reason
    }
  }
  return undefined
}

export const normalizeError = (error: unknown, options: NormalizeErrorOptions = {}): AppError => {
  const {
    fallbackReason = 'UNKNOWN',
    translationOverrides = {},
    statusReasonMap = {},
    messageMatchers = [],
    defaultTranslationKey,
  } = options

  const mergedMatchers = [...messageMatchers, ...DEFAULT_MESSAGE_MATCHERS]

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    const translationKey = translationOverrides.NETWORK ?? DEFAULT_TRANSLATION_KEYS.NETWORK
    return new AppError('NETWORK', translationKey, { cause: error })
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const errorCode = error.code

    let reason = statusReasonMap[status ?? -1] ?? mapStatusToReason(status)

    if (NETWORK_ERROR_CODES.has(errorCode ?? '') || status === 0) {
      reason = 'NETWORK'
    }

    if (reason === 'UNKNOWN') {
      const messageReason = applyMessageMatchers(extractMessage(error), mergedMatchers)
      if (messageReason) {
        reason = messageReason
      }
    }

    const translationKey =
      translationOverrides[reason] ??
      defaultTranslationKey ??
      DEFAULT_TRANSLATION_KEYS[reason] ??
      DEFAULT_TRANSLATION_KEYS.UNKNOWN

    return new AppError(reason, translationKey, { status, cause: error })
  }

  const matchedReason = applyMessageMatchers(extractMessage(error), mergedMatchers)
  const reason = matchedReason ?? fallbackReason

  const translationKey =
    translationOverrides[reason] ??
    translationOverrides[fallbackReason] ??
    defaultTranslationKey ??
    DEFAULT_TRANSLATION_KEYS[reason] ??
    DEFAULT_TRANSLATION_KEYS.UNKNOWN

  return new AppError(reason, translationKey, { cause: error })
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError

export const getErrorTranslationKey = (error: unknown): string => {
  if (isAppError(error)) {
    return error.translationKey
  }
  const normalized = normalizeError(error)
  return normalized.translationKey
}
