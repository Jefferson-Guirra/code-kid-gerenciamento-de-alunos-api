import { LoadAccountByEmailRepository } from '../../../data/protocols/db/account/load-account-by-email-repository';
import { ok, unauthorized } from '../../helpers/http/http';
import { Controller } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';

export class LoginController  implements Controller {
  constructor( private readonly loadAccount: LoadAccountByEmailRepository){}
  async handle (request: HttpRequest): Promise<HttpResponse>{
    const { email, password } = request.body
    const account = await this.loadAccount.loadByEmail(email)
    if(!account) {
      return unauthorized()
    }
    return ok('success')
  }
}