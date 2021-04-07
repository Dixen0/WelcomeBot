const config = require("./config.js");
const { prefix } = require('./config.js')
const Discord = require("discord.js"), Client = new Discord.Client({ restTimeOffset: 10 }), CoolDowns = new Discord.Collection(), Fs = require("fs"), Ms = require("pretty-ms")
Client.commands = new Discord.Collection(), Client.aliases = new Discord.Collection(), Client.queue = new Map()
const db = require('quick.db')

const Categories = ["Welcome"];

Categories.forEach((Category) => {
   Fs.readdir(`./Commands/${Category}`, (error, Files) => {
      if (error) throw error;
      Files.forEach((File) => {
         if (!File.endsWith(".js")) return;
         const Cmd = require(`./Commands/${Category}/${File}`);
         if (!Cmd.help.name || !Cmd.help.aliases) return console.log(`${Cmd.help.name ? Cmd.help.name : "?"} Failed To Load - ❌`);
         Client.commands.set(Cmd.help.name, Cmd);
         Cmd.help.aliases ? Cmd.help.aliases.forEach(Alias => Client.aliases.set(Alias, Cmd.help.name)) : Cmd.help.aliases = null;
         console.log(`${Cmd.help.name} Has Been Loaded - ✅`)
      });
   });
});



Client.on("ready", async () => {
   console.clear();
   console.log(`Bot Is Ready To Play Music - ${Client.user.username}\nBot ID ${Client.user.id}`);
   Client.user.setActivity(`${prefix}setwelcome`, { type: "PLAYING" });
});




Client.on("error", (error) => {
   console.log(error);
});


Client.on("message", async (message) => {
   if (message.author.bot || !message.guild || message.webhookID) return;


   if (!message.content.startsWith(prefix)) return;
  

   let Arguments = await message.content.slice(prefix.length).split(/ +/g), Command = await Arguments.shift().toLowerCase();

   Command = await Client.commands.get(Command) || await Client.commands.get(Client.aliases.get(Command));

   if (!Arguments || !Command) return;

   try {
      if (!CoolDowns.has(Command.help.name)) await CoolDowns.set(Command.help.name, new Discord.Collection());
      const Timestamps = CoolDowns.get(Command.help.name), CoolDown = parseInt(Command.help.cooldown || 1000), Now = Date.now();
      if (Timestamps.has(message.author.id)) {
        const ExpireTime = Timestamps.get(message.author.id) + CoolDown;
        if (Now < ExpireTime) {
          return message.channel.send(`**Pleas wait (10)s**`).then(msg => msg.delete({
             timeout: 5000
          }))
   }
      };
     Timestamps.set(message.author.id, Now);
     Client.Prefix = prefix;
     await Command.run(Client, message, Arguments, Discord);
     await setTimeout(() => Timestamps.delete(message.author.id), CoolDown);
   } catch (error) {
     return message.channel.send("Something Went Wrong, Try Again Later").then(() => console.log(error));
   };
});


Client.on('guildMemberAdd', async (member) => {

   if (!member.guild.member(Client.user).hasPermission("ADMINISTRATOR")) return;
   
   let welcome = await db.get(`welcome_${member.guild.id}`)
   
   if(!welcome) return
   var channel = member.guild.channels.cache.get(welcome);
   if (!channel) return;
   
   const embed = new Discord.MessageEmbed()
   .setAuthor(member.user.tag, member.user.avatarURL({dynamic: true}))
   .setDescription(`Welcome ${member} to server ${member.guild.name}`)
   .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
   .setColor(Color)
   channel.send(embed)
   })
 

Client.login(config.Token).catch(() => console.log(new Error("Invalid Discord Bot Token Provided!")));
