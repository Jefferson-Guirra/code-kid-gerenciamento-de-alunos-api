import { HttpRequest } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class ValidatorComposite implements Validation {
  constructor( private readonly validators: Validation[]) {}
  validation(httpRequest: HttpRequest): Error | undefined {
    for(const validator of this.validators) {
      const error = validator.validation(httpRequest)
      if(error !== undefined) {
        return error
      }
    }

  }
}