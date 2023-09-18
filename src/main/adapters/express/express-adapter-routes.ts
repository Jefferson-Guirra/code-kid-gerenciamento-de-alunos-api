import { Request, Response } from 'express';
import { Controller } from '../../../presentation/protocols/controller';

export const adapterRouter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpResponse = await controller.handle(req)
    if(httpResponse.statusCode === 200) {
      res.status(httpResponse.statusCode).json(httpResponse)
    }
    else{
      res.status(httpResponse.statusCode).json({
        statusCode: httpResponse.statusCode,
        error: httpResponse.body.message
      })
    }
  }

}