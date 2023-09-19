import { Router } from 'express';
import { adapterRouter } from '../adapters/express/express-adapter-routes';
import { makeSignupController } from '../factories/account/signup/signup-controller-factory';

const accountRoute = (router: Router) => {
  router.post('/signup',adapterRouter(makeSignupController()))
}

export default accountRoute