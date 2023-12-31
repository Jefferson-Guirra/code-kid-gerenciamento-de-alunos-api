import { RemoveStudent } from '../../../../domain/usecases/student/remove-student';
import { LoadStudentByIdRepository } from '../../../protocols/db/student/load-student-by-id-repository';

export class DbRemoveStudent implements RemoveStudent {
  constructor(private readonly loadStudent: LoadStudentByIdRepository) {}
  async remove(id: string): Promise<'removed' | null> {
    const student = await this.loadStudent.loadById(id)
    if(!student) {
      return null
    }
    return 'removed'
  }
}