// Write your tests here
const request = require('supertest');
const server = require('./server')
const db = require('../data/dbConfig')
const Users = require('./api/auth/auth-model')

const user1 = { username: 'aaa', password: 'fff'}
const user2 = { username: 'bbb', password: 'ggg'}
const user3 = { username: 'ccc', password: 'hhh'}
const user4 = { username: 'ddd', password: 'iii'}
const user5 = { username: 'eee', password: 'jjj'}

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

test('running on testing environment', () => {
  expect(process.env.NODE_ENV).toBe("testing")
})

describe('testing API endpoints', () => {
  test('#1 POST /api/auth/register', async () => {
    const result = await Users.

  })
})