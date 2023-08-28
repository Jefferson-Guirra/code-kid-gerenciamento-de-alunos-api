import { AccountModel } from '../models/account'

export interface AddAccountModel {
  username: string
  email: string
  password: string
  passwordConfirmation: string
  privateKey: string
}

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel | null>
}