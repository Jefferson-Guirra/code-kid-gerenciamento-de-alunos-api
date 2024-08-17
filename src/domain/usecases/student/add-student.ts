import { StudentModel } from '../../models/student';

export interface AddStudentModel{
  name: string,
  price: number,
  age: number,
  father: string
  mother:string,
  phone: number,
  course: string[],
  payment: string,
  date_payment: string[],
  email: string,
  registration: | 'active' | 'suspense' | 'inactive'
  accessToken: string
}

export interface AddStudent {
  add: (student: AddStudentModel) => Promise<StudentModel | null>
}