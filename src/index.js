const tmi = require('tmi.js')
const fs = require('fs')
const path = require('path')
const config = require('../config')

import sqlite from 'sqlite'
import R6StatsAPI from 'r6stats'

let db

const api = new R6StatsAPI({
  loginId: config.r6stats.login,
  password: config.r6stats.password,
  userAgent: config.r6stats.user_agent,
  baseUrl: config.r6stats.base_url
})

const commandPrefix = '!'
const opts = {
  identity: {
    username: config.twitch.username,
    password: config.twitch.password
  },
  channels: config.twitch.initial_channels
}

const client = new tmi.client(opts)

const commands = []

async function setupDatabase () {
  db = await sqlite.open('store.sqlite', { Promise })
  await db.run('CREATE TABLE IF NOT EXISTS channel_stats (id INTEGER PRIMARY KEY, target TEXT, ubisoft_id TEXT);')
  console.info('Database setup!')
}

async function loadCommands () {
  const files = fs.readdirSync(path.join(__dirname, 'commands'))

  for (let file of files) {
    const { default: clazz } = await require(path.join(__dirname, 'commands', file))
    console.log(`Registering command ${ clazz.name }...`)
    commands.push(clazz)
  }

  console.log(`${ commands.length } command${ commands.length === 1 ? '': 's' } registered.`)
}

setupDatabase()
loadCommands()

client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)

client.connect()

function onMessageHandler (target, context, msg, self) {
  if (self) return

  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
    return
  }

  const parse = msg.slice(1).split(' ')
  const command = parse[0]
  const args = parse.splice(1)

  for (let cmd of commands) {
    let cmdInstance = new cmd(command, args, target, context, msg, { api, client, db })
    if (cmdInstance.shouldHandle()) {
      console.log(`Invoking command ${ command } with args ${args.join(',')}`)
      cmdInstance.handle()
      break
    }
  }
}

function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
}

function onDisconnectedHandler (reason) {
  console.log(`Disconnected: ${reason}`)
  db.close()
  process.exit(1)
}


