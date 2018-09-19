# R6Stats Twitch Bot

Developed for R6Stats, this Twitch bot uses [tmi.js](https://github.com/tmijs/tmi.js) to interact with the Twitch Chat API and provide streamers a way for their users to view and share Rainbow Six: Siege stats right in Twitch chat.

Stats are provided by [R6Stats.com](https://r6stats.com)

## Usage

The bot currently supports a limited amount of commands. Parameters in {...} are required and those in [...] are optional.

* !ping - pings the bot to ensure it is online and responding to messages
* !setstats {username} {platform} - set the player that whose stats will be displayed when `!stats` is called with no arguments
* !stats - called with no arguments, the `!stats` command displays the stats for the player set with `!setstats`
* !stats {username} {platform} - displays the stats for a player on the specified platform

### Examples

```bash
!setstats AjjeSaeb pc # set the channel's stats to this player
!stats # displays the stats for AjjeSaeb on PC, as set above
!stats Zamhomie pc # displays the stats for Zamhomie on PC
```

## Installing

Clone the repository, copy `config.example.js` to `config.js` and modify as necessary. Then run:

```bash
yarn # or npm install
npm run dev
```
