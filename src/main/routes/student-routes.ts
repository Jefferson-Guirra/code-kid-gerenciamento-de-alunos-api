import { Router } from 'express';
import { adapterRouter } from '../adapters/express/express-adapter-routes';
import { makeAddStudentControllerFactory } from '../factories/student/add/add-student-controller-factory';
import { makeRemoveStudentControllerFactory } from '../factories/student/remove/remove-student-controller-factory';

const studentRoutes = (router: Router) => {
  router.post('/add-student', adapterRouter(makeAddStudentControllerFactory()))
  router.delete('/remove-student', adapterRouter(makeRemoveStudentControllerFactory()))
}

export default studentRoutes