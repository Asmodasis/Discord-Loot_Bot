//Author: Shawn Ray

const Discord = require('discord.js');                                                          // The class client for connecting a bot to discord.                             
var assert = require('assert')                                                                  // for handling assertions 
const SynchronousPromise = require('synchronous-promise')

const bot = new Discord.Client();                                                               // Create a Client instance with our bot token.
const guild = new Discord.Guild(bot, bot.users);
const commandPrefix = '~';                                                                      // The prefix to initialize the commands

//var GoogleSpreadsheet = require('google-spreadsheet');                                          // for working with google spreadsheet
var creds = require('./credentials.json')


const botToken = '';
const spreadID = '';
const guildID = "";
//var doc = new GoogleSpreadsheet(spreadID);  

//const guild = new Discord.Guild(bot, bot.database.query)


var hasRaidBegun = false;

const priestRoleID = '<@&>';
const warriorRoleID = '<@&>';
const druidRoleID = '<@&>';
const mageRoleID = '<@&>';
const warlockRoleID = '<@&>';
const hunterRoleID = '<@&>';
const rogueRoleID = '<@&>';
const paladinRoleID = '<@&>';

bot.on('ready', () => {                                                                         // When the bot is connected and ready, log to console.
   console.log('Loot Assistant is connected and ready.');
   //const guild = new Discord.Guild(bot, bot.database.query)
  bot.user.setPresence({
        game: { 
            name: 'Loot Assistant',
            type: 'WATCHING'
        },
        status: 'online'
})
   
});

var nick, us, ide;

// Every time a message is sent anywhere the bot is present,
// this event will fire and and check the valid commands and display
// the appropriate responses
bot.on('message', async (msg) => {
    let time = new Date().toDateString();
    if (msg.author.bot) return;                                                                 // if the author of the message is a bot, don't do anything
    if(!msg.content.startsWith(commandPrefix)) return;                                          // only accept commands in the form of the prefix

    //console.log(msg.content.split(' ')[0]);
    
    //const g = guild.guilds.fetch(guildID);
    //let guildMembers = msg.guild.members.fetch()

    let args = msg.content.split(' ');
    //let args = msg.content.slice(commandPrefix.length).trim().split(' ');                     // Arguments, valid command example ~help will display a help message or ~say I am a bot, arg[0] would be I and arg[1] would be am

    for(var i = 0; i < args.length; ++i){
        let command = args[i].toLowerCase();                                                    // force all arguments to lowercase for easy of use
        //console.log(i);
        switch(command) {                                                                       // check the valid commands
        case "~help":
                helpMessage(msg.author);                                                        // display the help message to the invokers private message
                //msg.channel.send(bot.channels.get(615984071402717214)) //.roles.get(priestRoleID));
            break;
            case "~loot":                                                                       // handles loot distribution for the specified players
                //console.log(i)
                if(hasRaidBegun) applyLoot(msg, args[i+1], i+2, args, false);
                else 
                    msg.channel.send('A raid must be active before loot can be applied!');
            break;
            case "~retract":
                if(hasRaidBegun) applyLoot(msg, args[i+1], i+2, args, true);
                else 
                    msg.channel.send('A raid must be active before loot can be applied!');
            break;
            case "~loot-history":
                //console.log(getUserFromMention(msg.mentions.users.first().member.display_name))
                //console.log(bot.guild.get(msg.mentions.users.first()));
                //let mem = msg.guild.members.fetch()
                //console.log(args[i+1])
                //var nick, us, ide;
               /*
                const guildMembers = await new Promise((resolve, reject) => {                // fetches all the guild members
                    if(!(msg.mentions.users.first()==null)) return resolve(msg.guild.members.fetch(msg.mentions.users.first()));
                    else reject('Failure!');
                    }).then((promise) => {
                        nick        = (msg.mentions.users.first().username.users.nickname)
                        us          = (msg.mentions.users.first().username)
                        ide         = (msg.mentions.users.first().id)
                        return msg.guild.members.fetch(msg.mentions.users.first())
                    }).catch((err) => {console.log("Exception caught: " + err);});                                  
                   
                   // console.log(msg.guild.members.fetch(msg.mentions.users.first()))
*/
                let firstUser = msg.mentions.users.first()
                let member = guild.member(firstUser);
                let nick = member ? member.displayName : null;

                console.log(args[i+1])
                msg.channel.send(args[i+1]);
 /*               console.log(msg.guild.members.fetch(msg.mentions.users.first()).then( (promise) => {
                                nick = (msg.mentions.users.first().nickname)
                                us = (msg.mentions.users.first().username)
                                ide = (msg.mentions.users.first().id)
                                return msg.guild.members.fetch(msg.mentions.users.first())
                            }

                let nick    = (guildMembers.nickname);
                let us      = (guildMembers.username);
                let ide     = (guildMembers.id);
*/
                //TODO: THESE PRINT BEFORE THE PROMISE IS RESOLVED
               // console.log(nick)
                //console.log(us)
               // console.log(ide)
               // msg.channel.send(nick);
               // msg.channel.send(us);
               // msg.channel.send(ide);

                msg.channel.send('{Test} loot-history command indicated.')
                //msg.channel.send(getUserFromMention(msg.mentions.users.first().member.display_name))
                //msg.channel.send(bot.guild.get(msg.mentions.users.first()));
                //msg.channel.send(getUserFromMention(args[i+1]))
            break;
            case "~guild-roster":
                msg.channel.send('The guild roster command is not operational currently.');
            break;
            case "~raid-roster":
                msg.channel.send('The raid roster command is not operational currently.');
            break;
            case "~attendance":
                msg.channel.send('The attendance command is not operational currently.');
            break;
            case "~start-raid":
                hasRaidBegun = true;
                msg.channel.send(msg.author.username + ' has begun the raid for ' + time + '. Good luck!');
            break;
            case "~end-raid":
                hasRaidBegun = false;
                msg.channel.send(msg.author.username + ' has ended the raid for ' + time);
            break;
        default: 
        
        }
    }
});

