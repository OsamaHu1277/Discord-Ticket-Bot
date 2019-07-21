const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "!!";



client.on('ready', () => {
   console.log(`----------------`);
      console.log(`OSMX BOT- Script By : OSMX`);
        console.log(`----------------`);
      console.log(`ON ${client.guilds.size} Servers '     Script By : OSMX ' `);
    console.log(`----------------`);
  console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("SCM Videos",{type: 'WATCHING'})
client.user.setStatus("online")
});


//منشن البوت
client.on('message', message => {
  if(message.content.startsWith(`<@${client.user.id}>`)) {
    if(message.author.bot || message.channel.type == "dm") return
    let mention = new Discord.RichEmbed()
    .setColor('BLUE')
    .setDescription(`**Hey There \nThis Bot Commands Only For Admins \nScripted By : OSMX**`)
    message.channel.send(mention)
  }
});
client.on("message", async message => {
    var command = message.content.split(" ")[0];
    command = command.slice(prefix.length);
        if(!message.channel.guild) return;
            var args = message.content.split(" ").slice(1).join(" ");
            if(command == "bc") {
                if(!message.member.hasPermission("ADMINISTRATOR")) {
                    return message.channel.send("**للأسف لا تمتلك صلاحية `ADMINISTRATOR`**");
                }
                    if(!args) {
                        return message.reply("**يجب عليك كتابة كلمة او جملة لإرسال البرودكاست**");
                    }
                        message.channel.send(`**هل أنت متأكد من إرسالك البرودكاست؟\nمحتوى البرودكاست: \`${args}\`**`).then(m => {
                            m.react("✅")
                            .then(() => m.react("❌"));

                            let yesFilter = (reaction, user) => reaction.emoji.name == "✅" && user.id == message.author.id;
                            let noFiler = (reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id;

                            let yes = m.createReactionCollector(yesFilter);
                            let no = m.createReactionCollector(noFiler);

                            yes.on("collect", v => {
                                m.delete();
                                    message.channel.send(`:ballot_box_with_check: | Done ... The Broadcast Message Has Been Sent For ${message.guild.memberCount} Members`).then(msg => msg.delete(5000));
                                        message.guild.members.forEach(member => {
                                            let bc = new Discord.RichEmbed()
                                            .setColor("RANDOM")
                                            .setThumbnail(message.author.avatarURL)
                                            .addField("Message", args);
                                            

                                            member.sendEmbed(bc);
                                        });
                        });
                        no.on("collect", v => {
                            m.delete();
                            message.channel.send("**Broadcast Canceled.**").then(msg => msg.delete(3000));
                        });
                            
                        });
            }
            if(command == "bco") {
                if(!message.member.hasPermission("ADMINISTRATOR")) {
                    return message.channel.send("**للأسف لا تمتلك صلاحية `ADMINISTRATOR`**");
                }
                    if(!args) {
                        return message.reply("**يجب عليك كتابة كلمة او جملة لإرسال البرودكاست**");
                    }
                        message.channel.send(`**هل أنت متأكد من إرسالك البرودكاست؟\nمحتوى البرودكاست: \`${args}\`**`).then(m => {
                            m.react("✅")
                            .then(() => m.react("❌"));

                            let yesFilter = (reaction, user) => reaction.emoji.name == "✅" && user.id == message.author.id;
                            let noFiler = (reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id;

                            let yes = m.createReactionCollector(yesFilter);
                            let no = m.createReactionCollector(noFiler);

                            yes.on("collect", v => {
                                m.delete();
                                    message.channel.send(`:ballot_box_with_check: | Done ... The Broadcast Message Has Been Sent For ${message.guild.members.filter(r => r.presence.status !== "offline").size} Members`).then(msg => msg.delete(5000));
                                        message.guild.members.filter(r => r.presence.status !== "offline").forEach(member => {
                                            let bco = new Discord.RichEmbed()
                                            .setColor("RANDOM")
                                            .setThumbnail(message.author.avatarURL)
                                            .addField("Message", args);

                                            member.sendEmbed(bco);
                                        });
                        });
                        no.on("collect", v => {
                            m.delete();
                            message.channel.send("**Broadcast Canceled.**").then(msg => msg.delete(3000));
                        });
                            
                        });
            }
});
//ارسال رساله لروم معين
client.on('message',async message => { 
    var room;
    var chat;
    var duration;
    var gMembers;
    var filter = m => m.author.id === message.author.id;
	          if(message.content.startsWith(prefix + "say")) {
        //return message.channel.send(':heavy_multiplication_x:| **هذا الامر معطل حاليا.. ``حاول في وقت لاحق``**'); 
        if(!message.guild.member(message.author).hasPermission('MANAGE_GUILD')) return message.channel.send(':heavy_multiplication_x:| **يجب أن يكون لديك خاصية التعديل على السيرفر**');
        message.channel.send(`📢| **Type the name of room you want to send the message to**`).then(msgg => { 
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 20000,
                errors: ['time']
            }).then(collected => { 
                let room = message.guild.channels.find('name', collected.first().content);
                if(!room) return message.channel.send('❌ | **I cant find this room**'); 
                room = collected.first().content;
                collected.first().delete();
                        msgg.edit('📝| **Type the message**').then(msg => { 
                            message.channel.awaitMessages(filter, { 
                                max: 1,
                                time: 20000,
                                errors: ['time'] 
                            }).then(collected => {
                                chat = collected.first().content;
                                collected.first().delete();
                                try {
                                    let Embed = new Discord.RichEmbed()
                                        .setDescription(chat)
                                    message.guild.channels.find('name', room).send(Embed).then(m => {
                                        let re = m.react('🎉');
                                        setTimeout(() => { 
                                            let users = m.reactions.get("🎉").users;
                                            let list = users.array().filter(u => u.id !== m.author.id);
                                            let gFilter = list[Math.floor(Math.random() * list.length) + 0];
                                            if(users.size === 1) gFilter = '**Not specified**';
                                            let Embed = new Discord.RichEmbed()
                                                .setAuthor(message.author.username, message.author.avatarURL)
                                                .setTitle(chat)
                                                .addField(`ping`+`[${Date.now() - message.createdTimestamp}]`)
                                                .setFooter(message.guild.name, message.guild.iconURL);
                                            m.edit(Embed);
                                        },duration); 
                                    });
                                    msgg.edit(`☑️| The message was sent`); 
                                } catch(e) {
                                    msgg.edit(`💢| **I could not send the message**`); 
                                    console.log(e);
                                }
                            });
                        });
                    });
                });
  }
});
client.login(process.env.BOT_TOKEN);
