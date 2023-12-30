import { RemoveStudent } from '../../../../domain/usecases/student/remove-student';
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';

export class RemoveStudentController implements Controller {
  constructor(
    private readonly validator: Validation,
    private readonly removeStudent: RemoveStudent
    ) {}
  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validation(request)
      if(error) {
        return badRequest(error)
      }
      const { id } = request.body
      const response = await this.removeStudent.remove(id)
      if(!response) {
        return unauthorized()
      }
      return ok('success')
    }catch(err) {
      return serverError(err as Error)
    }
  }
}