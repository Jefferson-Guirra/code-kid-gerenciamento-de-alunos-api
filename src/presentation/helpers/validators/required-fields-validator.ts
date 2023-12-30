/* eslint-disable no-prototype-builtins */
import { MissingParamsError } from '../../errors/missing-params-error';
import { HttpRequest } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class RequiredFieldsValidator implements  Validation {
  constructor(private readonly field: string) {}

  validation(httpRequest: HttpRequest): Error | undefined {
    if(!httpRequest.body.hasOwnProperty(this.field)){
      return new MissingParamsError(this.field)
    }
    return undefined
  }
}