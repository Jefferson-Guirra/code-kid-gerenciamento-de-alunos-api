import { RemoveStudent } from '../../../../domain/usecases/student/remove-student';
import { badRequest, ok } from '../../../helpers/http/http';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';

export class RemoveStudentController implements Controller {
  constructor(
    private readonly validator: Validation,
    private readonly removeStudent: RemoveStudent
    ) {}
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validation(request)
    if(error) {
      return badRequest(error)
    }
    const { id } = request.body
    await this.removeStudent.remove(id)
    return ok('success')
  }
}