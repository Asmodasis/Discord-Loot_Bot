//Author: Shawn Ray

const Discord = require('discord.js');                                                  // The class client for connecting a bot to discord.

const botToken = '';
                                            
const bot = new Discord.Client();                                                       // Create a Client instance with our bot token.
const commandPrefix = '~';                                                              // The prefix to initialize the commands

bot.on('ready', () => {                                                                 // When the bot is connected and ready, log to console.
   console.log('Loot Assistant is connected and ready.');
});

// Every time a message is sent anywhere the bot is present,
// this event will fire and and check the valid commands and display
// the appropriate responses
bot.on('message',  (msg) => {

    if (msg.author.bot) return;                                                         // if the author of the message is a bot, don't do anything
    if(!msg.content.startsWith(commandPrefix)) return;                                  // only accept commands in the form of the prefix

   //console.log(msg.content.split(' ')[0]);

   let args = msg.content.split(' ');
    //let args = msg.content.slice(commandPrefix.length).trim().split(' ');              // Arguments, valid command example ~help will display a help message or ~say I am a bot, arg[0] would be I and arg[1] would be am
     //let command = nil;                                           // force all arguments to lowercase for easy of use


    for(var i = 0; i < args.length; ++i){
        let command = args[i].toLowerCase();                                            // force all arguments to lowercase for easy of use
        //console.log(command);                                                           // log the command to the console
        switch(command) {                                                               // check the valid commands
        case "~help":
                helpMessage(msg.author);                                                // display the help message to the invokers private message
            break;
            case "~say":
                msg.channel.createMessage('{Test} Say command indicated.')
            break;
            case "~loot":
                //msg.channel.send(msg.author.username + ' has given '+ args[i+2] +' to ' + args[i+1]);
                console.log(i)
                i=applyLoot(msg, args[i+1], i+2, args)
            break;
            case "~retract":
                msg.channel.createMessage('{Test} retract command indicated.')
            break;
            case "~loot-history":
                msg.channel.createMessage('{Test} loot-history command indicated.')
            break;
            case "~guild-roster":
                msg.channel.createMessage('{Test} guild-roster command indicated.')
            break;
            case "~raid-roster":
                msg.channel.createMessage('{Test} raid-roster command indicated.')
            break;
            case "~attendance":
                msg.channel.createMessage('The attendance command is not operational currently.')
            break;
            case "~start-raid":
                msg.channel.createMessage('The start Raid command is not operational currently.')
            break;
            case "~end-raid":
                msg.channel.createMessage('The end Raid command is not operational currently.')
            break;
        default: 
        
        }
    }
});

function helpMessage (usr){
    //msg.member.id.createMessage("{Test} Help command indicated.");
    //usr.createMessage("{Test} Help command indicated.");
    usr.send("Hello and thank you for using the Loot Assistant bot.");
    usr.send("You have indicated that you would like assitance.");
    usr.send("The following are a list of commands that may be invoked.");
    usr.send("All commands must start with the control character indicated by '~', without the quotations.");
    usr.send("'~say' followed by a list of words will tell the bot to say those words.");
    usr.send("'~loot' followed by an @user and [item text] will indicate that loot had been given to said user.");
    usr.send("'~retract' followed by an @user and [item text] will retract the item from the user.");
    usr.send("'~loot-history' followed by an @user will display the loot history for that player.");
    usr.send("'~guild-roster' will display the current guild roster.");
    usr.send("'~raid-roster' will display the current raid roster.");
    usr.send("'~start-raid' will begin a raid specified by the current date. It must be ended before the day is over." );
    usr.send("'~end-raid' will end the raid specified by the current day. It must be used after the '~start-raid' command was indicated");
    usr.send("Please do not respond to this direct message and good luck in the raid!");
}


function applyLoot (msg, usr, pos, args){
    var i;
    var itemString = '';                                                                       // The string for the loot item the player receives 
    console.log(pos)
    for(i = pos; i < args.length; ++i){                                                   // Start at the position in the command list when applyLoot is called
        //if(args[i].startsWith(commandPrefix)) break;
        itemString = itemString + (args[i]) + ' ';
    }
    //console.log(itemString.type)
    console.log(itemString)

    msg.channel.send(msg.author.username + ' has given '+ itemString +' to ' + usr);
    return i;
}

function lootHistory (msg, usr){

}
function guildRoster (msg){

}
function raidRoster (msg){

}

function _accessUserFromExcel (usr){

}
function _accessUserFromExcel (usr){

}

bot.on('error', err => {
   console.warn(err);
});

bot.login(botToken);                                                                          // connects the bot to the discord server.