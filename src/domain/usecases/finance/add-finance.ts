import { Finance } from '../../models/finance';

export interface AddFinanceModel extends Finance {
  id: string
}


export interface AddFinance {
  addFinance: (finance: Finance) => Promise<AddFinanceModel | null>
}