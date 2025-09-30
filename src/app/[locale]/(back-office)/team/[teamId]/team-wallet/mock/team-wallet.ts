import { chargeCardSchema, chargeSessionSchema, teamWalletOverviewSchema } from '../types/team-wallet'

const chargeSessionsData = [
  {
    orderNumber: 'CP00378653-379',
    location: 'Nonthaburi, Nonthaburi',
    station: 'OneCharge Charging Station',
    charger: 'Phevn Charger 1',
    rate: '89.0/kWh',
    startCharge: '9/7/2023 5:16 PM',
    stopCharge: '9/7/2023 6:16 PM',
    time: '1 hr',
    kWh: '11 kWh',
    revenue: '899.0',
    status: 'Completed',
  },
  {
    orderNumber: 'CP00378653-378',
    location: '182 2/5 ถ.ทรงวาด ซอย 7',
    station: 'OneCharge Charging Station',
    charger: 'Phevn Charger 1',
    rate: '89.0/kWh',
    startCharge: '9/7/2023 5:16 PM',
    stopCharge: '9/7/2023 6:16 PM',
    time: '1 hr',
    kWh: '11 kWh',
    revenue: '899.0',
    status: 'Completed',
  },
  {
    orderNumber: 'CP00378653-377',
    location: '30, 99 Bangplad Soi 4 Rama',
    station: 'OneCharge Charging Station',
    charger: 'Phevn Charger 1',
    rate: '89.0/kWh',
    startCharge: '9/7/2023 5:16 PM',
    stopCharge: '9/7/2023 6:16 PM',
    time: '1 hr',
    kWh: '11 kWh',
    revenue: '899.0',
    status: 'Completed',
  },
  {
    orderNumber: 'CP00378653-376',
    location: 'Nonthaburi, Nonthaburi',
    station: 'OneCharge Charging Station',
    charger: 'Phevn Charger 1',
    rate: '89.0/kWh',
    startCharge: '9/7/2023 5:16 PM',
    stopCharge: '9/7/2023 6:16 PM',
    time: '1 hr',
    kWh: '11 kWh',
    revenue: '899.0',
    status: 'Completed',
  },
]

export const chargeSessionsMock = chargeSessionSchema.array().parse(chargeSessionsData)

const chargeCardsData = [
  {
    id: '1',
    cardId: '182787',
    owner: 'Jean Thiraphat',
    accessibility: 'All',
    status: 'Active',
    created: '12/01/2023\n11 : 23 : 38',
  },
  {
    id: '2',
    cardId: '182781',
    owner: 'No owner',
    accessibility: 'Selected',
    status: 'Hold',
    created: 'N/A',
  },
  {
    id: '3',
    cardId: '182783',
    owner: 'No owner',
    accessibility: 'Selected',
    status: 'Hold',
    created: 'N/A',
  },
]

export const chargeCardsMock = chargeCardSchema.array().parse(chargeCardsData)

export const teamWalletOverviewMock = teamWalletOverviewSchema.parse({
  walletBalance: 23780.0,
  chargeSessions: chargeSessionsMock,
  chargeCards: chargeCardsMock,
})
