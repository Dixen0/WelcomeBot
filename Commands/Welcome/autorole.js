const Discord = require('discord.js')
const { prefix } = require('../../config.js')
const db = require('quick.db')
module.exports.run = async (client, message, args) => {


if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`You don't have permission to do this command`)

let channel = message.mentions.channels.first()

if(!channel) return message.channel.send(`i ca'nt find this room`)

await db.set(`welcome_${message.guild.id}`, channel.id)

return message.channel.send(`The welcome channel was set successfully.`)


    




};

module.exports.help = {
    name: "setwelcome",
    aliases: [],
    cooldown: 1,
    category: "Welcome",
    description: "Setwelcome",
    usage: "setwelcome #channel",
    examples: ["setwelcome #general"]
};