const express = require('express');
const app = express();
const port = 80;
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Config/config.json").toString());
const axios = require('axios');
const DiscordOAuth2 = require('discord-oauth2');
const oauth = new DiscordOAuth2();
const functions = require("../structs/functions.js")

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const authorizeUrl = `https://discord.com/oauth2/authorize?client_id=${config.discord.client_id}&redirect_uri=${encodeURIComponent(config.discord.auth_url)}&response_type=code&scope=identify`;
    res.render('index', { authorizeUrl  });
});

app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const tokenResponse = await oauth.tokenRequest({
            clientId: config.discord.client_id,
            clientSecret: config.discord.client_secret,
            code,
            scope: ['identify'], // Match the scopes used in the initial authorization request
            grantType: 'authorization_code',
            redirectUri: config.discord.auth_url,
        });

        const { access_token } = tokenResponse;

        const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const { id } = userResponse.data;

        res.render('profile', { id });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.post('/register', (req, res) => {
    const { email, username, password, discordId } = req.body;
    functions.registerUser(discordId, username, email, password).then(response => {
        if (response.status == 200)
        {
            res.render('success', { username: username});
        }
        else
        {
            res.render('error', { error: response.message });
        }
      })
});


app.listen(port, () => {
    console.log(`http://localhost:${port} Register Website`);
});


module.exports = app;
