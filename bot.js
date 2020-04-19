const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "!"; //Our bot's prefix
const fs = require('fs'); 
const db = require('quick.db'); //Database to track user message counts

client.on('ready', () => {
    console.log('Logged in and ready to socially distance!')
});

client.on('guildMemberAdd', member => {

    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome")
    if(!channel) return;
    channel.send(`Welcome to the server, **${member}**! Read the rules or suffer the wrath of RewardBot!`)

});

//This will run everytime a message is recieved
client.on('message', message => {

    let args = message.content.slice(prefix.length).trim().split(" ");
    let cmd = args.shift().toLowerCase();

    try { //This is allow bot commands to be placed in seperate files, so no need for constant if-else statements
        let commandFile = require(`./commands/${cmd}.js`);
        commandFile.run(client, message, args);
    } catch(e) {
       
        console.log(e.message);

    } finally {

        console.log(`${message.author.username} ran the command: ${cmd}`);
    }
    

    //Message Tracking/Leveling 
    db.add(message.author.id + message.guild.id, 1)
    let messages = db.get(message.author.id + message.guild.id)
    db.add(`userLevel_${message.author.id + message.guild.id}`, 1)

    if (messages == 20) {
        const channel = message.channel;
        channel.send(`Hey, ${message.author} you can be promoted!` );
    }


    if (message.content.startsWith(prefix + 'messageCount')) {
        db.get(`userLevel_${message.author.id + message.guild.id}`)
        message.channel.send('Messages sent: ' + (messages + 1)); //Returns messages and level
    }


    if (!message.content.startsWith(prefix)) return; //Ignores a message if it doesn't start with our prefix
}); 

client.login('Njk3NTk3NDEzNTg1ODQ2Mjg5.XpwIWQ.GWv2eZNKgoq-x-gOSKTbrBKGFE0');

 /* var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', () => {
    console.log('Bot Launched and ready to roll!')
    
    //Any other stuff the bot can do on launch 
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('guildMemberAdd', member => {
     
    //Send a message to #new-members channel that someone has joined
    member.guild.channels.get('701291114539384862').send('**' + member.user.username + '**, has joined the server!');

    //Looks for the role 'New Member' within the server
    var role = member.guild.roles.find('name', 'New Member');

    //Adds the role 'New Member' to the new user
    member.addRole(role)

}); */

