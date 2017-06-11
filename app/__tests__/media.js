const Rx = require('rxjs/Rx')
const media = require('../media.js')
const EventEmitter = require('events').EventEmitter

describe('playYT', () => {
  test('should return an observable', () => {
    expect(media.playYT(null, null).subscribe).toBeDefined()
  })

  test('should error when either arguments are missing', done => {
    media.playYT(null, null).subscribe(
      () => {},
      err => {
        expect(err).toBeDefined()
        done()
      },
      done
    )
  })

  test('should not complete when the connection dispatch ends', () => {
    const event = new EventEmitter()
    const dispatch = Object.assign(event, {
      end: () => {
        event.emit('end')
      }
    })
    const connection = { playStream: () => dispatch }

    let results = []
    media.playYT(connection, null).subscribe(e => {
      console.log(e)
      results.push(e)
    }, console.error, () => {})

    dispatch.emit('end')
    expect(results.length).toBe(0)
  })

  test('should emit when the connection dispatch starts', () => {
    const event = new EventEmitter()
    const dispatch = Object.assign(event, {
      end: () => {
        event.emit('end')
      }
    })
    const connection = { playStream: () => dispatch }

    let results = []
    media.playYT(connection, null).subscribe(e => {
      results.push(e)
    }, console.error, () => {})

    dispatch.emit('start')
    dispatch.emit('end')
    dispatch.emit('start')
    expect(results.length).toBe(2)
  })
})

describe('play', () => {
  test('should return an observable', () => {
    const message$ = Rx.Observable.of('message')
    expect(media.play(message$).subscribe).toBeDefined()
  })

  test('should return an error observable when the message$ is not an observable', done => {
    const message$ = null
    expect(media.play(message$).subscribe).toBeDefined()

    media.play(message$).take(1).subscribe(
      () => {},
      err => {
        expect(err).toBeDefined()
        done()
      },
      done
    )
  })
})
