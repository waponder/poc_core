- [x]  once('open')
    - [x] KEEP_ALIVE_INTERVAL_MS this.send('?,,')
    - [x] connectOptions.phoneResponseTime this.sendJSON (['admin', 'test'])
- [x] gerar chaves
- [ ] restaurar sessao
- [ ] novo qrcode `json: ['admin', 'Conn', 'reref']`

# CHAVES
```
const secret = Buffer.from(json.secret, 'base64')

// generate shared key from our private key & the secret shared by the server
const sharedKey = Curve.sharedKey(this.curveKeys.private, secret.slice(0, 32))
// expand the key to 80 bytes using HKDF
const expandedKey = Utils.hkdf(sharedKey as Buffer, 80)

// perform HMAC validation.
const hmacValidationKey = expandedKey.slice(32, 64)
const hmacValidationMessage = Buffer.concat([secret.slice(0, 32), secret.slice(64, secret.length)])

const hmac = Utils.hmacSign(hmacValidationMessage, hmacValidationKey)

const encryptedAESKeys = Buffer.concat([
    expandedKey.slice(64, expandedKey.length),
    secret.slice(64, secret.length),
])
const decryptedKeys = Utils.aesDecrypt(encryptedAESKeys, expandedKey.slice(0, 32))
// set the credentials