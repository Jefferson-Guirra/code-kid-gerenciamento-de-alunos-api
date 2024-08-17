import { StudentModel } from '../../../../domain/models/student';
import { UpdateStudent } from '../../../../domain/usecases/student/update-student';
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository';
import { UpdateStudentByIdRepository } from '../../../protocols/db/student/update-student-by-id-repository';

export class DbUpdateStudent implements UpdateStudent {
  constructor( 
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly updateStudentByIdRepository: UpdateStudentByIdRepository
  ) {}
  async update (id: string, updateFields: any): Promise<StudentModel | null> {
    const {accessToken, ...fields} = updateFields 
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    
    if(!account) {
      return null
    }
    return await this.updateStudentByIdRepository.updateStudent(id, fields)
  }
}