import { ok } from '../../helpers/http/http';
import { Controller } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class SignUpController implements  Controller {
  constructor ( private readonly validate: Validation ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validate.validation(httpRequest)
    return ok('success')

  }
}