import { RemoveStudent } from '../../../../domain/usecases/student/remove-student';
import { LoadStudentByIdRepository } from '../../../protocols/db/student/load-student-by-id-repository';

export class DbRemoveStudent implements RemoveStudent {
  constructor(private readonly loadStudent: LoadStudentByIdRepository) {}
  async remove(id: string): Promise<'removed' | null> {
    this.loadStudent.loadById(id)
    return null
  }
}