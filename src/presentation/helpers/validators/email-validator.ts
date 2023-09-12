import { EmailValidator } from '../../protocols/email-validator';
import { HttpRequest } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class EmailValidation implements Validation {
  constructor( 
    private readonly fieldName: string, 
    private readonly emailValidator: EmailValidator ) {}
    validation (httpRequest: HttpRequest): Error | undefined {
      this.emailValidator.isValid(httpRequest.body[this.fieldName])
      return undefined

    }
}