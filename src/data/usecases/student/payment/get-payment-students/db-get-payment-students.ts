import { AddStudentModel } from '../../../../../domain/usecases/student/add-student';
import { PaymentStudents, UserGetPayment } from '../../../../../domain/usecases/student/payment-student';
import { getPaymentStudentsRepository } from '../../../../protocols/db/student/get-payment-students-repository';

export class DbGetPaymentStudents implements PaymentStudents {
  constructor(
    private readonly paymentStudents: getPaymentStudentsRepository
  ) {

  }
  async getStudents (getPayment: UserGetPayment): Promise<AddStudentModel[] | null> {
    const { accessToken, payment} = getPayment
    return await this.paymentStudents.getPaymentStudents(payment)
  }
}