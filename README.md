# unreal-bot
A general purpose Discord bot (WIP).

## Usage
1. `git clone https://github.com/rangelke/unreal-bot.git`
2. `cd unreal-bot`
3. `npm install`
4. `touch .env`
5. Add the tokens for the API in the .env file
```
UNREAL_BOT_TOKEN="TokenDiscord"
YOUTUBE_API_KEY="TokenYoutube"
```
6. `npm start`

## Command list
1. General
  - **!join**: joins the bot in users the channel
  - **!leave**: leaves channel
  - **!clean**: channel will be cleared from messages
2. Games
  - **!ping**: replies pong
3. Media
  - **!youtube search term**: Plays the audio of the first matching result 
  - **!youtube url**: Plays the audio from the url
