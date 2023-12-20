import { AddStudent } from '../../../domain/usecases/student/add-student';
import { badRequest, ok } from '../../helpers/http/http';
import { Controller } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class AddStudentController implements Controller {
  constructor(
    private readonly validator: Validation,
    private readonly addStudent: AddStudent
  ){}
   async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validation(request)
    if (error) {
      return badRequest(error)
    }
    const student = request.body
    this.addStudent.add(student)
    return ok('success')

  }
}