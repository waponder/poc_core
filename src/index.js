const crypto = require('crypto')
const WebSocket = require('ws')
const curve25519 = require('curve25519-js')
const HKDF = require('futoin-hkdf')
const qrcode = require('qrcode-terminal')

const { adminTestInterval, headers, origin, whatswebBrowser, whatswebVersion, keepAliveInterval, zapurl } = require('./constants')
const logger = require('./logger')

let curveKeys
let authInfo
const clientId = crypto.randomBytes(16).toString('base64')
const inittag = crypto.randomBytes(16).toString('base64')

let tagadmintest

const WSC = new WebSocket(zapurl, {
  origin,
  headers
})

WSC.on('message', el => {
  logger.log('info', 'w message')
  const mtag = el.slice(0, el.indexOf(',')).toString()
  let wason
  let wabin
  try {
    wason = JSON.parse(el.slice(el.indexOf(',') + 1))
    // // logger.log('info', wason)
  } catch {
    wabin = el.slice(el.indexOf(',') + 1)
    // // logger.log('info', wabin)
  }

  switch (mtag) {
    case inittag:
      logger.log('info', 'inittag')
      curveKeys = curve25519.generateKeyPair(crypto.randomBytes(32))
      qrcode.generate(`${wason.ref},${Buffer.from(curveKeys.public).toString('base64')},${clientId}`, { small: true })
      break
    case 's1':
      if (Array.isArray(wason) && wason.length === 2 && wason[0] === 'Conn') {
        const {
          ref,
          wid,
          connected,
          isResponse,
          serverToken,
          browserToken,
          clientToken,
          lc,
          lg,
          locales,
          is24h,
          secret,
          protoVersion,
          binVersion,
          battery,
          plugged,
          platform,
          features,
          phone,
          pushname,
          tos
        } = wason[1]

        // OPA CONN
        logger.log('info', 'OPA CONN')
        const secret64 = Buffer.from(secret, 'base64')
        const sharedKey = curve25519.sharedKey(curveKeys.private, secret64.slice(0, 32))

        const expandedKey = HKDF(sharedKey, 80, { salt: Buffer.alloc(32), info: null, hash: 'SHA-256' })

        const hmacValidationMessage = Buffer.concat([
          secret64.slice(0, 32),
          secret64.slice(64, secret64.length)
        ])
        const hmacValidationKey = expandedKey.slice(32, 64)

        const hmac = crypto.createHmac('sha256', hmacValidationKey).update(hmacValidationMessage).digest()

        if (hmac.equals(secret64.slice(32, 64))) {
          // DEU BOM
          logger.log('info', 'DEU BOM')
        }

        const encryptedAESKeys = Buffer.concat([
          expandedKey.slice(64, expandedKey.length),
          secret64.slice(64, secret64.length)
        ])

        const aes = crypto.createDecipheriv('aes-256-cbc', expandedKey.slice(0, 32), encryptedAESKeys.slice(0, 16))
        const decryptedKeys = Buffer.concat([aes.update(encryptedAESKeys.slice(16, encryptedAESKeys.length)), aes.final()])

        authInfo = {
          encKey: decryptedKeys.slice(0, 32),
          macKey: decryptedKeys.slice(32, 64),
          clientToken,
          serverToken,
          clientId
        }

        const authInfo64 = {
          ...authInfo,
          encKey: authInfo.encKey.toString('base64'),
          macKey: authInfo.macKey.toString('base64')
        }
        // AUTH INFO
        logger.log('info', authInfo64)
      }
      break
    case 's2':
    case 's3':
    case 's4':
      logger.log('info', el.toString())
      break
    default:
      logger.log('info', `<-- ${mtag}`)
  }
})

WSC.once('open', el => {
  logger.log('info', 'w open')

  // autostart
  const notincognito = true
  const cmd = JSON.stringify(['admin', 'init', whatswebVersion, whatswebBrowser, clientId, notincognito])
  const initcmd = `${inittag},${cmd}`
  logger.log('info', `--> ${initcmd}`)

  setInterval(() => {
    console.log('?,,')
    WSC.send('?,,')
  }, keepAliveInterval)

  setInterval(() => {
    tagadmintest = crypto.randomBytes(16).toString('base64')
    WSC.send(`${tagadmintest},${JSON.stringify(['admin', 'test'])}`)
    console.log(`admintest=${tagadmintest}`)
  }, adminTestInterval)

  WSC.send(initcmd)
})

WSC.on('close', el => {
  logger.log('info', 'w close')
})
WSC.on('error', el => {
  logger.log('info', 'w error')
})
WSC.on('ping', el => {
  logger.log('info', 'w ping')
})
WSC.on('pong', el => {
  logger.log('info', 'w pong')
})
WSC.on('unexpected-response', el => {
  logger.log('info', 'w unexpected-response')
})
WSC.on('upgrade', el => {
  logger.log('info', 'w upgrade')
})
