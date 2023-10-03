import { AccountLogout } from '../../../domain/usecases/account/logout-account';
import { badRequest, ok } from '../../helpers/http/http';
import { Controller } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class LogoutController implements Controller {
  constructor( 
    private readonly validator: Validation,
    private readonly accountLogout: AccountLogout
  ) {}
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validation(request)
    if(error) {
      return badRequest(error)
    }
    const { accessToken } = request.body
    await this.accountLogout.logout(accessToken)
     return ok(' success')
  }
}