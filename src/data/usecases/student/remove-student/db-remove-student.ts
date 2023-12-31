import { RemoveStudent } from '../../../../domain/usecases/student/remove-student';
import { LoadStudentByIdRepository } from '../../../protocols/db/student/load-student-by-id-repository';
import { RemoveStudentByIdRepository } from '../../../protocols/db/student/remove-student-by-id-repository';

export class DbRemoveStudent implements RemoveStudent {
  constructor(
    private readonly loadStudent: LoadStudentByIdRepository,
    private readonly removeStudent: RemoveStudentByIdRepository
    ) {}
  async remove(id: string): Promise<'removed' | null> {
    const student = await this.loadStudent.loadById(id)
    if(!student) {
      return null
    }
    await this.removeStudent.removeById(id)
    return 'removed'
  }
}