import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validation'
import { makeAddStudentValidatorFactory } from './add-student-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

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
      'date_payment'
    ]){
      validators.push(new RequiredFieldsValidator(field))
    }
    makeAddStudentValidatorFactory()
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})