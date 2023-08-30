import { AccountModel } from '../../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../../domain/usecases/add-account';
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository';
import { ValidateAddAccountKeyRepository } from '../../../protocols/db/keys/validate-add-account-key-repository';

export class DbAddAccountRepository implements AddAccount {
  constructor(
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly validateKey: ValidateAddAccountKeyRepository
    ) {}
  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const { email, privateKey } = account
    const loadAccount = await this.loadAccount.loadByEmail(email)
    if(!loadAccount) {
      return null
    }
    await this.validateKey.validateAddKey(privateKey)
    return {
      username: 'any_username',
      email: 'any_email@mail.com',
      password: 'any_password',
      id: 'any_id'
    }


  }
}