async function asyncForEach(array, callback) { // modifies version of forEach, taken from https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
    for (let index = 0; index < array.length; index += 1) {
        await callback(array[index], index, array);
    }
}


function getUserFromMention(msg) {
	if (!msg) return;
    var returnClass = '';

    //return bot.users.cache.get(msg);
    //return msg;
    //return bot.users.fetch(msg.author);
    //return msg.mentions.first();


       
        
        if (msg.startsWith('<@') && msg.endsWith('>')) {
            msg = msg.slice(2, -1);
    
            if (msg.startsWith('!')) {
                msg = msg.slice(1);
            }
                //return msg.author;
                return bot.users.cache.get(msg).displayName;
            
            //return msg.guild.roles.get(msg.id);
            //return bot.users.cache.get(msg).username;
        }
        
    } 
    /*   
    if (bot.users.cache.get(msg) == undefined){
        if(msg == priestRoleID){
            returnClass = 'Priest';
        }else if(msg == warriorRoleID){
            returnClass = 'Warrior';
        }else if(msg == druidRoleID){
            returnClass = 'Druid';
        }else if(msg == mageRoleID){
            returnClass = 'Mage';
        }else if(msg == warlockRoleID){
            returnClass = 'Warlock';
        }else if(msg == hunterRoleID){
            returnClass = 'Hunter';
        }else if(msg == rogueRoleID){
            returnClass = 'Rogue';
        }else if(msg == paladinRoleID){
            returnClass = 'Paladin';
        }
        return returnClass;
    }   
    else{


}*/

function helpMessage (usr){
    usr.send("Hello and thank you for using the Loot Assistant bot.");
    usr.send("You have indicated that you would like assitance.");
    usr.send("The following are a list of commands that may be invoked.");
    usr.send("All commands must start with the control character indicated by '~', without the quotations.");
    usr.send("'~loot' followed by an @user and [item text] will indicate that loot had been given to said user.");
    usr.send("'~retract' followed by an @user and [item text] will retract the item from the user.");
    usr.send("'~loot-history' followed by an @user or @role will display the loot history for that player or class.");
    usr.send("'~guild-roster' will display the current guild roster.");
    usr.send("'~raid-roster' will display the current raid roster.");
    usr.send("'~start-raid' will begin a raid specified by the current date. It must be ended before the day is over." );
    usr.send("'~end-raid' will end the raid specified by the current day. It must be used after the '~start-raid' command was indicated");
    usr.send("Please do not respond to this direct message and good luck in the raid!");
}


function applyLoot (msg, usr, pos, args, isRetracted=false){
    
    var i;
    var itemString = '';                                                                        // The string for the loot item the player receives 
   
    for(i = pos; i < args.length; ++i){                                                         // Start at the position in the command list when applyLoot is called
        if(args[i].startsWith(commandPrefix)) break;                                            // all commands shall start with '~' if they do, it's not an (item)
        itemString = itemString + (args[i]) + ' ';                                              // append all string literals into an (item)
    }



    if(isRetracted){                                                                            // is the item being retracted from the document
        console.log('The Item being removed is ' + itemString)                                  // display the string (item) to the console

        msg.channel.send(msg.author.username + ' has retracted ' + itemString +' from ' + usr); // display the message to discord

    }else{                                                                                      // then the item is being applied to the document
        console.log('The Item being added is ' + itemString)                                    // display the string (item) to the console
        _accessUserFromDoc()
        msg.channel.send(msg.author.username + ' has given '+ itemString + ' to ' + usr);       // display the message to discord
    }
    
    console.log(i);
    
    return i;
}

function lootHistory (msg, usr, playerClass, accessDate, isClassFlag=false){
    if(isClassFlag){                                                                            // class mode, has to access all members of the class

    }else{                                                                                      // individual user mode

    }

}
function guildRoster (msg){

}
function raidRoster (msg){

}

function _accessUserFromDoc (usr, accessDate){

}

function _accessClassFromDoc (playerClass, accessDate){

}

bot.on('error', err => {
   console.warn(err);
});

bot.login(botToken);                                                                             // connects the bot to the discord server.