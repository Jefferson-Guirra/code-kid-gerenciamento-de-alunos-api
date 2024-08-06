import { DbUpdateStudent } from '../../../../data/usecases/student/update-student/db-update-student';
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository';
import { StudentMongoRepository } from '../../../../infra/db/student/student-mongo-repository';
import { UpdateStudentController } from '../../../../presentation/controllers/student/update/update-student-controller';
import { Controller } from '../../../../presentation/protocols/controller';
import { makeValidatorUpdateStudentFactory } from './update-student-validator-factory';

export const makeUpdateStudentControllerFactory = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const updateValidatorComposite = makeValidatorUpdateStudentFactory()
  const studentMongoRepository = new StudentMongoRepository()
  const dbUpdateStudent = new DbUpdateStudent( accountMongoRepository,studentMongoRepository)
  const updateStudentController = new UpdateStudentController(updateValidatorComposite,dbUpdateStudent)
  return updateStudentController
}