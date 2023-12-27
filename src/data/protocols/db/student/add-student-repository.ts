import { Student } from '../../../../domain/models/student';
import { AddStudent, AddStudentModel } from '../../../../domain/usecases/student/add-student';

export interface AddStudentRepository {
  add: (student: Student) => Promise<AddStudentModel | null>
}