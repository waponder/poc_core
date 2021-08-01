'use_strict'

const crypto = require('crypto')
const { nanoid } = require('nanoid')
const WebSocket = require('ws')

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

const clientId = crypto.randomBytes(16).toString('base64')
const messageTag = nanoid()
const notincognito = true

const cmd = JSON.stringify(['admin', 'init', whatswebVersion, whatswebBrowser, clientId, notincognito])
const bread = `${messageTag},${cmd}`

console.dir({ bread })

const wsc = new WebSocket(zapurl, {
  origin,
  headers
})

wsc.once('open', el => {
  console.dir({
    type: 'open',
    el
  })

  wsc.send(bread)
})
wsc.on('close', el => {
  console.dir({
    type: 'close',
    el
  })
})
wsc.on('error', el => {
  console.dir({
    type: 'error',
    el
  })
})
wsc.on('message', el => {
  console.dir({
    type: 'message',
    el
  })
})

wsc.on('ping', el => {
  console.dir({
    type: 'ping',
    el
  })
})
wsc.on('pong', el => {
  console.dir({
    type: 'pong',
    el
  })
})
wsc.on('unexpected-response', el => {
  console.dir({
    type: 'unexpected-response',
    el
  })
})
wsc.on('upgrade', el => {
  console.dir({
    type: 'upgrade',
    el
  })
})
