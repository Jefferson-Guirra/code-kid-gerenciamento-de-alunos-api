import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';
import { makeLogoutValidatorFactory } from './logout-validator-factory';

jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('makeLogoutValidatorFactory', () => {
  test('should call ValidatorComposite with correct validators', () => {
    const validators: Validation[] = []
    validators.push(new RequiredFieldsValidator('accessToken'))
    makeLogoutValidatorFactory()
    expect(ValidatorComposite).toHaveBeenCalledWith(validators) 
  })
})