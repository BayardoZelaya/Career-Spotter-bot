const { readdirSync } = require('fs');
const { sep } = require('path');
const { success, error, warning } = require('log-symbols');
const config = require('./config.json');
require('dotenv').config();
const Client = require('./client/Client');

const bot = new Client(config);

const loadCommands = (dir = './commands') => {
  readdirSync(dir).forEach((dirs) => {
    const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter((files) =>
      files.endsWith('.js')
    );

    for (const file of commands) {
      const pull = require(`${dir}/${dirs}/${file}`);

      if (
        pull.help &&
        typeof pull.help.name === 'string' &&
        typeof pull.help.category === 'string'
      ) {
        if (bot.commands.get(pull.help.name)) {
          return console.warn(
            `${warning} Two or more commands have the same name ${pull.help.name}`
          );
        }
        bot.commands.set(pull.help.name, pull);

        console.log(`${success} Loaded command ${pull.help.name} from ${dir}${sep}${dirs}`);
      } else {
        console.error(
          `${error} Error loading command in ${dir}${sep}${dirs}. You either have a missing help.name or help.name is not a string, or you have a missing help.category or help.category is not a string`
        );
        continue;
      }

      if (pull.help.aliases && typeof pull.help.aliases === 'object') {
        pull.help.aliases.forEach((alias) => {
          if (bot.aliases.get(alias)) {
            return console.warn(`${warning} Two or more commands have the same alias ${alias}`);
          }
          bot.aliases.set(alias, pull.help.name);
        });
      }
    }
  });
};

bot.once('ready', () => {
  loadCommands();
  bot.user
    .setActivity({ name: `${bot.config.prefix}help`, type: 'PLAYING' })
    .catch((err) => console.error(err));
  console.log(`${success} Career Spotter bot is ready`);
});

bot.once('reconnecting', () => {
  console.log(`${success} Career Spotter bot reconnecting`);
});

bot.once('disconnect', () => {
  console.log(`${error} Career Spotter bot disconnecting`);
});

bot.on('message', async (message) => {
  const prefix = bot.config.prefix;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  if (cmd.length === 0) return;

  let command;

  if (bot.commands.has(cmd)) command = bot.commands.get(cmd);
  else if (bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd));

  if (command) command.execute(bot, message, args);
});

bot.login(process.env.TOKEN).catch((err) => console.error(err));
