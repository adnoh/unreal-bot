exports.replyPong = function(pingMessage$) {
  const pongMessage$ = pingMessage$
    .switchMap(message => message.reply('pong'))
    .share()

  pongMessage$
    .withLatestFrom(pingMessage$, (x, pingMessage) => pingMessage)
    .merge(pongMessage$)
    .switchMap(message => message.delete(5000))
    .subscribe(() => console.log('Pong sent!'), err => console.log(err), null)
}
