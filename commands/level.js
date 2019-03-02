const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./score.sqlite");
var logo = "https://i.imgur.com/jYAgiqH.jpg"; //the logo
var footer = "Bandit Watcher"; //the name of bot for footer

module.exports.run = async (bot, message, args) => {

    		const embed = new Discord.RichEmbed()

          .setFooter(`${footer}`, `${logo}`)
    			.setColor(0x9400D3)
    			.setTimestamp();

    	      sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
    	        if (!row) return message.reply("sadly you do not have any points yet!");
    	        embed.addField(message.author.username + "'s Stats ", `You are currently level **${row.level}** and have **${row.points}** points`);

    			return message.channel.send({embed});
    	     });
}

module.exports.help = {
  name: "level"
}

