const pingPong = require('../ping.js')

test('return pong when incoming message equals ping', () => {
  const message = 'ping'
  expect(pingPong(message)).toBe('pong')
})

test('replies Error when incoming message is not ping', () => {
  const message = 'someText'
  expect(pingPong(message)).toBe('ERROR')
})
