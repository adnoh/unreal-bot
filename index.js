const dotenv = require('dotenv')
dotenv.config()
dotenv.load({ path: './.env' })

const Discord = require('discord.js')
const client = new Discord.Client()

const pingPong = require('./app/ping.js')

client.on('ready', () => {
  console.log('I am ready!')
})

client.on('message', message => {
  const pong = pingPong(message.content)
  if (pong === 'pong') {
    message.reply(pong)
  }
})

client.login(process.env.UNREAL_BOT_TOKEN)
