/* eslint-disable no-prototype-builtins */
import { InvalidParamsError } from '../../errors/invalid-params-error';
import { HttpRequest } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class RequiredFieldsValidator implements  Validation {
  constructor(private readonly field: string) {}

  validation(httpRequest: HttpRequest): Error | undefined {
    if(!httpRequest.body.hasOwnProperty(this.field)){
      return new InvalidParamsError(this.field)
    }
    return undefined
  }
}