// Write your tests here
const request = require('supertest');
const server = require('./server')
const db = require('../data/dbConfig')
const Users = require('../api/auth/auth-model')
const bcrypt = require('bcryptjs')

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

beforeEach(async () => {
  await db('users').truncate();
});

test('sanity', () => {
  expect(true).toBe(true)
})

test('running on testing environment', () => {
  expect(process.env.NODE_ENV).toBe("testing")
})

describe('testing API endpoints', () => {
  test('#1 - POST /api/auth/register - basic check to see if post request can be made', async () => {
    let result = await request(server).post('/api/auth/register').send({ username: 'aaa', password: '111'})
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({ id: 1, username: 'aaa'})
    expect(result.status).not.toBe(400)
    expect(result.body).not.toMatchObject({ id: 2, username: 'bbb'})
  })
  test('#2 - POST /api/auth/register - check password is stored as hash in correct username', async () => {
    let result = await request(server).post('/api/auth/register').send({ username: 'bbb', password: '222'})
    let input = await db('users').where('username', 'bbb').first()
    expect(bcrypt.compareSync('222', input.password)).toBeTruthy()
    expect(input).toMatchObject({ id: 1, username: 'bbb', password: input.password })
  })
  test('#3 - POST /api/auth/register - checking missingUsernameOrPassword middleware', async () => {
    let result
    result = await request(server).post('/api/auth/register').send({ username: '', password: '333'})
    expect(result.status).toBe(400)
    expect(result).not.toHaveProperty('username', '')
    result = await request(server).post('/api/auth/register').send({ username: 'ccc', password: ''})
    expect(result.status).toBe(400)
    expect(result).not.toHaveProperty('username', 'ccc')
    expect(result.body.message).toBe("username and password required")
  })
  test('#4 - POST /api/auth/register - checking alreadyTakeUsername middleware', async () => {
    let result
    result = await request(server).post('/api/auth/register').send({ username: 'aaa', password: '111'})
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({ id: 1, username: 'aaa'})
    result = await request(server).post('/api/auth/register').send({ username: 'aaa', password: '222'})
    expect(result.status).toBe(400)
    expect(result.body).not.toMatchObject({ id: 1, username: 'aaa'})
    expect(result.body.message).toBe("username taken")
  })
  test('#5 - POST /api/auth/login - basic check to see if post request can be made', async () => {
    let result
    result = await request(server).post('/api/auth/register').send({ username: 'aaa', password: '111'})
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({ id: 1, username: 'aaa'})
    result = await request(server).post('/api/auth/login').send({ username: 'aaa', password: '111'})
    expect(result.status).toBe(200)
    expect(result.body.message).toBe("welcome, aaa",)
    expect(result.body.token).toBeDefined()
  })
  test('#6 - POST /api/auth/login - checking missingUsernameOrPassword middleware - username', async () => {
    let result
    result = await request(server).post('/api/auth/register').send({ username: 'aaa', password: '111'})
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({ id: 1, username: 'aaa'})
    result = await request(server).post('/api/auth/login').send({ username: '', password: '111'})
    expect(result.status).toBe(400)
    expect(result.body.message).not.toBe("welcome, aaa",)
    expect(result.body.message).toBe("username and password required")
  })
  test('#7 - POST /api/auth/login - checking missingUsernameOrPassword middleware - password', async () => {
    let result
    result = await request(server).post('/api/auth/register').send({ username: 'bbb', password: '222'})
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({ id: 1, username: 'bbb'})
    result = await request(server).post('/api/auth/register').send({ username: 'bbb', password: ''})
    expect(result.status).toBe(400)
    expect(result.body.message).not.toBe("welcome, aaa",)
    expect(result.body.message).toBe("username and password required")
  })
  test('#8 - POST /api/auth/login - checking usernameExistsOrPasswordInvalid middleware', async () => {

  })
})