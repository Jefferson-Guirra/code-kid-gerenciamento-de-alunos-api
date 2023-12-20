import { Student } from '../../models/student';

export interface AddStudentModel  extends Student{
  id: string
}

export interface AddStudent {
  add: (student: Student) => AddStudentModel | null
}