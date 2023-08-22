# LawinServerV2 Modified
###  Origin by Lawin (https://github.com/Lawin0129/LawinServerV2)

## 📂 New Features

[+] Account check API
[+] Status Bot

## 📄 DOCS

#### Account Check api usage

- Located: routes/api.js | Line 6
- URL: IP:PORT/api/accountcheck
- Parameters: IP:PORT/apo/accountcheck?email=EMAIL&password=PASSWORD

| CODE | STATUS                                           |
|------|--------------------------------------------------|
| 200  | Valid Login                                      |
| 401  | Password invalid (E-Mail is on the Database)     |
| 404  | E-Mail not found (E-Mail is not on the Database) |


#### Status Bot
Make sure to insert the Channel ID at config.json where you want the status message
The Status Bot is build to send the embed to a channel that is completly empty and the only messages should be the message from the Bot


more soon