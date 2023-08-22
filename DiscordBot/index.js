const { Client, Intents, MessageEmbed } = require("discord.js"); // Discord.js v12 or v14 but WHY v13
const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Config/config.json").toString());
const log = require("../structs/log.js");

let staticMessage = null;

const sendStaticMessage = async () => {

    const channel = await client.channels.fetch(config.discord.status_channel_Id);
    if (!staticMessage) {
        const messages = await channel.messages.fetch({ limit: 1 });
        channel.bulkDelete(messages);
      const embed = new MessageEmbed()
      .setTitle('SERVER STATUS')
      .setDescription("Current Players")
      .setColor('#ffffff') 
      .addFields([
          {
              name: "Players Online",
              value: "Player: " + global.Clients.length,
              inline: true
          },
          {
            name: 'Backend Status',
            value: "ONLINE", // No shit
            inline: false
        },
      ])
          .setFooter({
          text: "LawinV2",
          iconURL: "https://cdn-icons-png.flaticon.com/512/4785/4785997.png",
      })
          .setTimestamp();
        
      staticMessage = await channel.send({ embeds: [embed] });
    } else {
      const embed = new MessageEmbed()
      .setTitle('SERVER STATUS')
      .setDescription("Current Players")
      .setColor('#ffffff') 
      .addFields([
          {
              name: "Players Online",
              value:"Player:" + global.Clients.length,
              inline: true
          },
          {
            name: 'Backend Status',
            value: "ONLINE",
            inline: false
        },
      ])
          .setFooter({
          text: "LawinV2",
          iconURL: "https://cdn-icons-png.flaticon.com/512/4785/4785997.png",
      })
          .setTimestamp();
      staticMessage = await staticMessage.edit({ embeds: [embed] });
    }
  };

client.once("ready", () => {
    log.bot("Bot is up and running!");

    let commands = client.application.commands;

    fs.readdirSync("./DiscordBot/commands").forEach(fileName => {
        const command = require(`./commands/${fileName}`);

        commands.create(command.commandInfo);
    });
    sendStaticMessage();
    // Updates every, uh idk. My math teacher hates me anyways.
    setInterval(sendStaticMessage, 1 * 10 * 1000);
});




client.on("interactionCreate", interaction => {
    if (!interaction.isApplicationCommand()) return;

    if (fs.existsSync(`./DiscordBot/commands/${interaction.commandName}.js`)) {
        require(`./commands/${interaction.commandName}.js`).execute(interaction);
    }
});

client.login(config.discord.bot_token);