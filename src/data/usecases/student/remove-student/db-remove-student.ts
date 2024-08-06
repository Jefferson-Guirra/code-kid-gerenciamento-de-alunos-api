import { RemoveStudent } from '../../../../domain/usecases/student/remove-student';
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository';
import { LoadStudentByIdRepository } from '../../../protocols/db/student/load-student-by-id-repository';
import { RemoveStudentByIdRepository } from '../../../protocols/db/student/remove-student-by-id-repository';

export class DbRemoveStudent implements RemoveStudent {
  constructor(
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly loadStudent: LoadStudentByIdRepository,
    private readonly removeStudent: RemoveStudentByIdRepository
    ) {}
  async remove(accessToken: string ,id: string): Promise<'removed' | null> {
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if(!account) {
      return null
    }
    const student = await this.loadStudent.loadById(id)
    if(!student) {
      return null
    }
    const response = await this.removeStudent.removeById(id)
    return response as 'removed'
  }
}