const Rx = require('rxjs/Rx')
const ytdl = require('ytdl-core')
const searchYT = require('youtube-search')

exports.play = function(message$, client) {
  const delayUntilEnd$ = new Rx.Subject()

  const memberInVoiceChannel$ = message$.filter(
    message => message.guild.voiceConnection
  )
  const messageContent$ = memberInVoiceChannel$.map(message =>
    message.content.split(' ')[1].trim()
  )

  const youtube$ = memberInVoiceChannel$
    .map(message => message.guild.voiceConnection)
    .withLatestFrom(messageContent$, (connection, link) => {
      const stream = ytdl(link, { filter: 'audioonly', quality: '250' })
      return { connection, stream }
    })

  const dispatch$ = youtube$.switchMap(({ connection, stream }) =>
    playYT(connection, stream)
  )

  dispatch$
    .withLatestFrom(message$, (_, message) => message)
    .switchMap(message => message.delete())
    .subscribe(
      () => console.log('Started Playing: some song'),
      () => console.log('error'),
      () => console.log('completed')
    )
}

function playYT(connection, stream) {
  const streamOptions = { seek: 0, volume: 0.25 }

  return Rx.Observable
    .create(ob => {
      const dispatch = connection.playStream(stream, streamOptions)
      Rx.Observable.fromEvent(dispatch, 'start').subscribe(e => ob.next(e))
      Rx.Observable.fromEvent(dispatch, 'end').subscribe(e => ob.complete())
      return () => dispatch.end()
    })
    .repeat()
}
