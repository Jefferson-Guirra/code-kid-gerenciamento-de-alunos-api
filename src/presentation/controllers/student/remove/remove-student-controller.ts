import { ok } from '../../../helpers/http/http';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';

export class RemoveStudentController implements Controller {
  constructor(private readonly validator: Validation) {}
  async handle (request: HttpRequest): Promise<HttpResponse> {
    this.validator.validation(request)
    return ok('success')
  }
}