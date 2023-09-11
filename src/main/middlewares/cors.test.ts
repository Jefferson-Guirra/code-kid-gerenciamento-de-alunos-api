import app from '../config/app'
import request from 'supertest'
describe('Cors', () => { 
  test('should enable CORS', async () => { 
    app.get('/test_cors', (req, res) => {
      res.send()
    })
    await request(app).get('/test_cors').expect('access-control-allow-origin', '*')
    await request(app).get('/test_cors').expect('access-control-allow-methods', '*')
    await request(app).get('/test_cors').expect('access-control-allow-headers', '*')
   })
})