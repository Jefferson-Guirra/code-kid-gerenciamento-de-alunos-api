import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { makeSignupValidator } from './signup-validator-factory'
import { EmailValidation } from '../../../../presentation/helpers/validators/email-validator'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'
import { CompareFieldsValidator } from '../../../../presentation/helpers/validators/compare-fields-validator'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

export const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (value: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
describe('makeSignupValidator', () => { 
  test('should call validatorComposite with correct validators', () => { 
    const validators: Validation[] = []
    for(const field of ['username', 'email', 'password', 'passwordConfirmation', 'privateKey', 'units']){
    validators.push(new RequiredFieldsValidator(field)) 
    }
    validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    validators.push(new EmailValidation('email', new EmailValidatorAdapter()))
    makeSignupValidator()
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
   })
})