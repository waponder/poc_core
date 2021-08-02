'use_strict'

const crypto = require('crypto')
const { nanoid } = require('nanoid')
const WebSocket = require('ws')
const curve25519 = require('curve25519-js')
const qrcode = require('qrcode-terminal')

const { headers, origin, whatswebBrowser, whatswebVersion, zapurl } = require('./constants')

const clientID = crypto.randomBytes(16).toString('base64')
const messageTag = nanoid()
const notincognito = true
const cmd = JSON.stringify(['admin', 'init', whatswebVersion, whatswebBrowser, clientID, notincognito])
const bread = {
  init: `${messageTag},${cmd}`
}

const wsc = new WebSocket(zapurl, {
  origin,
  headers
})

wsc.once('open', el => {
  console.log('open')

  // autostart
  wsc.send(bread.init)
})
wsc.on('close', el => {
  console.log('close')
})
wsc.on('error', el => {
  console.log('error')
})
wsc.on('message', el => {
  console.log(`message ${el}`)
  const tagback = el.toString().slice(0, messageTag.length)
  const bodyback = el.toString().slice(messageTag.length + 1)
  if (tagback === messageTag) {
    const { status, ref, ttl, update, curr, time } = JSON.parse(bodyback)
    console.dir({ status, ref, ttl, update, curr, time })

    const seed = crypto.randomBytes(32)
    const curveKeys = curve25519.generateKeyPair(seed)
    const publicKey = Buffer.from(curveKeys.public).toString('base64')
    const privateKey = Buffer.from(curveKeys.private).toString('base64')
    console.dir({ publicKey, privateKey })

    const code = [ref, publicKey, clientID].join(',')
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

// https://github.com/sigalor/whatsapp-web-multi-device-reveng/blob/main/pocs/poc01_generate_qr.md#:~:text=%5B%22Cmd%22%2C%7B%22type%22%3A%22upgrade_md_prod%22%2C%22version%22%3A%222.2126.11%22%7D%5D
// ["Cmd",{"type":"upgrade_md_prod","version":"2.2126.11"}]