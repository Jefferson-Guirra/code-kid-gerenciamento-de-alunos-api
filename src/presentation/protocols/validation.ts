import { HttpRequest } from './http';

export interface Validation {
  validation: (httpRequest: HttpRequest) => Error | undefined 
}