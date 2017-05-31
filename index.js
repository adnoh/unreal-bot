const dotenv = require('dotenv')
dotenv.config()
dotenv.load({ path: './.env' })

const Discord = require('discord.js')
const client = new Discord.Client()

// YoutubeClient.setKey(process.env.YOUTUBE_TOKEN)

const broadcast = client.createVoiceBroadcast()
const ytdl = require('ytdl-core')
const streamOptions = { seek: 0, volume: 0.1 }

const findInfiles = require('find-in-files')


client.on('ready', () => {
  console.log('I am ready!')
})

/* PongBot Code
  * Use: !ping
  * Bot will reply 'pong' to the user.
  */
client.on('message', message => {
  if (message.content === '!ping') {
    message.reply('pong')
    message.delete(5000)
  }
})

/*  MusicBot Code
  * Use: !youtube + url
  * Play's the audio of a youtube video in the voice channel of the user.
  *
  * Funcitons:
  * !youtube + url  : play's audio from the youtube video
  * !stop           : leaves the channel
  *
  * TODO make it possible to add stuff in a que and skip vids
  *
  */
client.on('message', message => {
  if (message.content.indexOf('!youtube') === 0) {
    var youtubeURL = message.content.split(' ', 2)[1]
    youtubeURL.trim()
    message.delete(5000)
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel
        .join()
        .then(connection => {
          // Connection is an instance of VoiceConnection
          const stream = ytdl(youtubeURL, {
            filter: 'audioonly'
          })
          const dispatcher = connection.playStream(stream, streamOptions)
        })
        .catch(console.log)
    } else {
      message.reply('You need to join a voice channel first!')
    }
  } else if (message.content === '!stop') {
    message.member.voiceChannel.leave()
  }
})

/* Search In the unreal docs
*
*/
client.on('message', message => {
  if (message.content === '!tet') {
    var searchTerm = 'OnActorHit'
    findInfiles.find(searchTerm, '.', '.chm').then(function(results) {
      console.log('Tet acc')
      for (var result in results) {
        var res = results[result]
        console.log(
          'found "' +
            res.matches[0] +
            '" ' +
            res.count +
            ' times in "' +
            result +
            '"\n'
        )
        message.reply(res.lines[0])
      }
      message.delete(5000)
    })
  }
})

client.login(process.env.UNREAL_BOT_TOKEN)
