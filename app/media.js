const Rx = require('rxjs/Rx')
const ytdl = require('ytdl-core')
const searchYT = require('youtube-search')

exports.play = function(message$, client, playYT) {
  const memberInVoiceChannel$ = message$.filter(
    message => message.guild.voiceConnection
  )

  const messageContent$ = memberInVoiceChannel$.switchMap(message => {
    const searchArgument = message.content.match(/(?!!youtube) (.*)/)[1]
    if (searchArgument.includes('http')) {
      return Rx.Observable.of(searchArgument)
    } else {
      const searchYT$ = Rx.Observable.bindNodeCallback(searchYT)
      return searchYT$(searchArgument, {
        maxResults: 1,
        key: process.env.YOUTUBE_API_KEY
      }).map(results => results[0].reduce((link, video) => video.link, ''))
    }
  })

  const youtube$ = Rx.Observable.zip(
    memberInVoiceChannel$.map(message => message.guild.voiceConnection),
    messageContent$,
    (connection, link) => {
      const stream = ytdl(link, { filter: 'audioonly' })
      return { connection, stream }
    }
  )

  const dispatch$ = youtube$.switchMap(({ connection, stream }) =>
    playYT(connection, stream)
  )

  return dispatch$
    .withLatestFrom(message$, (_, message) => message)
    .switchMap(message => message.delete())
}

exports.playYT = function(connection, stream) {
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
