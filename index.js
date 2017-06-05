'use strict'

try {
  var dotenv = require('dotenv')
  dotenv.config()
  dotenv.load({ path: './.env' })

  var Rx = require('rxjs/Rx')
} catch (e) {
  console.log(e.stack)
  console.log(
    'Install NPM, run npm install and add the .env file to setup TOKENS'
  )
  process.exit()
}

try {
  var Discord = require('discord.js')
  var client = new Discord.Client()
} catch (e) {
  console.log('Error loading the discord bot')
  process.exit()
}

const games = require('./app/games.js')
const general = require('./app/general.js')
const media = require('./app/media.js')

const prefix = '!'
Rx.Observable.fromEvent(client, 'ready').subscribe(() => {
  console.log(`Bot online: ${client.readyAt}`)
})

const clientMessage$ = Rx.Observable
  .fromEvent(client, 'message')
  .share()
  .filter(message => message.content.startsWith(prefix))

/* General Bot Commands
   * !join: joins the bot in users the channel
   * !leave: leave channel
   * !clean: the whole botchannel is cleared
   */
const joinMessage$ = clientMessage$.filter(message =>
  message.content.startsWith(prefix + 'join')
)
general.joinChannel(joinMessage$)

const leaveMessage$ = clientMessage$.filter(message =>
  message.content.startsWith(prefix + 'leave')
)
general.leaveChannel(leaveMessage$)

const clearChannel$ = clientMessage$.filter(message =>
  message.content.startsWith(prefix + 'clean')
)
general.clearChannel(clearChannel$)

/* Game Commands
 * !ping: is replied with pong
 */
const pingMessage$ = clientMessage$.filter(message =>
  message.content.startsWith(prefix + 'ping')
)
games.pingpong(pingMessage$)

/* Media Commands 
 * !youtube[SPACE]url: plays the requested song
  */
const media$ = clientMessage$.filter(message =>
  message.content.startsWith(prefix + 'youtube')
)
media.play(media$, client)

client.login(process.env.UNREAL_BOT_TOKEN)
