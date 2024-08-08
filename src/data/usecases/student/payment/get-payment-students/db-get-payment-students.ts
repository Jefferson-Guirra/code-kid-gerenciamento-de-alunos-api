import { AddStudentModel } from '../../../../../domain/usecases/student/add-student';
import { PaymentStudents, UserGetPayment } from '../../../../../domain/usecases/student/payment-student';
import { LoadAccountByAccessTokenRepository } from '../../../../protocols/db/account/load-account-by-access-token-repository';
import { getPaymentStudentsRepository } from '../../../../protocols/db/student/get-payment-students-repository';

export class DbGetPaymentStudents implements PaymentStudents {
  constructor(
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly paymentStudents: getPaymentStudentsRepository
  ) {

  }
  async getStudents (request: UserGetPayment): Promise<AddStudentModel[] | null> {
    const { accessToken, payment} = request
      await this.loadAccount.loadByAccessToken(accessToken)
    return await this.paymentStudents.getPaymentStudents(payment)
  }
}