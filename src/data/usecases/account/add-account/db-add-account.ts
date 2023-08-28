import { AccountModel } from '../../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../../domain/usecases/add-account';
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository';

export class DbAddAccountRepository implements AddAccount {
  constructor(private readonly loadAccount: LoadAccountByEmailRepository) {}
  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const { email } = account
    await this.loadAccount.loadByEmail(email)
    return null


  }
}