const crypto = require('crypto')

const whatswebVersion = [2, 2126, 14]
const whatswebBrowser = ['Baileys', 'Chrome', '3.5.1']
const zapurl = 'wss://web.whatsapp.com/ws'
const origin = 'https://web.whatsapp.com'
const headers = {
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  Host: 'web.whatsapp.com',
  Pragma: 'no-cache',
  'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
  'Sec-WebSocket-Version': '13',
  Upgrade: 'websocket'
}

const keepAliveInterval = 20_000
const adminTestInterval = 15_000
const qrcodeTimeToLive = 20_000

const clientId = crypto.randomBytes(16).toString('base64')
const inittag = crypto.randomBytes(16).toString('base64')

const recodecmd = JSON.stringify(['admin', 'Conn', 'reref'])
const notincognito = true
const initcmd = JSON.stringify(['admin', 'init', whatswebVersion, whatswebBrowser, clientId, notincognito])

module.exports = {
  clientId,
  adminTestInterval,
  whatswebVersion,
  whatswebBrowser,
  zapurl,
  origin,
  keepAliveInterval,
  headers,
  qrcodeTimeToLive,
  recodecmd,
  initcmd,
  inittag
}
