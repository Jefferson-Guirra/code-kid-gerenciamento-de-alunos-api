import { CheckRequestValidator } from '../../../../presentation/helpers/validators/check-request-validator';
import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';

export const makeRemoveStudentValidatorFactory = (): Validation => {
  const validators: Validation[] = []

  for (const field of ['id', 'accessToken']) {
    validators.push(new RequiredFieldsValidator(field))
  }
  
  validators.push(new CheckRequestValidator(['id', 'accessToken']))
  return new ValidatorComposite(validators) 
}