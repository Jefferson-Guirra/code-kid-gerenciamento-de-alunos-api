import { EmailValidator } from '../../../presentation/protocols/email-validator';
import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  isValid(value: string): boolean {
    return validator.isEmail(value)

  }
}