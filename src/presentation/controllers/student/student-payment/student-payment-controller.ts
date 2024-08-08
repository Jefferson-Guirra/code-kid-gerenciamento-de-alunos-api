import { PaymentStudents } from '../../../../domain/usecases/student/payment-student';
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';

export class StudentPaymentController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly paymentStudents: PaymentStudents
  ){}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const body = request.body
      const error = this.validator.validation(request)
      if(error) {
        return badRequest(error)
      }

      const students = await this.paymentStudents.getStudents(body)
      if (!students) {
        return unauthorized()
      }
      return ok(students)
    } catch(err) {
      return serverError(err as Error)
    }
  }
}