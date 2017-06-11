const Rx = require('rxjs/Rx')

exports.clearChannel = function(message$, channelName) {
  try {
    return message$
      .map(message => message.channel)
      .filter(channel => channel.name === channelName)
      .switchMap(channel => channel.fetchMessages())
  } catch (err) {
    return Rx.Observable.throw(err)
  }
}

exports.joinChannel = function(message$) {
  try {
    return message$
      .filter(message => message.member.voiceChannel)
      .map(message => message.member.voiceChannel)
      .switchMap(voiceChannel =>
        Rx.Observable.fromPromise(
          voiceChannel.join().catch(() => Rx.Observable.empty())
        )
      )
      .withLatestFrom(message$, (_, message) => message)
  } catch (err) {
    return Rx.Observable.throw(err)
  }
}

exports.leaveChannel = function(message$) {
  try {
    return message$
      .filter(message => message.member.voiceChannel)
      .switchMap(message =>
        Rx.Observable
          .fromPromise(message.delete())
          .catch(() => Rx.Observable.of(message))
      )
      .map(message => message.member.voiceChannel)
  } catch (err) {
    return Rx.Observable.throw(err)
  }
}
