/* eslint-disable no-prototype-builtins */
import { InvalidParamsError } from '../../errors/invalid-params-error';
import { HttpRequest } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class RequiredFieldsValidator implements  Validation {
  constructor(private readonly params: string[]) {}

  validation(httpRequest: HttpRequest): Error | undefined {
    for(const field of this.params) {
      if(!httpRequest.body.hasOwnProperty(field)){
        return new InvalidParamsError(field)
      }

    }
    return undefined
  }
}