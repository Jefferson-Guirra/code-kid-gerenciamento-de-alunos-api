import { AddStudent } from '../../../../domain/usecases/student/add-student';
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';

export class AddStudentController implements Controller {
  constructor(
    private readonly validator: Validation,
    private readonly addStudent: AddStudent
  ){}
   async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validation(request)
      if (error) {
        return badRequest(error)
      }
      const body = request.body
      const student = await this.addStudent.add(body)
      if(!student) {
        return unauthorized()
      }
      return ok(student)
    } catch(err) {
      return serverError(err as Error)
    }

  }
}