import { PaymentStudents } from '../../../../domain/usecases/student/payment-student';
import { badRequest, ok } from '../../../helpers/http/http';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';

export class StudentPaymentController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly paymentStudents: PaymentStudents
  ){}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { payment } = request.body
    const error = this.validator.validation(request)
    if(error) {
      return badRequest(error)
    }
    await this.paymentStudents.getStudents(payment)
    return ok('success')
  }
}