import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';
import { makeRemoveStudentValidatorFactory } from './remove-student-validator-factory';
jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('makeRemoveStudentValidatorFactory', () => {
  test('should call validatorComposite with correct validators', () => {
    const validators: Validation[] = []
    validators.push(new RequiredFieldsValidator('id'))
    makeRemoveStudentValidatorFactory()
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})