import { Student } from '../../../../domain/models/student';
import { AddStudent, AddStudentModel } from '../../../../domain/usecases/student/add-student';
import { LoadStudentByName } from '../../../protocols/db/student/load-student-by-name';

export class DbAddStudent implements AddStudent {
  constructor ( private readonly loadStudent: LoadStudentByName) {}
  async add(student: Student): Promise<AddStudentModel | null> {
    const { name } = student
    this.loadStudent.loadByName(name)
    return null
  }
}