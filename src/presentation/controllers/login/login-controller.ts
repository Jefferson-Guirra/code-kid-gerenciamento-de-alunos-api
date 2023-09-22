import { HashCompare } from '../../../data/protocols/criptography/hash-compare';
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/account/load-account-by-email-repository';
import { ok, serverError, unauthorized } from '../../helpers/http/http';
import { Controller } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';

export class LoginController  implements Controller {
  constructor( 
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare
  ){}

  async handle (request: HttpRequest): Promise<HttpResponse>{
    try{
      const { email, password } = request.body
      const account = await this.loadAccount.loadByEmail(email)
      if(!account) {
        return unauthorized()
      }
      const isValid = await this.hashCompare.compare(password, account.password)
    } catch(err) {
      return serverError(err as Error)
    }
    return ok('success')
  }
}