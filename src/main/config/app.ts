import express from 'express'
import { bodyParser } from '../middlewares/body-parser'
import { setupMiddlewares } from './setup-middlewares'

const app = express()
setupMiddlewares(app)
export default app