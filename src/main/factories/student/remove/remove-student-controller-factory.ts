import { DbRemoveStudent } from '../../../../data/usecases/student/remove-student/db-remove-student';
import { StudentMongoRepository } from '../../../../infra/db/student/student-mongo-repository';
import { RemoveStudentController } from '../../../../presentation/controllers/student/remove/remove-student-controller';
import { Controller } from '../../../../presentation/protocols/controller';
import { makeRemoveStudentValidatorFactory } from './remove-student-validator-factory';

export const makeRemoveStudentControllerFactory = (): Controller => {
  const validator = makeRemoveStudentValidatorFactory()
  const studentMongoRepository = new StudentMongoRepository()
  const dbRemoveStudent = new DbRemoveStudent(studentMongoRepository, studentMongoRepository)
  return new RemoveStudentController(validator, dbRemoveStudent)
}