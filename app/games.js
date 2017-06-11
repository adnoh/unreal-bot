const Rx = require('rxjs/Rx')

exports.pingpong = pingMessage$ => {
  try {
    const pongMessage$ = pingMessage$
      .switchMap(message =>
        Rx.Observable
          .fromPromise(message.reply('pong'))
          .catch(() => Rx.Observable.empty())
      )
      .share()

    return pingMessage$.merge(pongMessage$)
  } catch (err) {
    return Rx.Observable.throw(err)
  }
}
