const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user.js");

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


module.exports = app;
