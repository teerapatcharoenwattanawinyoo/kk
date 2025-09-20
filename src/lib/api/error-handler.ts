import { getAuthTokens } from '@/lib/auth/tokens'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class SessionExpiredError extends ApiError {
  constructor(endpoint: string) {
    super('Session expired - please login again', 401, endpoint)
    this.name = 'SessionExpiredError'
  }
}

export function handleApiError(error: unknown, endpoint: string): never {
  if (error instanceof Error) {
    if (error.message.includes('Session expired')) {
      throw new SessionExpiredError(endpoint)
    }

    if (error.message.includes('HTTP error')) {
      const statusMatch = error.message.match(/status: (\d+)/)
      const status = statusMatch ? parseInt(statusMatch[1]) : 500
      throw new ApiError(error.message, status, endpoint)
    }
  }

  throw new ApiError(
    error instanceof Error ? error.message : 'Unknown error occurred',
    500,
    endpoint,
  )
}

export function isTokenExpiredError(error: unknown): boolean {
  return (
    error instanceof SessionExpiredError ||
    (error instanceof Error && error.message.includes('Session expired'))
  )
}

export async function validateSession(): Promise<boolean> {
  try {
    const { refreshToken } = getAuthTokens()
    if (!refreshToken) {
      return false
    }
    return true
  } catch (error) {
    console.error('Session validation failed:', error)
    return false
  }
}
