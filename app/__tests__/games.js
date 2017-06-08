const Rx = require('rxjs/Rx')
const games = require('../games.js')

test('failing test with marbles', done => {
  const test = new Rx.TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected)
  )
  const message = { reply: msg => Promise.resolve('pong') }
  const values = {
    a: message,
    b: 'pong'
  }

  const message$ = test.createHotObservable('-a-', values)
  const pingpong$ = games.pingpong(message$, test)
  const received$ = '-b-'

  test.expectObservable(pingpong$).toBe(received$, values)
  test.flush()
})

test('pingpong should return an observable', () => {
  const message$ = Rx.Observable.of(1)
  expect.any(games.pingpong(message$).subscribe)
})
})
