import { CheckRequestValidator } from '../../../../presentation/helpers/validators/check-request-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';
import { makeValidatorUpdateStudentFactory } from './update-student-validator-factory';
jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('makeValidatorUpdateStudentFactory', () => { 
  test('should call ValidatorComposite with correct values', async () => { 
    const validators: Validation[] = []
    makeValidatorUpdateStudentFactory()
    validators.push(new CheckRequestValidator([
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
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)

  })
})