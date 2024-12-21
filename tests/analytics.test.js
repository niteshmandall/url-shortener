const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const { redisClient } = require('../src/config/redis');

describe('Analytics API Tests', () => {
  let authToken;

  beforeAll(async () => {
    authToken = 'test-auth-token';
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await redisClient.quit();
  });

  describe('GET /api/analytics/topic/:topic', () => {
    it('should get topic-based analytics', async () => {
      const response = await request(app)
        .get('/api/analytics/topic/acquisition')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalClicks');
      expect(response.body).toHaveProperty('uniqueClicks');
      expect(response.body).toHaveProperty('urls');
    });
  });
});