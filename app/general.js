const Rx = require('rxjs/Rx')

exports.clearChannel = function(message$) {
  return message$
    .map(message => message.channel)
    .filter(channel => channel.name === 'bottestchannel')
    .switchMap(channel => channel.fetchMessages())
    .switchMap(collection => Rx.Observable.of(collection.deleteAll()))
}

exports.joinChannel = function(message$) {
  return message$
    .filter(message => message.member.voiceChannel)
    .map(message => message.member.voiceChannel)
    .switchMap(voiceChannel => voiceChannel.join())
    .withLatestFrom(message$, (_, message) => message.delete())
}

exports.leaveChannel = function(message$) {
  return message$
    .filter(message => message.member.voiceChannel)
    .switchMap(message => message.delete())
    .map(message => message.member.voiceChannel)
}
