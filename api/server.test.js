// Write your tests here
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})

test('running on testing environment', () => {
  expect(process.env.NODE_ENV).toBe("testing")
})