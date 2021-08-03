'use_strict'

const crypto = require('crypto')
const WebSocket = require('ws')
const curve25519 = require('curve25519-js')
const qrcode = require('qrcode-terminal')

const { headers, origin, whatswebBrowser, whatswebVersion, zapurl } = require('./constants')

const clientId = crypto.randomBytes(16).toString('base64')

const messageTag = crypto.randomBytes(16).toString('base64')
const clientID = crypto.randomBytes(16).toString('base64')
const notincognito = true
const cmd = JSON.stringify(['admin', 'init', whatswebVersion, whatswebBrowser, clientID, notincognito])
const bread = {
  init: `${messageTag},${cmd}`
}

const wsc = new WebSocket(zapurl, {
  origin,
  headers
})

const tagbag = new Map()

wsc.once('open', el => {
  console.log('open')

  // autostart
  wsc.send(bread.init)
  tagbag.set(messageTag, wason => {
    const { status, ref, ttl, update, curr, time } = JSON.parse(wason)
    tagbag.delete(messageTag)
    console.dir({ status, ref, ttl, update, curr, time })

    const seed = crypto.randomBytes(32)
    const keys = curve25519.generateKeyPair(seed)
    const publickey = Buffer.from(keys.public).toString('base64')
    const code = `${ref},${publickey},${clientId}`

    qrcode.generate(code, { small: true })
  })
})
wsc.on('close', el => {
  console.log('close')
})
wsc.on('error', el => {
  console.log('error')
})
wsc.on('message', el => {
  console.log('message')
  const tag = el.slice(0, el.indexOf(','))
  const wason = JSON.parse(el.slice(el.indexOf(',')) + 1)

  if (tagbag.has(tag)) {
    const { callback } = tagbag.get(tag)
    callback(wason)
  } else {
    console.log(`no handler ${tag}`)
  }
})

wsc.on('ping', el => {
  console.log('ping')
})
wsc.on('pong', el => {
  console.log('pong')
})
wsc.on('unexpected-response', el => {
  console.log('unexpected-response')
})
wsc.on('upgrade', el => {
  console.log('upgrade')
})
