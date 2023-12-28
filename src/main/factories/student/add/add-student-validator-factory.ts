import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';

export const makeAddStudentValidatorFactory = (): Validation => {
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
  return new ValidatorComposite(validators)
}