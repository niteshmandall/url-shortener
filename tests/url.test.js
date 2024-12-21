const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const { redisClient } = require('../src/config/redis');

describe('URL Shortener API Tests', () => {
  let authToken;

  beforeAll(async () => {
    // Mock Google authentication for testing
    authToken = 'test-auth-token';
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await redisClient.quit();
  });

  describe('POST /api/shorten', () => {
    it('should create a short URL', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          longUrl: 'https://example.com',
          customAlias: 'test123',
          topic: 'acquisition'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('shortUrl');
      expect(response.body).toHaveProperty('createdAt');
    });
  });

  describe('GET /api/analytics/url/:alias', () => {
    it('should get URL analytics', async () => {
      const response = await request(app)
        .get('/api/analytics/url/test123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalClicks');
      expect(response.body).toHaveProperty('uniqueClicks');
    });
  });
});