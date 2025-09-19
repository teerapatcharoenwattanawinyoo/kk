interface UserData {
  user: {
    customer_id: number
    email: string
    phone: string
    profilename: string
    avatar: string | null
    platform_type: string
    company_id: number | null
    team_id: number | null
    device: string
    team_host_id: number
  }
  timestamp: number
}

/**
 * Get the partner_id (customer_id) from localStorage
 * @returns The customer_id if available, null otherwise
 */
export function getPartnerIdFromStorage(): number | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const savedData = localStorage.getItem('user_data')
    if (!savedData) {
      return null
    }

    const userData: UserData = JSON.parse(savedData)
    return userData.user?.customer_id || null
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
export function getTeamHostIdFromStorage(): number | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const userData = getUserDataFromStorage()
    return userData?.user?.team_host_id || null
  } catch (error) {
    console.error('Error getting team_host_id from localStorage:', error)
    return null
  }
}
