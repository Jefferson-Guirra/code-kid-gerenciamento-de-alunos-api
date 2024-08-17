import { StudentModel } from '../../models/student';

export interface UserGetPayment {
  payment?: string,
  accessToken: string 
}

export interface PaymentStudents {
  getStudents: ( payment: UserGetPayment) => Promise<StudentModel[]| null>
}