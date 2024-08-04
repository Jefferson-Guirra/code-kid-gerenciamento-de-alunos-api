import { AddFinance } from '../../../../domain/usecases/finance/add-finance';
import { ok } from '../../../helpers/http/http';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';

export class AddFinanceController implements Controller {
  constructor (
    private readonly finance: AddFinance
  ) {}
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const body = request.body
    await this.finance.addFinance(body)
    return ok('ok')
  }
}