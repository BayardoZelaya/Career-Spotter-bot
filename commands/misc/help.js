const { MessageEmbed } = require("discord.js");

module.exports.help = {
  name: "help",
  aliases: ["h"],
  description: "List all available commands",
  usage: "help",
  category: "misc",
};

module.exports.execute = (bot, message) => {
  let str = "";

  bot.commands.forEach((command) => {
    if (command.help.aliases.length !== 0) {
      str += `**${bot.config.prefix}${command.help.usage}\nAliases: ${bot.config.prefix}${command.help.aliases}**\n${command.help.description}\n\n`;
    } else str += `**${bot.config.prefix}${command.help.usage}**\n${command.help.description}\n\n`;

    let embed = new MessageEmbed().setTitle("Commands").setDescription(str);

    return message.channel.send(embed).catch((error) => console.error(error));
  });
};
