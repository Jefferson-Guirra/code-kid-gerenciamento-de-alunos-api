import { UpdateStudent } from '../../../../domain/usecases/student/update-student';
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';

export class UpdateStudentController implements Controller {
  constructor(
    private readonly validator: Validation,
    private readonly updateStudent: UpdateStudent

  ){}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try{
      const error = this.validator.validation(request)
      if(error) {
        return badRequest(error)
      }
      const {id, ...fields} = request.body
      const updateStudent = await this.updateStudent.update(id, fields)
      if(!updateStudent){
        return unauthorized()
      }
      return ok('success')
    }
    catch(err){
      return serverError(err as Error)
    }
  } 
}