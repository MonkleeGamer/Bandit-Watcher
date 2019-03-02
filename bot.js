const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");

const sql = require("sqlite");
sql.open("./score.sqlite")

var logo = "https://i.imgur.com/61p72Ru.png"; //the logo
const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", () => {
  console.log("Bandit Watcher has been Enabled!");
  console.log(bot.commands);
  bot.user.setActivity('In development - v1.1.9.1');
});

bot.on("message", async message => {

	  if (message.author.bot) return;
	  if (message.content.indexOf(config.prefix) !== 0) return;

	  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	  const command = args.shift().toLowerCase();


	if (message.author.bot) return; //ignore other bots
	if (message.channel.type === "dm") return; //ignores DM channels


	if(message.content.startsWith(config.prefix + "prefix")) { //checks for prefix

		//used for saving config of prefix
	  let newPrefix = message.content.split(" ").slice(1, 2)[0];
	  config.prefix = newPrefix;
	  fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);

	  // used for confirming the success of prefix change
	  message.channel.send("The prefix has been changed to ''" + config.prefix + "''")
	  }

    if (command === "info") {
  	  const embed = new Discord.RichEmbed()
  	    .setTitle("Welcome to Bandit Watcher")
  	    .setAuthor("Offical Sharp Resistance Bot!", `${logo}`)
  	    /*
  	     * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
  	     */
  	    .setColor(0xFFFF00)
  	    .setDescription("The offical discord of the Sharp Resistance Community!")
  	    .setThumbnail(`${logo}`)
  	    /*
  	     * Takes a Date object, defaults to current date.
  	     */
  	    .setTimestamp()
        .setFooter("Sharp Resistance Bot", `${logo}`)
  	    .setURL("https://discord.gg/nFmNae8")
  	    .addField("What is Sharp Resistance?",
  	      "Sharp Resistance is a Community Clan that is based on Epic Games' Fortnite, Save The World and Battle Royale! This community and clan is for people on All Platforms to come together and Play!")

  	    message.channel.send({embed});


  	  }
    });
bot.login(process.env.token);
