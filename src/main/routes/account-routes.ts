import { Router } from 'express';
import { adapterRouter } from '../adapters/express/express-adapter-routes';
import { makeSignupController } from '../factories/account/signup/signup-controller-factory';
import { makeLoginControllerFactory } from '../factories/account/login/login-controller-factory';
import { makeLogoutControllerFactory } from '../factories/account/logout/logout-controller-factory';

const accountRoute = (router: Router) => {
  router.post('/signup',adapterRouter(makeSignupController()))
  router.post('/login', adapterRouter(makeLoginControllerFactory()))
  router.delete('/logout', adapterRouter(makeLogoutControllerFactory()))
}

export default accountRoute