class BaseCommand {
  constructor (command, args, target, context, message, services={}) {
    this.command = command
    this.args = args
    this.target = target
    this.context = context
    this.message = message
    Object.keys(services).forEach((v) => {
      this[v] = services[v]
    })
  }

  shouldHandle () {
    return false
  }

  handle () {}

  reply (msg) {
    if (this.context['message-type'] === 'whisper') {
      this.client.whisper(this.target, msg)
    } else {
      this.client.say(this.target, msg)
    }
  }

}

export default BaseCommand
