const request = require('supertest');
const server = require('../../api/app');
const db = require('../../data/db-config');

jest.mock('../../api/middleware/authRequired', () =>
  jest.fn((req, res, next) => next())
);

const {
  avatars: [avatar],
  badRequest,
} = require('../../data/testdata');

describe('avatar router endpoints', () => {
  beforeAll(async () => {
    await db.raw('TRUNCATE TABLE public."Avatars" RESTART IDENTITY CASCADE');
  });
  afterAll(async () => {
    await db.raw('TRUNCATE TABLE public."Avatars" RESTART IDENTITY CASCADE');
  });

  describe('POST /avatar', () => {
    it('should successfully add an avatar to the database', async () => {
      const res = await request(server).post('/avatar').send(avatar);

      expect(res.status).toBe(201);
      expect(res.body.ID).toBe(1);
    });

    it('should return a 400 on poorly formatted avatar', async () => {
      const res = await request(server).post('/avatar').send(badRequest);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('InvalidAvatar');
    });

    it('should restrict the addition of redundant avatars', async () => {
      const res = await request(server).post('/avatar').send(avatar);

      expect(res.status).toBe(500);
      expect(res.body.message).toContain('unique');
    });
  });

  describe('GET /avatars', () => {
    it('should return a 200 and empty array on success', async () => {
      const res = await request(server).get('/avatars');

      expect(res.status).toBe(200);
    });
  });
});