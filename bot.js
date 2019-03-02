const http = require('http');
const express = require('express');
const app = express();

const Enmap = require("enmap");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/scores.sqlite');

var go = "https://discord.gg/Z7hBfWQ"; //the logo
var footer = "Bandit Watcher"; //the name of bot for footer

const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
//const sql = require("sqlite");
sql.open("./scores.sqlite")
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
	
	const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
  if (!table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }
 
  // And then we have two prepared statements to get and set the score data.
  client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
  client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
});

client.on("message", message => {
  if (message.author.bot) return;
  let score;
  if (message.guild) {
    score = client.getScore.get(message.author.id, message.guild.id);
    if (!score) {
      score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 1 }
    }
    score.points++;
    const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
    if(score.level < curLevel) {
      score.level++;
      message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
    }
    client.setScore.run(score);
  }
  if (message.content.indexOf(config.prefix) !== 0) return;
 
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
 
  // Command-specific code here!
	if(command === "points") {
  return message.reply(`You currently have ${score.points} points and are level ${score.level}!`);
}

/*
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
*/
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
