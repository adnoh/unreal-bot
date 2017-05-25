const dotenv = require('dotenv')
dotenv.config()
dotenv.load({ path: '../.env' })

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log('I am ready!')
})

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong')
  }
})

client.login(process.env.UNREAL_BOT_TOKEN)
