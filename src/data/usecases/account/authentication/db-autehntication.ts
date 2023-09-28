import { Authentication, AuthenticationModel } from '../../../../domain/usecases/account/authentication';
import { Encrypter } from '../../../protocols/criptography/encrypter';
import { HashCompare } from '../../../protocols/criptography/hash-compare';
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
  constructor(  
    private readonly loadAccount: LoadAccountByEmailRepository,

    ) {}
  async auth (email: string, password: string): Promise<AuthenticationModel | null> {
    const account = await this.loadAccount.loadByEmail(email)
    if(!account) {
      return null
    }


  return { 
    username: 'any_username',
    email: 'any_email@mail.com',
    accessToken: 'any_token'
  }
  }
}