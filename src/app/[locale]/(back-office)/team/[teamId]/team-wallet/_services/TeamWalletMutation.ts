
import { fetchTeamWalletBalance } from './TeamWalletQuery'

interface RefreshTeamWalletBalanceVariables {
  teamGroupId: string | number
}

const refreshTeamWalletBalance = async ({
  teamGroupId,
}: RefreshTeamWalletBalanceVariables) => {
  return fetchTeamWalletBalance(teamGroupId)
}

export { refreshTeamWalletBalance }
export type { RefreshTeamWalletBalanceVariables }
