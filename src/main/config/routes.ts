import { Router, Express } from 'express';
import FastGlob from 'fast-glob';

const setupRoutes = (app: Express) => {
  const router = Router()
  app.use('/api', router)
  FastGlob.sync('**/src/main/routes/**routes.ts').map(async file =>(await import(`../../../${file}`)).default(router))
}
export default setupRoutes