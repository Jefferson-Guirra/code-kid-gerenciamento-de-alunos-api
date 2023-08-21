export interface AddAccountModel {
  username: string
  email: string
  password: string
  passwordConfirmation: string
  privateKey: string
}

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AddAccountModel | null>
}