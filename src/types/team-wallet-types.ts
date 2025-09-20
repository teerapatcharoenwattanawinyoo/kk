export interface ChargeSession {
  orderNumber: string
  location: string
  station: string
  charger: string
  rate: string
  startCharge: string
  stopCharge: string
  time: string
  kWh: string
  revenue: string
  status: string
}

export interface ChargeCard {
  id: string
  cardId: string
  owner: string
  accessibility: string
  status: string
  created: string
}
