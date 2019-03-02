const Discord = require("discord.js");
var logo = "https://i.imgur.com/jYAgiqH.jpg"; //the logo
var footer = "Bandit Watcher"; //the name of bot for footer

module.exports.run = async (bot, message, args) => {
  
  if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("You do not have permission to use that command");
  let RoleMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!RoleMember) return message.reply("Can't find that user");
  let role = args.join(" ").slice(22);
  if(!role) return message.reply("Please name a role!");
  let grole = message.guild.roles.find(`name`, role);
  if(!grole) return message.reply("Can't find that role! Make sure you typed the role in correctly; Case sensitive");
  
  if(RoleMember.roles.has(grole.id)) return message.reply("Thay already have that role!");
  await(RoleMember.addRole(grole.id));
  
  try{
    message.channel.send(`${RoleMember}'s role has been set to the **"${grole.name}"**!`)
    //await RoleMember.send(`Your role has been set to the **${grole.name}** in the Sharp Resistance Discord!`)
  }catch(e){
    message.channel.send(`${RoleMember} role has been set to the **${grole.name}**!`)
  }
}

module.exports.help = {
  name: "addrole"
}

