import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';

export const makeLogoutValidatorFactory = (): Validation => {
  const validators: Validation[] = []
  validators.push(new RequiredFieldsValidator('accessToken'))
  return new ValidatorComposite(validators)
}