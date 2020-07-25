const { Telegraf } = require("telegraf");
const { get, details } = require("./utils");

require("dotenv").config();
const BOT_TOKEN = process.env["BOT_TOKEN"];

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Welcome! Please use one of the following commands.");
  ctx.reply("/begin : to begin your registration");
  ctx.reply("/help : to get some help with the bot usage");
  ctx.reply("/about : to know more about this bot");
});
bot.help((ctx) =>
  ctx.reply(
    "Please enter /begin to begin your registration. For more commands enter /start"
  )
);

bot.command("begin", (ctx) => {
  details.began = true;
  counter++;
  ctx.reply("What is your name?");
});

bot.on("text", (ctx) => {
  if (!details.began) {
    ctx.reply("Enter /begin command to start entering your details.");
  } else {
    switch (counter) {
      case 1:
        get.name(ctx);
        counter++;
        break;
      case 2:
        get.college(ctx);
        counter++;
        break;
      case 3:
        get.source(ctx);
        counter++;
        break;
      case 4:
        get.languages(ctx);
        break;
      case 5:
        get.frameworks(ctx);
        break;
      case 6:
        get.projects(ctx);
        counter++;
        break;
      case 7:
        get.skills(ctx);
        counter++;
        break;
      case 8:
        get.github(ctx);
        break;
      default:
        ctx.reply("Enter /begin command to start entering your details.");
    }
  }
});
bot.startPolling();
