import { LoadAccountByEmailRepository } from '../../../data/protocols/db/account/load-account-by-email-repository';
import { ok } from '../../helpers/http/http';
import { Controller } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';

export class LoginController  implements Controller {
  constructor( private readonly loadAccount: LoadAccountByEmailRepository){}
  async handle (request: HttpRequest): Promise<HttpResponse>{
    const { email, password } = request.body
    await this.loadAccount.loadByEmail(email)
    return ok('success')
  }
}