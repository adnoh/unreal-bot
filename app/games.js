exports.pingpong = function(pingMessage$) {
  const pongMessage$ = pingMessage$
    .switchMap(message => message.reply('pong'))
    .share()

  pongMessage$
    .withLatestFrom(pingMessage$, (x, pingMessage) => pingMessage)
    .merge(pongMessage$)
    .switchMap(message => message.delete(5000))
    .subscribe(null, err => console.log(err), null)
}
