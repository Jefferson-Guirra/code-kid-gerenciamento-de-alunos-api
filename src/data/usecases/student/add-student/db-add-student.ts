import { Student } from '../../../../domain/models/student';
import { AddStudent, AddStudentModel } from '../../../../domain/usecases/student/add-student';
import { AddStudentRepository } from '../../../protocols/db/student/add-student-repository';
import { LoadStudentByName } from '../../../protocols/db/student/load-student-by-name-repository';

export class DbAddStudent implements AddStudent {
  constructor ( 
    private readonly loadStudent: LoadStudentByName,
    private readonly addStudentRepository: AddStudentRepository
    ) {}
  async add(student: Student): Promise<AddStudentModel | null> {
    const { name } = student
    const loadStudent = await this.loadStudent.loadByName(name)
    if(loadStudent) {
      return null
    }
    this.addStudentRepository.add(student)
    return {
      id: 'any_id',
      name: 'any_name',
      age: 0,
      father: 'any_father',
      mother: 'any_mother',
      phone: 0,
      course: ['any_course'],
      payment: 'yes',
      registration: 'active',
      date_payment: 'any_date',
    }
  }
}