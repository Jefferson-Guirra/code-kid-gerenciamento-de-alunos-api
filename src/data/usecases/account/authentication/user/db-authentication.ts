import { Authentication, AuthenticationModel } from '../../../../../domain/usecases/account/authentication';
import { Encrypter } from '../../../../protocols/criptography/encrypter';
import { HashCompare } from '../../../../protocols/criptography/hash-compare';
import { LoadAccountByEmailRepository } from '../../../../protocols/db/account/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
  constructor(  
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter
    
    ) {}
  async auth (email: string, password: string): Promise<AuthenticationModel | null> {
    const account = await this.loadAccount.loadByEmail(email)
    if(!account) {
      return null
    }
    const isValid = await this.hashCompare.compare(password, account.password)
    if(!isValid) {
      return null
    }
    const accessToken = await this.encrypter.encrypt(account.id)

  return {
    email: account.email,
    username: account.username,
    accessToken

  }
  }
}