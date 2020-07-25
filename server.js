const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();

const { bot } = require("./bot");
bot.startPolling();

app.get("/", (req, res) => {
  res.send(
    "Please visit this <a href='https://t.me/side_projects_bot'>link</a> to use the bot"
  );
});

app.listen(PORT);
