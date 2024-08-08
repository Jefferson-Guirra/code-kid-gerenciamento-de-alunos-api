import { AddStudentModel } from './add-student';

export interface UserGetPayment {
  payment?: string,
  accessToken: string 
}

export interface PaymentStudents {
  getStudents: ( payment: UserGetPayment) => Promise<AddStudentModel[]| null>
}