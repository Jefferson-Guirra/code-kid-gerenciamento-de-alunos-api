import { AddStudentModel } from '../../../../domain/usecases/student/add-student';

export interface getPaymentStudentsRepository {
  getPaymentStudents: (payment: string) => Promise<AddStudentModel[] | null>
}