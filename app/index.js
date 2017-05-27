const dotenv = require('dotenv')
dotenv.config()
dotenv.load({ path: '../.env' })

const Discord = require('discord.js')
const client = new Discord.Client()

// YoutubeClient.setKey(process.env.YOUTUBE_TOKEN)

const broadcast = client.createVoiceBroadcast()
const ytdl = require('ytdl-core')
const streamOptions = { seek: 0, volume: 1 }

client.on('ready', () => {
  console.log('I am ready!')
})

client.on('message', message => {
  if (message.content === '!ping') {
    /* PongBot Code
  * Use: !ping
  * Bot will reply 'pong' to the user.
  */
    message.reply('pong')
    message.delete(5000)
  } else if (message.content.indexOf('!youtube') >= 0) {
    /*  MusicBot Code
  * Use: !youtube + url
  * Play's the audio of a youtube video in the voice channel of the user.
  */
    var youtubeURL = message.content.substr(9) // TODO Look for a better and safer method to extract the url
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
          broadcast.playStream(stream)
          const dispatcher = connection.playBroadcast(broadcast)
        })
        .catch(console.log)
    } else {
      message.reply('You need to join a voice channel first!')
    }
  }
})

client.login(process.env.UNREAL_BOT_TOKEN)
