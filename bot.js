/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: bot.js
*  Description: This file is the main driver program for the discord
                bot loot-assistant, whose purpose is to assist in the 
                loot council management and distribution of loot in
                the popular game World of Warcraft.
*******************************************************************/
const Discord = require('discord.js');                                                                      // The class client for connecting a bot to discord.                             

const fs = require('fs');

require('dotenv').config();

// External javascript files for the help functions. 
const getClassFromMention = require('./get_class.js');                                                                         
const helpMessage = require('./help.js');
const bot_file = require('./bot_file.js');
const addDate = require('./add_date.js');
const takeAttendance = require('./take_attendance.js');
const addPlayer = require('./add_player.js');
const editPlayer = require('./edit_player.js');
const readPlayer = require('./read_player.js');
const readClass= require('./read_class.js');
const removePlayer = require('./remove_player.js');
const removeRaid = require('./remove_raid.js');
const onlyOfficer = require('./conditionals.js');



const commandPrefix = '~';                                                                                  // The prefix to initialize the commands


let raidFileName;
let raidDate;

const bot = new Discord.Client();                                                                           // Create a Client instance with our bot token.



bot.on('ready', () => {                                                                                     // When the bot is connected and ready, log to console.
    console.log('Loot Assistant is connected and ready.');

    bot.user.setPresence({
        game: { 
            name: 'Loot Assistant',
            type: 'WATCHING'
        },
        status: 'online'
})
    raidFileName = 'NO FILE';                                                                               // when the bot turns on, there is no file
    raidDate = undefined;                                                                                   // no raid date either. These are commands the user must implement
});



