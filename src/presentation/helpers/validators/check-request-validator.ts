import { UnnecessaryParamsError } from '../../errors/unecessary-params-error';
import { HttpRequest } from '../../protocols/http';
import { Validation } from '../../protocols/validation';

export class CheckRequestValidator implements Validation {
  constructor(private readonly fields: string[]) {}
  validation(httpRequest: HttpRequest): Error | undefined {
    const keys = Object.keys(httpRequest.body)
    const invalidParams: string[] = [] 
    for(const key of keys) {
      if(!this.fields.includes(key)) {
        invalidParams.push(key)
      }
    }
    return invalidParams.length > 0 ? new UnnecessaryParamsError() : undefined
  }
}