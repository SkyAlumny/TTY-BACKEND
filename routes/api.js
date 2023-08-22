const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user.js");
const functions = require("../structs/functions.js")
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Config/config.json").toString());


app.get("/api", async (req, res) =>{
    const currentDate = new Date();
   res.json({ currentDate: currentDate.toISOString(), status: "online" });
   return res.status(200)
})

app.get("/api/accountcheck", async (req, res) => {
    const { email, password } = req.query;
    if (!email)
        return res.status(400).send('Please insert a E-Mail');
    if (!password)
        return res.status(400).send('Please insert a password');

        try {
            const user = await User.findOne({ email: email });
            if (user) {
              if (await bcrypt.compare(password, user.password))
              {
               return res.status(200).send(`Login informations are correct!`);
              }
              else
              {
                return res.status(401).send('Password invalid');
              }
            }
            else {
                return res.status(404).send('E-Mail not registered');
            }
        }
        catch (err) {
            console.error('Error: ', err);
            return res.status(500).send('Complete error.');
        }
    
  
});

app.post("/api/register", async (req, res) => {
    const { apikey, discordid, username, email, password } = req.query;
    if (!apikey)
    {
        res.json({ code: "400", error: "APIKEY no provided" });
        return res.status(400)
    }
    if (!discordid)
    {
        res.json({ code: "400", error: "Discord ID not provided" });
        return res.status(400)
    }
    if (!username)
    {
        res.json({ code: "400", error: "Username not provided" });
        return res.status(400)
    }
    if (!email)
    {
        res.json({ code: "400", error: "E-Mail not provided" });
        return res.status(400)
    }
    if (!password)
    {
        res.json({ code: "400", error: "Pasword not provided" });
        return res.status(400)
    }
    
   
    if (apikey == config.APIKEY) {
        try {
            await functions.registerUser(discordid, username, email, password).then(response => {
              if (!response.status == 400)
              {
                res.json({ code: "200", error: "SUCCESS" });
                return res.status(200)
              }

              res.json({ code: response.status, error: response.message });
              return res.status(response.status)
            })
         
        }
        catch (err) {
            res.json({ code: "500", error: err });
            return res.status(500)
        }
    }
    else {
        res.json({ code: "401", error: "Invalid API key" });
        return res.status(401)
    }
});

module.exports = app;
