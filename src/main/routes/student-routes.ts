import { Router } from 'express';
import { adapterRouter } from '../adapters/express/express-adapter-routes';
import { makeAddStudentControllerFactory } from '../factories/student/add/add-student-controller-factory';
import { makeRemoveStudentControllerFactory } from '../factories/student/remove/remove-student-controller-factory';
import { makeUpdateStudentControllerFactory } from '../factories/student/update/update-student-controller-factory';
import { makeGetPaymentStudentsControllerFactory } from '../factories/student/get-payment-students/get-payment-students-controller-factory';

const studentRoutes = (router: Router) => {
  router.post('/add-student', adapterRouter(makeAddStudentControllerFactory()))
  router.delete('/remove-student', adapterRouter(makeRemoveStudentControllerFactory()))
  router.put('/update-student', adapterRouter(makeUpdateStudentControllerFactory()))
  router.post('/get-payment-students', adapterRouter(makeGetPaymentStudentsControllerFactory()))
}

export default studentRoutes