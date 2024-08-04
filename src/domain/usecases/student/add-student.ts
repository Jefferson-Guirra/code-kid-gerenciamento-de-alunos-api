import { Student } from '../../models/student';

export interface AddStudentModel  extends Student{
  id: string
}

export interface UserAddStudent extends Student {
  accessToken: string
}

export interface AddStudent {
  add: (student: UserAddStudent) => Promise<AddStudentModel | null>
}