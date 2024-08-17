import { FinanceModel } from '../../models/finance';

export interface AddFinanceModel {
  accessToken: string
  date: string
  day: string
  month: string
  price: number,
  type: | 'energy' | 'water' | 'rent' | 'cleaning' | 'others' | 'employees'
  year: string
}


export interface AddFinance {
  addFinance: (finance: AddFinanceModel) => Promise<FinanceModel | null>
}