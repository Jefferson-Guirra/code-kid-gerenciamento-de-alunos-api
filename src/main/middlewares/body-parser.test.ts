import request from 'supertest'
import app from '../config/app'
describe('bodyParser', () => { 
  test('should parse body as json', async () => { 
     app.post('/test_body_parser', (req, res) => {
      return res.send(req.body)
     })
     await request(app).post('/test_body_parser').send({name: 'jefferson'}).expect({name: 'jefferson'})
   })

})