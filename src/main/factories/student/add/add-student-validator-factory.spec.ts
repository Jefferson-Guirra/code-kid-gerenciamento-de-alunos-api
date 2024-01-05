import { EmailValidation } from '../../../../presentation/helpers/validators/email-validator'
import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'
import { makeAddStudentValidatorFactory } from './add-student-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorAdapterStub implements EmailValidator {
    isValid(value: string): boolean {
      return true
    }
  }
  return new EmailValidatorAdapterStub()
}

describe('makeAddStudentValidatorFactory', () => {
  test('should call ValidatorComposite with correct validators', () => {
    const validators: Validation[] = []
    for(const field of [
      'registration',
      'name',
      'age',
      'father',
      'mother',
      'phone',
      'course',
      'payment',
      'date_payment',
      'email'
    ]){
      validators.push(new RequiredFieldsValidator(field))
    }
    validators.push(new EmailValidation('email', makeEmailValidatorStub()))
    makeAddStudentValidatorFactory()
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})