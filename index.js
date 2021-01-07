const Discord = require('discord.js');
const client = new Discord.Client();
var prefix = "!";
client.login("Bot TOKEN");
const db = require("quick.db");
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag} !`);
});

const RequireIDs = {
    GuildId: 'Server ID', //Your Server ID
    TicketCategoryId: 'Category ID', //Tickets Gategory
    LogChannel: 'Log Channel ID'
}

//When Someone Send Message to the bot , will create a channel for him on th server
client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type !== 'text') {
        let active = await db.fetch(`support_${message.author.id}`);
        let guild = client.guilds.cache.get(RequireIDs.GuildId);
        let channel, found = true;
        try {
            if (active) client.channels.cache.get(active.channelID).guild;
        } catch (e) {
            found = false;
        }
        if (!active || !found) {
            active = {};
            channel = await guild.createChannel(`${message.author.username}-${message.author.discriminator}`)
            channel.setParent(RequireIDs.TicketCategoryId)
            channel.setTopic(`${prefix}complete to close the ticket | Support for ${message.author.tag} | ID: ${message.author.id}`)

            channel.overwritePermissions(`${guild.id}`, { //Hide Channel for @everyone
                VIEW_CHANNEL: false,
            });

            let author = message.author;


            const newChannel = new Discord.RichEmbed()
                .setColor('RANDOM')
                .setAuthor(author.tag, author.avatarURL)
                .setFooter('Support Ticket Created!')
                .addField('User', author)
                .addField('ID', author.id)
            await channel.send(newChannel);


            const newTicket = new Discord.RichEmbed()
                .setColor('RANDOM')
                .setAuthor(`Hello, ${author.username}`, author.avatarURL)
                .setFooter('Support Ticket Created!')
            await author.send(newTicket);
            active.channelID = channel.id;
            active.targetID = author.id;
        }

        channel = client.channels.cache.get(active.channelID);
        const dm = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setAuthor(`Thank you, ${message.author.username}`, message.author.avatarURL)
            .setFooter(`Your message has been sent - A staff member will be in contact soon.`)
        await message.author.send(dm);
        if (message.content.startsWith(prefix + 'complete')) return;
        const embed5 = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setDescription(message.content)
            .setFooter(`Message Received - ${message.author.tag}`)
        await channel.send(embed5);
        db.set(`support_${message.author.id}`, active);
        db.set(`supportChannel_${channel.id}`, message.author.id);
        return;
    }
    let support = await db.fetch(`supportChannel_${message.channel.id}`);
    if (support) {
        support = await db.fetch(`support_${support}`);
        let supportUser = client.users.cache.get(support.targetID);
        if (!supportUser) return message.channel.delete();
        if (message.content.toLowerCase() === '/complete') {
            const complete = new Discord.RichEmbed()
                .setColor('RANDOM')
                .setAuthor(`Hey, ${supportUser.tag}`, supportUser.avatarURL)
                .setFooter('Ticket Closed')
                .setDescription('Your ticket has been marked as complete. If you wish to reopen it, or create a new one, please send a message to the bot.')
            supportUser.send(complete);
            message.channel.delete();
            db.delete(`support_${support.targetID}`);
            let inEmbed = new Discord.RichEmbed()
                .setTitle('Ticket Closed!')
                .addField('Support User', `${supportUser.tag}`)
                .addField('Closer', message.author.tag)
                .setColor('RANDOM')
            const staffChannel = client.channels.cache.get(RequireIDs.LogChannel); //Create a log channel and put id here
            if (staffChannel) {
                staffChannel.send(inEmbed);
            }
        }
        const embed4 = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setFooter(`Message Received`)
            .setDescription(message.content)
        client.users.cache.get(support.targetID)
            .send(embed4);
        message.delete({
            timeout: 10000
        });
        embed4.setFooter(`Message Sent -- ${supportUser.tag}`)
            .setDescription(message.content);
        return message.channel.send(embed4);
    }
});
