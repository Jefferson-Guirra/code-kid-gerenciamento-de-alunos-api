import { Student } from '../../../../domain/models/student';

export interface LoadStudentByIdRepository {
  loadById: (id: string) => Promise<Student | null>
}