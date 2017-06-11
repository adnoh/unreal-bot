const Rx = require('rxjs/Rx')
const games = require('../games.js')

describe('pingong', () => {
  test('should return an observable', () => {
    const message$ = Rx.Observable.of(1)
    expect(games.pingpong(message$).subscribe).toBeDefined()
  })

  test('should return an error observable when the message$ is not an observable', done => {
    const message$ = null
    expect.any(games.pingpong(message$).subscribe)

    games.pingpong(message$).take(1).subscribe(
      () => {},
      err => {
        expect(err).toBeDefined()
        done()
      },
      done
    )
  })

  test('should return a stream with the replied- and received message', done => {
    const repliedMsg = { reply: () => Promise.resolve('pong') }
    const receivedMsg = { reply: () => Promise.resolve(repliedMsg) }

    const msg$ = Rx.Observable.of(receivedMsg)
    let result = []

    games.pingpong(msg$).subscribe(x => result.push(x), done, () => {
      expect(result).toEqual([receivedMsg, repliedMsg])
      done()
    })
  })

  test('should return a stream with the received message when the reply errors', done => {
    const receivedMsg = { reply: () => Promise.reject(new Error()) }
    const msg$ = Rx.Observable.of(receivedMsg)

    let results = []
    games
      .pingpong(msg$)
      .take(1)
      .subscribe(msg => results.push(msg), done, () => {
        expect(results).toEqual([receivedMsg])
        done()
      })
  })
})
