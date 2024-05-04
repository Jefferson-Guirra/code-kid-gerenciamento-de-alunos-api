import { CheckRequestValidator } from '../../../../presentation/helpers/validators/check-request-validator';
import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';
import { makeValidatorUpdateStudentFactory } from './update-student-validator-factory';
jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('makeValidatorUpdateStudentFactory', () => { 
  test('should call ValidatorComposite with correct values', async () => { 
    const validators: Validation[] = []
    makeValidatorUpdateStudentFactory()
    validators.push(new CheckRequestValidator([
      'id',
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
    ]))
    validators.push(new RequiredFieldsValidator('id'))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)

  })
})