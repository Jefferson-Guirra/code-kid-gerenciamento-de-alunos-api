import { AccountModel } from '../../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../../domain/usecases/add-account';
import { Hasher } from '../../../protocols/criptography/hasher';
import { AddAccountRepository } from '../../../protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository';
import { ValidateAddAccountKeyRepository } from '../../../protocols/db/keys/validate-add-account-key-repository';

export class DbAddAccountRepository implements AddAccount {
  constructor(
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly validateKey: ValidateAddAccountKeyRepository,
    private readonly account: AddAccountRepository,
    private readonly hasher : Hasher
    ) {}
  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const { email, privateKey, username, password, passwordConfirmation } = account
    const loadAccount = await this.loadAccount.loadByEmail(email)
    if(!loadAccount) {
      return null
    }
    const validate = await this.validateKey.validateAddKey(privateKey)
    if(!validate) {
      return null
    }
    await this.hasher.hash(password)
    return await this.account.addAccount({ username, email, password, privateKey, passwordConfirmation})
  }
}