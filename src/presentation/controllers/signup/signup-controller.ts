import { AddAccount } from '../../../domain/usecases/add-account';
import { badRequest, ok, unauthorized } from '../../helpers/http/http';
import { Controller } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class SignUpController implements  Controller {
  constructor ( 
    private readonly validate: Validation,
    private readonly addAccount: AddAccount
     ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validate.validation(httpRequest)
    if (error) {
      return badRequest(error)
    }
    const account = await this.addAccount.add(httpRequest.body)
    if (!account) {
      return unauthorized()
    }
    return ok('success')

  }
}