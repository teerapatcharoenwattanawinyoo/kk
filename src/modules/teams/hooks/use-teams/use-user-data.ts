import { useLocalStorage } from '@/lib/helpers/storage'
import type { UserData } from '@/lib/schemas/user'

export const useUserData = () => {
  const [userData] = useLocalStorage<UserData | null>('user_data', null)
  return userData
}
