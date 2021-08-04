# RECONNECT
```
const shouldUseReconnect =
  (this.lastDisconnectReason === DisconnectReason.close || this.lastDisconnectReason === DisconnectReason.lost)
    &&  !this.connectOptions.alwaysUseTakeover
```

- ['admin', 'login', 'clientToken', 'serverToken', 'clientID', 'reconnect', '552112341234@c.us']
- ['admin', 'login', 'clientToken', 'serverToken', 'clientID', 'takeover']
- setTimeout(sendLoginReq, 10_000)