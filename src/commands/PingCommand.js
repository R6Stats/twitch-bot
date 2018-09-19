import BaseCommand from '../BaseCommand'

class PingCommand extends BaseCommand {

  shouldHandle () {
    return this.command == 'ping'
  }

  handle () {
    this.reply('Pong!')
  }
}

export default PingCommand