// Every time a message is sent anywhere the bot is present,
// this event will fire and and check the valid commands and display
// the appropriate responses
bot.on('message', async (msg) => {

    const guild = bot.guilds.cache.get(process.env.guildID);                                                // generate the guild list


    var time;
    if (msg.author.bot) return;                                                                             // if the author of the message is a bot, don't do anything
    if(!msg.content.startsWith(process.env.commandPrefix)) return;                                          // only accept commands in the form of the prefix
    if (!msg.guild) return;                                                                                 // won't respond to direct messages
    if(!(msg.channel.id == process.env.testChannel || msg.channel.id == process.env.botChannel)) return;

    let args = msg.content.split(' ');
    let firstUser = (msg.mentions.users == null) ? null : msg.mentions.users.first()                        // enforce null conditions
    
    
    
    let member = new Promise ((resolve, reject) => {
        resolve(guild.members.fetch(firstUser));                                                            // don't accept rejections

    });

    for(var i = 0; i < args.length; ++i){
            let command = args[i].toLowerCase();                                                            // force all arguments to lowercase for easy of use
        await member.then((values) => {
            let commandUsr = '';                                                                            // the user beind referenced 
            let commandString = '';                                                                         // The items in question

            for(var pos = i+2; pos < args.length; ++pos){                                                   // Start at the position in the command list when 
                if(args[pos].startsWith(process.env.commandPrefix)) break;                                      // all commands shall start with '~' if they do, it's not an (item)
                commandString += (args[pos]) + ' ';                                                         // append all string literals into an (item)
            } 

            switch(command) {                                                                               // check the valid commands
                
                case "~help":
                case "~h":
                    helpMessage.helpMessage(msg.author);                                                    // display the help message to the invokers private message
                break;
                
                case "~loot-history":
                case "~lh":
                    if(args[i+1] == undefined) throw 'Please be sure to mention a player or a class for this command.';
                    var nick = (values.nickname == null) ? null : values.nickname;                          // enforce null conditions
                    if((nick == null)){                                                                     // if the nickname is null, the user doesn't have one
                        if(getClassFromMention.getClassFromMention(args[i+1], bot) == null) commandUsr = firstUser.username;
                    }else{
                        if(getClassFromMention.getClassFromMention(args[i+1], bot) == null) commandUsr = nick;
                    }
                    if(args[i+2] !== undefined && args[i+2].toLowerCase() == 'all'){
                        if(getClassFromMention.getClassFromMention(args[i+1], bot) == null){
                            readPlayer.readPlayer(raidFileName + '.txt', commandUsr, raidDate, 'all');
                        }
                        else readClass.readClass(raidFileName + '.txt', getClassFromMention.getClassFromMention(args[i+1], bot), raidDate, 'all');
                    }else if (args[i+2] > 0 ){
                        if(getClassFromMention.getClassFromMention(args[i+1], bot) == null){
                            readPlayer.readPlayer(raidFileName + '.txt', commandUsr, raidDate, args[i+2]);
                        } 
                        else readClass.readClass(raidFileName + '.txt', getClassFromMention.getClassFromMention(args[i+1], bot), raidDate, args[i+2]);
                    }else {
                        if(getClassFromMention.getClassFromMention(args[i+1], bot) == null){

                            readPlayer.readPlayer(raidFileName + '.txt', commandUsr, raidDate, 4); 
                        } 
                        else readClass.readClass(raidFileName + '.txt', getClassFromMention.getClassFromMention(args[i+1], bot), raidDate, 4);
                    }
                break;
                //////////////////////////// Officer commands /////////////////////////////
                //These commands will have limited access, only officers and programmers may use these commands
                case "~loot": 
                case "~l":
                    onlyOfficer.onlyOfficer(msg);
                    if(args[i+1] == undefined) throw 'Please be sure to mention a player for this command.';
                    var nick = (values.nickname == null) ? null : values.nickname;                          // enforce null conditions
                    if((nick == null)){                                                                     // if the nickname is null, the user doesn't have one
                        commandUsr = firstUser.username;
                    }else{
                        commandUsr = nick;
                    }
                    editPlayer.editPlayer(raidFileName + '.txt', commandUsr, raidDate, commandString, false);
                break;
                case "~retract":
                case "~r":
                    onlyOfficer.onlyOfficer(msg);
                    if(args[i+1] == undefined) throw 'Please be sure to mention a player for this command.';
                    var nick = (values.nickname == null) ? null : values.nickname;                          // enforce null conditions
                    if((nick == null)){                                                                     // if the nickname is null, the user doesn't have one
                        commandUsr = firstUser.username;
                    }else{
                        commandUsr = nick;
                }
                    editPlayer.editPlayer(raidFileName + '.txt', commandUsr, raidDate, commandString, true);
                break;
                case "~add-player": 
                case "~ap":
                    onlyOfficer.onlyOfficer(msg);
                    if(args[i+1] == undefined) throw 'Please be sure to mention a player for this command.';
                    if(args[i+2] == undefined) throw 'Please be sure to mention a player\'s class for this command.';
                    var nick = (values.nickname == null) ? null : values.nickname;                          // enforce null conditions
                    if((nick == null)){                                                                     // if the nickname is null, the user doesn't have one
                        commandUsr = firstUser.username;
                    }else{
                        commandUsr = nick;
                }
                    if(getClassFromMention.getClassFromMention(args[i+2], bot) == null) throw 'Can not add a player without a class!'; 
                    else addPlayer.addPlayer(raidFileName + '.txt', commandUsr, getClassFromMention.getClassFromMention(args[i+2], bot));
                break;
                case "~remove-player": 
                case "~rp":
                    onlyOfficer.onlyOfficer(msg);
                    if(args[i+1] == undefined) throw 'Please be sure to mention a player for this command.';
                    var nick = (values.nickname == null) ? null : values.nickname;                          // enforce null conditions
                    if((nick == null)){                                                                     // if the nickname is null, the user doesn't have one
                        commandUsr = firstUser.username;
                    }else{
                        commandUsr = nick;
                }
                    removePlayer.removePlayer(raidFileName + '.txt', commandUsr);
                break;
    
                case "~attendance":
                case "~a":
                    onlyOfficer.onlyOfficer(msg);
                    if(args[i+1] == undefined) throw 'Please be sure to mention a player for this command.';
                    var nick = (values.nickname == null) ? null : values.nickname;                          // enforce null conditions
                    if((nick == null)){                                                                     // if the nickname is null, the user doesn't have one
                        commandUsr = firstUser.username;
                    }else{
                        commandUsr = nick;
                }
                    takeAttendance.takeAttendance(raidFileName + '.txt', commandUsr, raidDate)
                break;
                

                case "~set-raid":                                                                           // requires raid date
                case "~sr":
                    onlyOfficer.onlyOfficer(msg);
                    if(args[i+1] == undefined) throw 'Please be sure to type in a specific raid date.';
                        raidDate = args[i+1];
                    throw 'The Currently set raid date for modification purposes is ' + raidDate + ' be sure to either change this or ~create-raid {date attribute} by next raid.' ;
                break;
                case "~what-raid":                                                                          // requires nothing extra
                case "~wr":
                    throw ('The Currently set raid date for operations is  ' + raidDate + ' if you wish to change this, either use create-raid or set-raid commands.') ;
                break;

                case "~create-raid":                                                                        // requires raid date
                case "~cr":
                case "~c":
                    onlyOfficer.onlyOfficer(msg);
                    if(args[i+1] == undefined) throw 'Please be sure to type in a specific raid date.';
                    raidDate = args[i+1];
                    addDate.addDate(raidFileName + '.txt', args[i+1])
                break;
                case "~delete-raid":                                                                        // requires raid date
                case "~dr":
                case "~d":
                    onlyOfficer.onlyOfficer(msg);
                    if(raidFileName == 'NO FILE') throw 'Can\'t delete a raid without a specified raid file. Please set-file first.';
                    if(args[i+1] == undefined) throw 'Please be sure to type in a specific raid date.';
                    removeRaid.removeRaid(raidFileName + '.txt', args[i+1])
                break;
                case "~set-file":                                                                           // requires file name
                    onlyOfficer.onlyOfficer(msg);
                    if(args[i+1] == undefined) throw 'Please be sure to type in a specific raid file, no extensions.';
                    if(fs.existsSync(args[i+1]+'.txt')){
                        raidFileName = args[i+1];
                        throw ('The file ' + raidFileName + ' has been set for the lifespan of the bot. To change this please ~set-file again');
                    }else 
                        throw ('That file does not exist, please use ~create-file {filename} first, no extensions.\nThen check the file name with ~what-file.\nThank you.');
                break; 
                case "~what-file":                                                                          // requires nothing extra
                    onlyOfficer.onlyOfficer(msg);
                    if(raidFileName == 'NO FILE')
                        msg.channel.send('There is not a currently set file, please use ~create-file {filename} if the file doesn\'t exist. \nThen use ~set-file {filename} to set the file for the lifespan of the bot.');
                    else
                        msg.channel.send('The currently set file to read from is : '+ raidFileName + '.txt' );
                break;
                case "~create-file":                                                                        // requires file name
                    onlyOfficer.onlyOfficer(msg)
                    if(args[i+1] == undefined) throw 'Please be sure to type in a specific raid file, no extensions.';
                    raidFileName = args[i+1];
                    if(args[i+2] == undefined)
                    bot_file.createNewFile(args[i+1] + '.txt', null, null);
                    else 
                    bot_file.createNewFile(args[i+1] + '.txt', args[i+2], args[i+3]);
                break;
                case "~backup-file":                                                                        // requires nothing extra
                    onlyOfficer.onlyOfficer(msg);
                    if(raidFileName == 'NO FILE')
                        throw('There is not a currently set file, please use ~create-file {filename} if the file doesn\'t exist. \nThen use ~set-file {filename} to set the file for the lifespan of the bot.');
                    bot_file.backupFile(raidFileName + '.txt', raidFileName+'_backup.txt');
                break;    
                case "~restore-file":                                                                       // requires nothing extra
                    onlyOfficer.onlyOfficer(msg);
                    if(raidFileName == 'NO FILE')
                        throw('There is not a currently set file, please use ~create-file {filename} if the file doesn\'t exist. \nThen use ~set-file {filename} to set the file for the lifespan of the bot.');
                    bot_file.restoreBackup(raidFileName + '.txt', raidFileName+'_backup.txt');
                break;
                case "~delete-file":                                                                        // requires file name
                    onlyOfficer.onlyOfficer(msg);
                    if(args[i+1] == undefined) throw 'Please be sure to type in a specific raid file, no extensions.';
                    if(fs.existsSync(args[i+1]+'.txt')){
                        fs.unlink(args[i+1]+'.txt', function (err) {                                         // delete the previous backup file
                            if (err) throw err;
                            msg.channel.send('File has been Deleted.\nFile has been reset, please create a new file if needed\nPlease do ~set-file {filename} in order to keep using this bot.');

                          });
                    
                    }
                    raidFileName = 'NO FILE';
                break;

                //////////////////////////// Officer commands /////////////////////////////     
            default: 
            
            }


        
    }).catch((err) => { console.log(err); if(!(err == null)) msg.channel.send(err);});                        // Catch any errors or messages, display to the console and the discord bot
    

}});

bot.on('error', err => {
   console.warn(err);
});

bot.login(process.env.botToken);                                                                              // connects the bot to the discord server.
