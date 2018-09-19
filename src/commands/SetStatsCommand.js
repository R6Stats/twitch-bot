import BaseCommand from '../BaseCommand'

import { resolvePlatform } from '../utilities'

class SetStatsCommand extends BaseCommand {

  shouldHandle () {
    return this.command == 'setstats'
  }

  async handle () {
    if (this.args.length < 2) return this.reply('Invalid usage: !setstats <username> <platform:xbox,ps4,pc>')


    const username = this.args[0]
    const platform = resolvePlatform(this.args[1])

    const existing = await this.db.get('SELECT * FROM channel_stats WHERE target=?', [this.target])

    try {
      var { data: players } = await this.api.playerSearch({ username, platform: platform.key })
      if (!(players && players.length && players.length >= 1)) return this.reply('No players found.')

      var player = players[0]
    } catch (e) {
      this.reply('No stats found.')
    }

    let { ubisoft_id, username: correctUsername } = player

    if (!existing) {
      await this.db.run('INSERT INTO channel_stats (target,ubisoft_id) VALUES (?,?)', [this.target, ubisoft_id])
    } else {
      await this.db.run('UPDATE channel_stats SET ubisoft_id=? WHERE id=?', [ubisoft_id, existing.id])
    }

    this.reply(`Set R6Stats player for channel to ${ correctUsername } on ${ platform.value }. (${ ubisoft_id })`)

  }
}

export default SetStatsCommand
