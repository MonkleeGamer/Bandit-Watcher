const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var logo = "https://discord.gg/Z7hBfWQ"; //the logo
var footer = "Bandit Watcher"; //the name of bot for footer

const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const sql = require("sqlite");
sql.open("./score.sqlite")
const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Could not find commands!");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    client.commands.set(props.help.name, props);
  });
});


client.on("ready", () => {
  console.log("Bandit Watcher has been enabled!");
  console.log(client.commands);
  client.user.setActivity('Development 1.1.9.1 BETA');

});

client.on("message", async message => {

	  if (message.author.bot) return;
  	if (message.channel.type === "dm") return; //ignores DM channels
    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];

   // if (message.content.indexOf(config.prefix) !== 0) return;

    // This is the best way to define args. Trust me.
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!message.content.startsWith(config.prefix));

    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(client,message,args);

    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) {
        sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
      } else {
        let curLevel = Math.floor(0.35 * Math.sqrt(row.points + 1));
        if (curLevel > row.level) {
          row.level = curLevel;
          sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
          message.reply(`You've leveled up to level **${curLevel}**!`);
        }
        sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
      }
    }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
        sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
      });
    });

	if(message.content.startsWith(config.prefix + "prefix")) { //checks for prefix

		//used for saving config of prefix
	  let newPrefix = message.content.split(" ").slice(1, 2)[0];
	  config.prefix = newPrefix;
	  fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);

	  // used for confirming the success of prefix change
	  console.log("The prefix has been changed to '" + config.prefix + "'");
	  message.channel.send("The prefix has been changed to ''" + config.prefix + "''")

	  //checks for perms of owner
	  if(message.author.id !== config.ownerID) return;
	  }

});

client.login(process.env.TOKEN);
