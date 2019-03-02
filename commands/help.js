const Discord = require("discord.js");
var logo = "https://i.imgur.com/jYAgiqH.jpg"; //the logo
var footer = "Bandit Watcher"; //the name of bot for footer

module.exports.run = async (bot, message, args) => {

		const embed = new Discord.RichEmbed()

		.setFooter(`${footer}`, `${logo}`)
		.setTimestamp()
		.setTitle("Help Page for " + `${footer}`)
		.setDescription("A page that list all commands avaliable with the Bandit Watcher Bot!")
		.addField("**:game_die: | Die Roll**", ".roll", true)
		.addField("**:clipboard: | Information**", ".info", true)
//		.addField("**:ticket: | Help Tickets**", ".ticket {message}", true)
		.addField("**:dollar: | Coin Flip**", ".flip", true)
		.addField("**:tools: | Admin Commands**", ".admin", true)
//    .addField("**:information_source: | Bot Info**", ".info", true)
		.setColor(0x9400D3);

		message.channel.send({embed});
}

module.exports.help = {
  name: "help"
} 
