const request = require('supertest');
const express = require('express');
const axios = require('axios');

// Mock axios
jest.mock('axios');

// Import server (you may need to refactor server.js to export app)
// For now, we'll create a simple test structure

describe('Backend Server', () => {
  let app;

  beforeAll(() => {
    // Create a simple Express app for testing
    app = express();
    app.use(express.json());
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Backend server is running' });
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message', 'Backend server is running');
    });
  });

  describe('POST /api/copywriter/generate', () => {
    it('should return 400 if API key is missing', async () => {
      const response = await request(app)
        .post('/api/copywriter/generate')
        .send({ topic: 'test' })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('API key');
    });

    it('should return 400 if API URL is missing', async () => {
      const response = await request(app)
        .post('/api/copywriter/generate')
        .set('x-llm-settings', JSON.stringify({ apiKey: 'test-key' }))
        .send({ topic: 'test' })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('API URL');
    });
  });

  describe('POST /api/topic-selector/generate', () => {
    it('should return 400 if API key is missing', async () => {
      const response = await request(app)
        .post('/api/topic-selector/generate')
        .send({ domain: 'beauty' })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('API key');
    });
  });
});
