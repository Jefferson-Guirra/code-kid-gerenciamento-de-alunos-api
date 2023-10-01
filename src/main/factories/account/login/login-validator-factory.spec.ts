import { EmailValidation } from '../../../../presentation/helpers/validators/email-validator';
import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { EmailValidator } from '../../../../presentation/protocols/email-validator';
import { Validation } from '../../../../presentation/protocols/validation';
import { makeLoginValidatorFactory } from './login-validator-factory';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';

jest.mock('../../../../presentation/helpers/validators/validator-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (value: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('makeLoginValidatorFactory', () => { 
  test('should call ValidatorComposite with correct validators', () => { 
    const validators: Validation[] = [] 
    for (const field of ['email', 'password']) {
      validators.push(new RequiredFieldsValidator(field))
    }
    validators.push(new EmailValidation('email', makeEmailValidatorStub()))
    makeLoginValidatorFactory()
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

