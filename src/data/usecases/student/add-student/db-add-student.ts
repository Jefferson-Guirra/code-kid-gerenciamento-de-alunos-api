import { StudentModel } from '../../../../domain/models/student';
import { AddStudent, AddStudentModel } from '../../../../domain/usecases/student/add-student';
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository';
import { AddStudentRepository } from '../../../protocols/db/student/add-student-repository';
import { LoadStudentByNameRepository } from '../../../protocols/db/student/load-student-by-name-repository';

export class DbAddStudentRepository implements AddStudent {
  constructor ( 
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly loadStudent: LoadStudentByNameRepository,
    private readonly addStudentRepository: AddStudentRepository
    ) {}
  async add(student: AddStudentModel): Promise<StudentModel | null> {
    const { name, accessToken,...rest } = student
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if(!account) {
      return null
    }
    const loadStudent = await this.loadStudent.loadByName(name)  
    if(loadStudent) {
      return null
    }
    const newStudent = await this.addStudentRepository.add({name, ...rest})
    return newStudent
  }
}