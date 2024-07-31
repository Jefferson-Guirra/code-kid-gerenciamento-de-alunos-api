import { DbGetPaymentStudents } from '../../../../data/usecases/student/payment/get-payment-students/db-get-payment-students';
import { StudentMongoRepository } from '../../../../infra/db/student/student-mongo-repository';
import { StudentPaymentController } from '../../../../presentation/controllers/student/student-payment/student-payment-controller';
import { Controller } from '../../../../presentation/protocols/controller';
import { makeGetStudentPaymentValidator } from './get-payment-students-validator-factory';

export const makeGetPaymentStudentsControllerFactory = (): Controller => {
  const validator = makeGetStudentPaymentValidator()
  const studentMongoRepository = new StudentMongoRepository()
  const dbGetPaymentController = new DbGetPaymentStudents(studentMongoRepository)
  return new StudentPaymentController(validator, dbGetPaymentController)
} 