import { InvalidParamsError } from '../../errors/invalid-params-error';
import { EmailValidator } from '../../protocols/email-validator';
import { HttpRequest } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class EmailValidation implements Validation {
  constructor( 
    private readonly fieldName: string, 
    private readonly emailValidator: EmailValidator ) {}
    validation (httpRequest: HttpRequest): Error | undefined {
      const isValid = this.emailValidator.isValid(httpRequest.body[this.fieldName])
      if(!isValid) {
        return new InvalidParamsError(this.fieldName)
      }
      return undefined

    }
}