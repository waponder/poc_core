# @waponder/core

## WS
```
npm install -S ws
npm install --save-optional bufferutil
npm install --save-optional utf-8-validate
```

## Auth
- clientID string
- serverToken string
- clientToken string
- encKey buffer
- macKey buffer
- curveKeys.private bytes
- curveKeys.public bytes

## weep alive
- phoneResponseTime 15_000
- this.sendJSON (['admin', 'test'])
  this.send(`${tag},${JSON.stringify(json)}`)
    this.conn.send(m)