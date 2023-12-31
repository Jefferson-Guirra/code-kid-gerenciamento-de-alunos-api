import { AccountModel } from '../../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../../domain/usecases/account/add-account';
import { Hasher } from '../../../protocols/criptography/hasher';
import { AddAccountRepository } from '../../../protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository';
import { ValidateAddAccountKeyRepository } from '../../../protocols/db/keys/validate-add-account-key-repository';

export class DbAddAccountRepository implements AddAccount {
  constructor(
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly key: ValidateAddAccountKeyRepository,
    private readonly account: AddAccountRepository,
    private readonly hasher : Hasher
    ) {}
  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const { email, privateKey, username, password, passwordConfirmation, units } = account
    const loadAccount = await this.loadAccount.loadByEmail(email)
    if(loadAccount) {
      return null
    }
    const validate = await this.key.validateAddKey(privateKey)
    if(!validate) {
      return null
    }
    const hashedPassword = await this.hasher.hash(password)
    return await this.account.addAccount({ 
      username, 
      email, 
      password: hashedPassword, 
      privateKey, 
      passwordConfirmation: hashedPassword,
      units
    })
  }
}