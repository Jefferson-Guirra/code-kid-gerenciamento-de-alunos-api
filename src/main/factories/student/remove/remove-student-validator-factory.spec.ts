import { CheckRequestValidator } from '../../../../presentation/helpers/validators/check-request-validator';
import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';
import { makeRemoveStudentValidatorFactory } from './remove-student-validator-factory';
jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('makeRemoveStudentValidatorFactory', () => {
  test('should call validatorComposite with correct validators', () => {
    const validators: Validation[] = []
    for (const field of ['id', 'accessToken']) {
      validators.push(new RequiredFieldsValidator(field))
    }
    validators.push(new CheckRequestValidator(['id', 'accessToken']))
    makeRemoveStudentValidatorFactory()
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})