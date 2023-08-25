const User = require("../../model/user.js");
const functions = require("../../structs/functions.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Config/config.json").toString());

module.exports = {
    commandInfo: {
        name: "makeshop",
        description: "Rotates Shop manually",
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        
        if (!config.moderators.includes(interaction.user.id)) return interaction.editReply({ content: "You do not have moderator permissions.", ephemeral: true });
    

        functions.makeShop();

        interaction.editReply({ content: `Changes the Shop`, ephemeral: true });
    }
}