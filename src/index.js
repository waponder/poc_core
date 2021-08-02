'use_strict'

const crypto = require('crypto')
const { nanoid } = require('nanoid')
const WebSocket = require('ws')
const { generateKeyPair } = require('curve25519-js')
const qrcode = require('qrcode-terminal')

const { headers, origin, whatswebBrowser, whatswebVersion, zapurl } = require('./constants')

const clientId = crypto.randomBytes(16).toString('base64')
const messageTag = nanoid()
const notincognito = true
const cmd = JSON.stringify(['admin', 'init', whatswebVersion, whatswebBrowser, clientId, notincognito])
const bread = {
  init: `${messageTag},${cmd}`
}

const wsc = new WebSocket(zapurl, {
  origin,
  headers
})

wsc.once('open', el => {
  console.log('open')

  wsc.send(bread.init)
})
wsc.on('close', el => {
  console.log('close')
})
wsc.on('error', el => {
  console.log('error')
})
wsc.on('message', el => {
  console.log('message')
  const tagback = el.toString().slice(0, messageTag.length)
  const bodyback = el.toString().slice(messageTag.length + 1)
  if (tagback === messageTag) {
    const { status, ref, ttl, update, curr, time } = JSON.parse(bodyback)
    console.dir({ status, ref, ttl, update, curr, time })
    const seed = crypto.randomBytes(32)
    const key = generateKeyPair(seed)
    const publickey = Buffer.from(key.public).toString('base64')
    const code = `${ref},${publickey},${clientId}`
    qrcode.generate(code, { small: true })
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
