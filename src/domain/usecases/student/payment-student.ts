import { AddStudentModel } from './add-student';

export interface PaymentStudents {
  getStudents: (payment?: string ) => Promise<AddStudentModel[]| null>
}