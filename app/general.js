const Rx = require('rxjs/Rx')

exports.clearChannel = function(message$) {
  message$
    .map(message => message.channel)
    .filter(channel => channel.name === 'bottestchannel')
    .switchMap(channel => channel.fetchMessages())
    .switchMap(collection => Rx.Observable.of(collection.deleteAll()))
    .subscribe(
      () => console.log('Channel Cleared'),
      err => console.log(err),
      null
    )
}

exports.joinChannel = function(message$) {
  message$
    .filter(message => message.member.voiceChannel)
    .map(message => message.member.voiceChannel)
    .switchMap(voiceChannel => voiceChannel.join())
    .withLatestFrom(message$, (_, message) => message.delete())
    .subscribe(() => console.log('Joined Channel'))
}

exports.leaveChannel = function(message$) {
  message$
    .filter(message => message.member.voiceChannel)
    .switchMap(message => message.delete())
    .map(message => message.member.voiceChannel)
    .subscribe(voiceChannel => {
      voiceChannel.leave()
      console.log('Left Channel')
    })
}
