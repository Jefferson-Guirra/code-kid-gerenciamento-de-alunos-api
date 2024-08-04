import { AddFinance } from '../../../../domain/usecases/finance/add-finance';
import { ok } from '../../../helpers/http/http';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';

export class AddFinanceController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly finance: AddFinance
  ) {}
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validation(request)
    const body = request.body
    await this.finance.addFinance(body)
    return ok('ok')
  }
}