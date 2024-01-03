import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';

export const makeRemoveStudentValidatorFactory = (): Validation => {
  const validators: Validation[] = []
  validators.push(new RequiredFieldsValidator('id'))
  return new ValidatorComposite(validators) 
}