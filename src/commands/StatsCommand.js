import BaseCommand from '../BaseCommand'

import { resolvePlatform } from '../utilities'

class StatsCommand extends BaseCommand {

  shouldHandle () {
    return this.command == 'stats'
  }

  async handle () {
    let uuid, username
    if (this.args.length === 0) {
      const existing = await this.db.get('SELECT * FROM channel_stats WHERE target=?', [this.target])

      uuid = existing.ubisoft_id
      this.reply(`View my Rainbow Six Stats here: https://r6stats.com/stats/${uuid}`)
    } else if (this.args.length < 2) {
      return this.reply('Invalid usage: !stats <username> <platform:xbox,ps4,pc>')
    }

    if (!uuid) {
      const rawUsername = this.args[0]
      var platform = resolvePlatform(this.args[1])

      try {
        var { data: players } = await this.api.playerSearch({ username: rawUsername, platform: platform.key })
        if (!(players && players.length && players.length >= 1)) return this.reply('Player not found.')

        var player = players[0]

        uuid = player.ubisoft_id
        username = player.username
        this.reply(`View Rainbow Six Stats for ${username} on ${platform.value}: https://r6stats.com/stats/${uuid}`)
      } catch (e) {
        return this.reply('Player not found.')
      }
    }

    // console.log('here')

    // try {
    //   var { data: generalStats } = await this.api.playerStats({ uuid })
    //   var { data: seasonalStats } = await this.api.seasonalStats({ uuid })
    //   if (!(generalStats && seasonalStats)) return this.reply('Stats not found a.')

    // } catch (e) {
    //   console.error(e)
    //   return this.reply('Stats not found.')
    // }

    // const stats = generalStats.stats[0]

    // let { kd, wl } = stats.queue.ranked


    // this.reply(`Ranked Stats: \n K/D: ${kd} \n W/L: ${wl}`)

  }
}

export default StatsCommand
