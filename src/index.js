'use_strict'

const crypto = require('crypto')
const { nanoid } = require('nanoid')

const whatswebVersion = [2, 2126, 11]
const whatswebBrowser = ['Baileys', 'Chrome', '3.5.1']

;(async () => {
  const clientId = crypto.randomBytes(16).toString('base64')
  const messageTag = nanoid()
  const notincognito = true

  const cmd = JSON.stringify(['admin', 'init', whatswebVersion, whatswebBrowser, clientId, notincognito])
  const bread = `${messageTag},${cmd}`

  console.dir({ bread })
})()
