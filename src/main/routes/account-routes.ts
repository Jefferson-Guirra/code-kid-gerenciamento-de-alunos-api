import { Router } from 'express';
import { adapterRouter } from '../adapters/express/express-adapter-routes';
import { makeSignupController } from '../factories/account/signup/signup-controller-factory';
import { makeLoginControllerFactory } from '../factories/account/login/login-controller-factory';

const accountRoute = (router: Router) => {
  router.post('/signup',adapterRouter(makeSignupController()))
  router.post('/login', adapterRouter(makeLoginControllerFactory()))
}

export default accountRoute