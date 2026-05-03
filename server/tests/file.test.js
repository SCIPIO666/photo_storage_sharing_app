const request = require('supertest');
const app = require('../app'); // Your Express app
const path = require('path');

describe('File API', () => {
  let token;

  beforeAll(async () => {
    
    token = process.env.JWT_SECRET;
  });

  describe('POST /api/files/upload', () => {
    it('should upload a file successfully and return 201', async () => {
      const res = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', path.resolve(__dirname, './test-assets/sample.png')) // Multer handles this
        .field('folderId', 'some-uuid'); // Optional folder

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('url');
      expect(res.body).toHaveProperty('publicId');
    });

    it('should return 400 if Zod validation fails (e.g., missing file)', async () => {
      const res = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(400);
    });
  });
});