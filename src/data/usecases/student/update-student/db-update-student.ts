import { AddStudentModel } from '../../../../domain/usecases/student/add-student';
import { UpdateStudent } from '../../../../domain/usecases/student/update-student';
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository';
import { UpdateStudentByIdRepository } from '../../../protocols/db/student/update-student-by-id-repository';

export class DbUpdateStudent implements UpdateStudent {
  constructor( 
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly updateStudentByIdRepository: UpdateStudentByIdRepository
  ) {}
  async update (id: string, updateFields: any): Promise<AddStudentModel | null> {
    const {accessToken, ...fields} = updateFields 
    this.loadAccount.loadByAccessToken(accessToken)
    return await this.updateStudentByIdRepository.updateStudent(id, fields)
  }
}