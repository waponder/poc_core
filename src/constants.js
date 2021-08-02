const whatswebVersion = [2, 2126, 11]
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

module.exports = {
  whatswebVersion,
  whatswebBrowser,
  zapurl,
  origin,
  headers
}
