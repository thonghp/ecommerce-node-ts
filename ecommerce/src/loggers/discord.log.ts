import { Client, GatewayIntentBits, type MessageCreateOptions } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const { CHANNELID_DISCORD, TOKEN_DISCORD } = process.env

type LogDataType = {
  code: string
  message: string
  title: string
}

class LoggerService {
  client: Client
  channelId: string
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })
    // add channel id
    this.channelId = CHANNELID_DISCORD
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user?.tag}!`)
    })
    this.client.login(TOKEN_DISCORD)
  }

  sendToFormatCode(logData: LogDataType) {
    const { code, message = 'this is some additional information about code', title = 'code example' } = logData
    const codeMessage: MessageCreateOptions = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16), // convert hexadecimal color code to integer
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
        }
      ]
    }
    this.sendToMessage(codeMessage)
  }

  sendToMessage(message: string | MessageCreateOptions = 'message') {
    const channel = this.client.channels.cache.get(this.channelId)
    if (!channel || !channel.isTextBased()) {
      console.error('Channel not found...', this.channelId)

      return
    }

    channel.send(message).catch((e: Error) => {
      console.error(e)
    })
  }
}

export default new LoggerService()
