import type { UserData } from '../schemas/user'

/**
 * Get the partner_id (customer_id) from localStorage
 * @returns The customer_id if available, null otherwise
 */
export function getPartnerIdFromStorage(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const savedData = localStorage.getItem('user_data')
    if (!savedData) {
      return null
    }

    const userData: UserData = JSON.parse(savedData)
    const customerId = userData.user?.customer_id

    if (!customerId) {
      return null
    }

    return customerId.toString()
  } catch (error) {
    console.error('Error getting partner_id from localStorage:', error)
    return null
  }
}

/**
 * Get the full user data from localStorage
 * @returns The user data if available, null otherwise
 */
export function getUserDataFromStorage(): UserData | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const savedData = localStorage.getItem('user_data')
    if (!savedData) {
      return null
    }

    const userData: UserData = JSON.parse(savedData)

    const isExpired = Date.now() - userData.timestamp > 7 * 24 * 60 * 60 * 1000

    if (isExpired) {
      localStorage.removeItem('user_data')
      return null
    }

    return userData
  } catch (error) {
    console.error('Error getting user data from localStorage:', error)
    return null
  }
}

/**
 * Get the team_host_id from localStorage
 * @returns The team_host_id if available, null otherwise
 */
export function getTeamHostIdFromStorage(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const userData = getUserDataFromStorage()
    const teamHostId = userData?.user?.team_host_id

    if (!teamHostId) {
      return null
    }

    return teamHostId.toString()
  } catch (error) {
    console.error('Error getting team_host_id from localStorage:', error)
    return null
  }
}
