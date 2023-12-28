import { Student } from '../../../../domain/models/student';
import { AddStudent, AddStudentModel } from '../../../../domain/usecases/student/add-student';
import { AddStudentRepository } from '../../../protocols/db/student/add-student-repository';
import { LoadStudentByNameRepository } from '../../../protocols/db/student/load-student-by-name-repository';

export class DbAddStudentRepository implements AddStudent {
  constructor ( 
    private readonly loadStudent: LoadStudentByNameRepository,
    private readonly addStudentRepository: AddStudentRepository
    ) {}
  async add(student: Student): Promise<AddStudentModel | null> {
    const { name } = student
    const loadStudent = await this.loadStudent.loadByName(name)
    if(loadStudent) {
      return null
    }
    const newStudent = await this.addStudentRepository.add(student)
    return newStudent
  }
}