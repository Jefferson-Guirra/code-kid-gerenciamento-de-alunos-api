import { Encrypter } from '../../../data/protocols/criptography/encrypter';
import { HashCompare } from '../../../data/protocols/criptography/hash-compare';
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/account/load-account-by-email-repository';
import { Authentication } from '../../../domain/usecases/account/authentication';
import { ok, serverError, unauthorized } from '../../helpers/http/http';
import { Controller } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';

export class LoginController  implements Controller {
  constructor( 
    private readonly authentication: Authentication

  ){}

  async handle (request: HttpRequest): Promise<HttpResponse>{
    try{
      const { email, password } = request.body
      const account =  await this.authentication.auth(email, password)
      if(!account) {
        return unauthorized()
      }
      return ok(account)

    } catch(err) {
      return serverError(err as Error)
    }
  }
}