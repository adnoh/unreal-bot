const Rx = require('rxjs/Rx')
const general = require('../general.js')

describe('clearChannel', () => {
  test('should return an observable', () => {
    const message$ = Rx.Observable.of(1)
    expect(general.clearChannel(message$).subscribe).toBeDefined()
  })

  test('should return an error observable when the message$ is not an observable', done => {
    const message$ = null
    expect.any(general.clearChannel(message$).subscribe)

    general.clearChannel(message$).take(1).subscribe(
      () => {},
      err => {
        expect(err).toBeDefined()
        done()
      },
      done
    )
  })

  test('should emit when the message is sent from the targetted channel', done => {
    const channelName = 'testchannel'
    const messages = ['message']
    const channel = {
      name: channelName,
      fetchMessages: () => Promise.resolve(messages)
    }
    const message = { channel }
    const message$ = Rx.Observable.of(message)

    let results = []
    general.clearChannel(message$, channelName).subscribe(messages => {
      results.push(...messages)
    }, console.error, () => {
      expect(results).toEqual(messages)
      done()
    })
  })
  test('should not emit when the message is sent from the wrong channel', done => {
    const targetChannelName = 'testchannel'
    const otherChannelName = 'wrong channel'
    const messages = ['message']
    const channel = {
      name: otherChannelName,
      fetchMessages: () => Promise.resolve(messages)
    }
    const message = { channel }
    const message$ = Rx.Observable.of(message)

    let results = []
    general.clearChannel(message$, targetChannelName).subscribe(messages => {
      results.push(...messages)
    }, console.error, () => {
      expect(results).toEqual([])
      done()
    })
  })
})

describe('joinChannel', () => {
  test('should return an observable', () => {
    const message$ = Rx.Observable.of(1)
    expect(general.joinChannel(message$).subscribe).toBeDefined()
  })

  test('should return an error observable when the message$ is not an observable', done => {
    const message$ = null
    expect.any(general.joinChannel(message$).subscribe)

    general.clearChannel(message$).take(1).subscribe(
      () => {},
      err => {
        expect(err).toBeDefined()
        done()
      },
      done
    )
  })

  test('should emit the received message when the calling member is a voiceChannel', done => {
    const voiceChannel = {
      join: () => Promise.resolve()
    }
    const member = { voiceChannel }
    const message = { member }
    const message$ = Rx.Observable.of(message)

    let results = []
    general.joinChannel(message$).subscribe(message => {
      results.push(message)
    }, console.error, () => {
      expect(results).toEqual([message])
      done()
    })
  })

  test('should emit the received message when joining the channel fails', done => {
    const voiceChannel = {
      join: () => Promise.reject(new Error())
    }
    const member = { voiceChannel }
    const message = { member }
    const message$ = Rx.Observable.of(message)

    let results = []
    general.joinChannel(message$).subscribe(message => {
      results.push(message)
    }, console.error, () => {
      expect(results).toEqual([message])
      done()
    })
  })

  test('should not emit when the calling member is not in a voiceChannel', done => {
    const voiceChannel = undefined
    const member = { voiceChannel }
    const message = { member }
    const message$ = Rx.Observable.of(message)

    let results = []
    general.joinChannel(message$).subscribe(message => {
      results.push(message)
    }, console.error, () => {
      expect(results).toEqual([])
      done()
    })
  })
})

describe('leaveChannel', () => {
  test('should return an observable', () => {
    const message$ = Rx.Observable.of(1)
    expect(general.leaveChannel(message$).subscribe).toBeDefined()
  })

  test('should return an error observable when the message$ is not an observable', done => {
    const message$ = null
    expect.any(general.leaveChannel(message$).subscribe)

    general.clearChannel(message$).take(1).subscribe(
      () => {},
      err => {
        expect(err).toBeDefined()
        done()
      },
      done
    )
  })

  test('should emit a voiceChannel when calling member is in a voiceChannel', done => {
    const voiceChannel = 'channel'
    const member = { voiceChannel }
    const deletedMessage = { member }
    const message = { member, delete: () => Promise.resolve(deletedMessage) }
    const message$ = Rx.Observable.of(message)

    let results = []
    general.leaveChannel(message$).subscribe(message => {
      results.push(message)
    }, console.error, () => {
      expect(results).toEqual([voiceChannel])
      done()
    })
  })

  test('should emit a voiceChannel when deleting the message fails', done => {
    const voiceChannel = 'channel'
    const member = { voiceChannel }
    const message = { member, delete: () => Promise.reject(new Error()) }
    const message$ = Rx.Observable.of(message)

    let results = []
    general.leaveChannel(message$).subscribe(message => {
      results.push(message)
    }, console.error, () => {
      expect(results).toEqual([voiceChannel])
      done()
    })
  })

  test('should not emit a voiceChannel when calling member is not in a voiceChannel', done => {
    const voiceChannel = undefined
    const member = { voiceChannel }
    const message = { member, delete: () => Promise.reject(new Error()) }
    const message$ = Rx.Observable.of(message)

    let results = []
    general.leaveChannel(message$).subscribe(message => {
      results.push(message)
    }, console.error, () => {
      expect(results).toEqual([])
      done()
    })
  })
})
