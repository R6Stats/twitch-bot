const PLATFORMS = [
  { key: 'xbox', value: 'Xbox One', aliases: ['xbl', 'xone', 'live'] },
  { key: 'ps4', value: 'PS4', aliases: ['ps', 'psn'] },
  { key: 'pc', value: 'PC', aliases: ['uplay', 'steam'] }
]

const resolvePlatform = function(platform) {
  return PLATFORMS.find(p => (p.key === platform) || (p.aliases.some(a => a === platform)))
}

export { resolvePlatform }
