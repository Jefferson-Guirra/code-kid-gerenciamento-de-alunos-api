import { DbAddStudentRepository } from '../../../../data/usecases/student/add-student/db-add-student';
import { StudentMongoRepository } from '../../../../infra/db/student/student-mongo-repository';
import { AddStudentController } from '../../../../presentation/controllers/student/add/add-student-controller';
import { Controller } from '../../../../presentation/protocols/controller';
import { makeAddStudentValidatorFactory } from './add-student-validator-factory';

export const makeAddStudentControllerFactory = (): Controller => {
  const validator = makeAddStudentValidatorFactory()
  const studentMongoRepository = new StudentMongoRepository()
  const dbAddStudent = new DbAddStudentRepository(studentMongoRepository, studentMongoRepository)
  return new AddStudentController(validator, dbAddStudent)
}