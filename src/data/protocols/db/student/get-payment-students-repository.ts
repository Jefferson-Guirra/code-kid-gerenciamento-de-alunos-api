import { StudentModel } from '../../../../domain/models/student';

export interface getPaymentStudentsRepository {
  getPaymentStudents: (payment?: string) => Promise<StudentModel[] | null>
}