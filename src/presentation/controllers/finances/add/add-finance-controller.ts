import { AddFinance } from '../../../../domain/usecases/finance/add-finance';
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';

export class AddFinanceController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly finance: AddFinance
  ) {}
  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validation(request)
      if(error) {
        return badRequest(error)
      }
      const body = request.body
      const finance = await this.finance.addFinance(body)
      if(!finance) {
        return unauthorized()
      }
      return ok('ok')
    }
    catch(err) {
      return serverError(err as Error)
    }
  }
}