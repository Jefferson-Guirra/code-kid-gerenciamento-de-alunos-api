import { InvalidParamsError } from '../../errors/invalid-params-error'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'

export class CompareFieldsValidator implements Validation {
  constructor( 
    private readonly field: string, 
    private readonly compareFields: string) {}

  validation(httpRequest: HttpRequest): Error | undefined {
    const  body = httpRequest.body
    if(body[this.field] !== body[this.compareFields]){
      return new InvalidParamsError(this.compareFields)
    }
  }
}