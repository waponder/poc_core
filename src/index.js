'use_strict'

const crypto = require('crypto')
const WebSocket = require('ws')
const curve25519 = require('curve25519-js')
const qrcode = require('qrcode-terminal')

const { adminTestInterval, headers, origin, whatswebBrowser, whatswebVersion, keepAliveInterval, zapurl } = require('./constants')
const logger = require('./logger')

const clientId = crypto.randomBytes(16).toString('base64')

const inittag = crypto.randomBytes(16).toString('base64')
const clientID = crypto.randomBytes(16).toString('base64')
const notincognito = true
const cmd = JSON.stringify(['admin', 'init', whatswebVersion, whatswebBrowser, clientID, notincognito])
const bread = {
  init: `${inittag},${cmd}`,
  keepalive: '?,,',
  admintest: () => `${crypto.randomBytes(16).toString('base64')},${JSON.stringify(['admin', 'test'])}`
}

const wsc = new WebSocket(zapurl, {
  origin,
  headers
})

logger.log('info', `inittag=${inittag}`)
const tagbag = new Map()

wsc.once('open', el => {
  logger.log('info', 'open')

  // keepAlive
  setInterval(async () => {
    wsc.send(bread.keepalive)
  }, keepAliveInterval)
  // admintest
  setTimeout(() => {
    setInterval(() => {
      wsc.send(bread.admintest())
    }, adminTestInterval)
  }, 10_000)

  // autostart
  tagbag.set(inittag, ({
    handler: ({ wason: { status, ref, ttl, update, curr, time } }) => {
      tagbag.delete(inittag)

      const seed = crypto.randomBytes(32)
      const keys = curve25519.generateKeyPair(seed)
      const publickey = Buffer.from(keys.public).toString('base64')
      const code = `${ref},${publickey},${clientId}`

      qrcode.generate(code, { small: true })
    }
  }))
  wsc.send(bread.init)
})

wsc.on('message', el => {
  logger.log('info', 'message')
  const tag = el.slice(0, el.indexOf(',')).toString()
  let wason
  let wabin
  try {
    wason = JSON.parse(el.slice(el.indexOf(',') + 1))
    logger.log('info', wason)
  } catch {
    wabin = el.slice(el.indexOf(',') + 1)
    // logger.log('info', wabin)
  }

  if (tagbag.has(tag)) {
    const { handler } = tagbag.get(tag)
    handler({ wason, wabin })
  } else {
    logger.log('info', `no tagbag for ${tag}`)
  }
})

wsc.on('close', el => {
  logger.log('info', 'close')
})
wsc.on('error', el => {
  logger.log('info', 'error')
})
wsc.on('ping', el => {
  logger.log('info', 'ping')
})
wsc.on('pong', el => {
  logger.log('info', 'pong')
})
wsc.on('unexpected-response', el => {
  logger.log('info', 'unexpected-response')
})
wsc.on('upgrade', el => {
  logger.log('info', 'upgrade')
})
