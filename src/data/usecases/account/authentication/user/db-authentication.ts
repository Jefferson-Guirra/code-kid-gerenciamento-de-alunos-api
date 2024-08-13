import { Authentication, AuthenticationModel } from '../../../../../domain/usecases/account/authentication';
import { Encrypter } from '../../../../protocols/criptography/encrypter';
import { HashCompare } from '../../../../protocols/criptography/hash-compare';
import { LoadAccountByEmailRepository } from '../../../../protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../../protocols/db/account/update-access-token-repository';

export class DbAuthentication implements Authentication {
  constructor(  
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAccessToken: UpdateAccessTokenRepository
    
    ) {}
  async auth (email: string, password: string): Promise<AuthenticationModel | null> {
    const account = await this.loadAccount.loadByEmail(email)

    if (account) {
      const { username, email, id} = account
      const isValid = await this.hashCompare.compare(password, account.password)

      if(isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessToken.update(id, accessToken)
        return  await Promise.resolve({email, username, accessToken})

      }
    }

    return null
  }
}