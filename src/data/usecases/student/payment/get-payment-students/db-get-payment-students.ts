import { StudentModel } from '../../../../../domain/models/student';
import { PaymentStudents, UserGetPayment } from '../../../../../domain/usecases/student/payment-student';
import { LoadAccountByAccessTokenRepository } from '../../../../protocols/db/account/load-account-by-access-token-repository';
import { getPaymentStudentsRepository } from '../../../../protocols/db/student/get-payment-students-repository';

export class DbGetPaymentStudents implements PaymentStudents {
  constructor(
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly paymentStudents: getPaymentStudentsRepository
  ) {

  }
  async getStudents (request: UserGetPayment): Promise<StudentModel[] | null> {
    const { accessToken, payment} = request
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if(!account) {
      return null
    } 
    return await this.paymentStudents.getPaymentStudents(payment)
  }
}