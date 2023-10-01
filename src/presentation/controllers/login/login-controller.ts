import { Encrypter } from '../../../data/protocols/criptography/encrypter';
import { HashCompare } from '../../../data/protocols/criptography/hash-compare';
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/account/load-account-by-email-repository';
import { Authentication } from '../../../domain/usecases/account/authentication';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http';
import { Controller } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class LoginController  implements Controller {
  constructor( 
    private readonly validation: Validation,
    private readonly authentication: Authentication

  ){}

  async handle (request: HttpRequest): Promise<HttpResponse>{
    const error = this.validation.validation(request)
    if(error) {
      return badRequest(error)
    }
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