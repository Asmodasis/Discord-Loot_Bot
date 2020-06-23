//Author: Shawn Ray

const Discord = require('discord.js');                                                          // The class client for connecting a bot to discord.                             
var assert = require('assert')                                                                  // for handling assertions 
const SynchronousPromise = require('synchronous-promise')
var {GoogleSpreadsheet} = require('google-spreadsheet');                                          // for working with google spreadsheet
var creds = require('./credentials.json')

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { raw } = require('body-parser');

// If modifying these scopes, delete token.json.
//const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

const commandPrefix = '~';                                                                      // The prefix to initialize the commands

const botToken = '..';
const spreadID = '';
const guildID = "";

const officerRoleID = '';
const programmerRoleID = '';
const guildMasterRoleID = '';
const classLeaderRoleID = '';

const priestRoleID = '<@&>';
const warriorRoleID = '<@&>';
const druidRoleID = '<@&>';
const mageRoleID = '<@&>';
const warlockRoleID = '<@&>';
const hunterRoleID = '<@&>';
const rogueRoleID = '<@&>';
const paladinRoleID = '<@&>';

const bot = new Discord.Client();                                                               // Create a Client instance with our bot token.

var doc = new GoogleSpreadsheet(spreadID);  
const guild = new Discord.Guild()

var hasRaidBegun = true; // TODO : This value was changed to assist in debugging
//var hasRaidBegun = false;

//doc.useServiceAccountAuth(creds);                                                               // validate the credentials for the google docs
//doc.loadInfo();                                                                                 // load info from the doc

//console.log(doc.title)  

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

    const guild = bot.guilds.cache.get(guildID);                                                // generate the guild list


    var time;
    if (msg.author.bot) return;                                                                 // if the author of the message is a bot, don't do anything
    if(!msg.content.startsWith(commandPrefix)) return;                                          // only accept commands in the form of the prefix
    if (!msg.guild) return;                                                                     // won't respond to direct messages

    let args = msg.content.split(' ');
    let firstUser = (msg.mentions.users == null) ? null : msg.mentions.users.first()               // enforce null conditions
    //let firstUser = msg.mentions.users.first()

    let member = new Promise ((resolve, reject) => {
        resolve(guild.members.fetch(firstUser));

    });
    if(!(msg.member.roles.cache.has(officerRoleID)     ||
         msg.member.roles.cache.has(programmerRoleID)  ||
         msg.member.roles.cache.has(guildMasterRoleID) ||
         msg.member.roles.cache.has(classLeaderRoleID)
         )
       ){
        msg.channel.send('Only a user with an Officer role may invoke this bot.');
        return;
    }
   

    for(var i = 0; i < args.length; ++i){
        let command = args[i].toLowerCase();                                                    // force all arguments to lowercase for easy of use
    
        switch(command) {                                                                       // check the valid commands
        case "~help":
                helpMessage(msg.author);                                                        // display the help message to the invokers private message
            break;
            case "~loot": 
                if(!(hasRaidBegun)) {
                    msg.channel.send('A raid must be active before loot can be applied!');
                    return;
                }else{                                                                                            // handles loot distribution for the specified players
                    await member.then((values) => {
                        var nick = (values.nickname == null) ? null : values.nickname               // enforce null conditions
                        let lootUsr = '';
                        let lootString = '';
                        for(var pos = i+2; pos < args.length; ++pos){                                              // Start at the position in the command list when 
                            if(args[pos].startsWith(commandPrefix)) break;                                            // all commands shall start with '~' if they do, it's not an (item)
                            lootString = lootString + (args[pos]) + ' ';                                           // append all string literals into an (item)
                        }                    

                        if((nick == null)){                                                         // if the nickname is null, the user doesn't have one
                            //console.log(firstUser.username)
                            //msg.channel.send(firstUser.username)
                            lootUsr = firstUser.username;
                        }else{
                            //console.log(nick)
                            //msg.channel.send(nick)
                            lootUsr = nick;
                        }
                        //fs.readFile('credentials.json', (err, content) => {
                        //    if (err) return console.log('Error loading client secret file:', err);
                            // Authorize a client with credentials, then call the Google Sheets API.
                        //    authorize(JSON.parse(content), _accessUserFromDoc(lootString, time));
                        //})
                        //console.log("msg is  : " + msg)
                        console.log("args[i+2] is : " + args[i+2])
                        //console.log("i+2 is : " + i+2)
                        //console.log("time is  : " + time)
                        console.log("loot user is  : " + lootUsr)
                        console.log("loot String is  : " + lootString)
                        applyLoot(msg, lootString, lootUsr, time, false);
                }).catch((err) => {console.log("Exception caught: " + err);});
            }
            break;
            case "~retract":
                if(!(hasRaidBegun)) {
                    msg.channel.send('A raid must be active before loot can be applied!');
                    return;
                }else{
                    await member.then((values) => {
                        var nick = (values.nickname == null) ? null : values.nickname               // enforce null conditions
                        let retractUsr = '';
                        let retractString = '';
                        for(var pos = i+2; pos < args.length; ++pos){                                              // Start at the position in the command list when 
                            if(args[pos].startsWith(commandPrefix)) break;                                            // all commands shall start with '~' if they do, it's not an (item)
                            retractString = retractString + (args[pos]) + ' ';                                           // append all string literals into an (item)
                        }                    

                        if((nick == null)){                                                         // if the nickname is null, the user doesn't have one
                            //console.log(firstUser.username)
                            //msg.channel.send(firstUser.username)
                            retractUsr = firstUser.username;
                        }else{
                            //console.log(nick)
                            //msg.channel.send(nick)
                            retractUsr = nick;
                        }
                        //fs.readFile('credentials.json', (err, content) => {
                        //    if (err) return console.log('Error loading client secret file:', err);
                            // Authorize a client with credentials, then call the Google Sheets API.
                        //    authorize(JSON.parse(content), _accessUserFromDoc(retractString, time));
                        //});
                        //console.log("msg is  : " + msg)
                        console.log("args[i+2] is : " + args[i+2])
                        console.log("i+2 is : " + i+2)
                        console.log("time is  : " + time)
                        console.log("retract user is  : " + retractUsr)
                        applyLoot(msg, retractString, retractUsr, time, true);
                }).catch((err) => {console.log("Exception caught: " + err);});
            }
            break;
            case "~loot-history":
                await member.then((values) => {
                    var nick = (values.nickname == null) ? null : values.nickname               // enforce null conditions
                    //let historyString = '';

                    if(nick == null){                                                   // if the nickname is null, the user doesn't have one
                        if(!(firstUser==null)){                                          
                            //console.log(firstUser.username);
                            //msg.channel.send(firstUser.username);
                            lootHistory (msg, firstUser.username, null, time, false)
                        }else{                                                          // we're in class mode
                            //console.log(getClassFromMention(args[i+1]));
                            //msg.channel.send(getClassFromMention(args[i+1]));
                            lootHistory (msg, null, getClassFromMention(args[i+1]), time, true);
                        }
  
                    }else {                                                             // the user has an assigned nickname
                        //console.log(nick);
                        //msg.channel.send(nick);
                        lootHistory (msg, nick, null, time, false);
                    }

            }).catch((err) => {console.log("Exception caught: " + err);});
            break;
            case "~guild-roster":
                msg.channel.send('The guild roster command is not currently operational.');
            break;
            case "~raid-roster":
                msg.channel.send('The raid roster command is not currently operational.');
            break;
            case "~attendance":
                msg.channel.send('The attendance command is not currently operational.');
            break;
            case "~start-raid":
                hasRaidBegun = true;
                time = new Date().toDateString();                                   // form a new time for the taid to begin
                msg.channel.send(msg.author.username + ' has begun the raid for ' + time + '. Good luck!');
            break;
            case "~end-raid":
                hasRaidBegun = false;
                time = null;                                                        // if the raid ended, remove the access date
                msg.channel.send(msg.author.username + ' has ended the raid for ' + time);
            break;
        default: 
        
        }
    }
});



function getClassFromMention(msg) {
	if (!msg) return;
    var returnClass = '';      
    
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
}




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


function applyLoot (msg, lootString, lootUsr, accessDate, isRetracted=false){
    // lootString may contain the item to retract or give to the player.

    if(isRetracted){                                                                            // is the item being retracted from the document
        console.log('The Item being removed is ' + lootString)                                  // display the string (item) to the console
        msg.channel.send(msg.author.username + ' has retracted ' + lootString +' from ' + lootUsr); // display the message to discord
        
        //credentials, callback, callbackString, callbackDate, isWriting =false
        fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), _accessUserFromDoc, lootString, lootUsr, accessDate, true, true);
        })

    }else{                                                                                      // then the item is being applied to the document
        console.log('The Item being added is ' + lootString)                                    // display the string (item) to the console
        msg.channel.send(msg.author.username + ' has given '+ lootString + ' to ' + lootUsr);       // display the message to discord
       
        //credentials, callback, callbackString, callbackDate, isWriting =false
        fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), _accessUserFromDoc, lootString, lootUsr, accessDate, true, false);
        })
    }

}

function lootHistory (msg, historyUsr, playerClass, accessDate, isClassFlag=false){
    var historyString = '';                                                                        // The string for the loot item the player receives 



    if(isClassFlag){                                                                            // class mode, has to access all members of the class
        //credentials, callback, callbackString, callbackDate, isWriting =false
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(JSON.parse(content), _accessClassFromDoc, historyString, historyUsr, accessDate, false, false);
            })
    }else{                                                                                      // individual user mode
        //credentials, callback, callbackString, callbackDate, isWriting =false
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(JSON.parse(content), _accessUserFromDoc, historyString, historyUsr, accessDate, false, false);
            })
    }

}
function guildRoster (msg){

}
function raidRoster (msg){

}

function authorize(credentials, callback, callbackString, callbackUsr, callbackDate, isWriting =false, isRetracted =false) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, callbackString, callbackUsr, callbackDate, isWriting, isRetracted);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback, callbackString, callbackUsr, callbackDate, isWriting =false, isRetracted=false) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client, callbackString, callbackUsr, callbackDate, isWriting);
    });
  });
}

//user is a string
// Used in the command ~loot and ~loot-history
function _accessUserFromDoc (auth, accessString, usr, accessDate, isWriting=false, isRetracted=false){
    
    var isFound = false;

    const sheets = google.sheets({version: 'v4', auth});
    if(isWriting){                                                              // writing to the document 
                                                                                // ~loot @User
        sheets.spreadsheets.values.update({
            spreadsheetId: spreadID,
            range: '\'Molten Core\'!B1:DW62',
            valueInputOption: 'RAW'
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                //console.log("TEST")
                const rows = res.data.values;
                //console.log("TEST")
                if(isRetracted){                                                // remove an item from a player
                //console.log("TEST")
                    var index = 4;
                    while(!isFound){
                        if(usr == rows[index]){                                 // user located
                            isFound = true;
                        }else{                                                  // increment the index to check the next user
                            ++index;
                        }
                    }
                    if(isFound){
                        //TODO: loop through all the date icons to locate the current raid, and then REMOVE the item
                        console.log(rows[index])
                    }else return console.log('Unable to locate the user');

                }else{                                                          // give an item to a player
                    //console.log("TEST")
                    var index = 4;
                    while(!isFound){
                        if(usr == rows[index]){                                 // user located
                            isFound = true;
                        }else{                                                  // increment the index to check the next user
                            ++index;
                        }
                    }
                    if(isFound){
                        //TODO: loop through all the date icons to locate the current raid, and then ADD the item
                        console.log(rows[index])
                    }else return console.log('Unable to locate the user');

                }

          });
    }else{                                                                      // reading from the document
                                                                                // ~loot-history @User
        sheets.spreadsheets.values.get({
            spreadsheetId: spreadID,
            range: '!B1:DW62',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;

                if (rows.length) {

                    console.log(rows.length)
                    for(let j = 1; j < rows.length; ++j){

                        if(usr == (rows[j][0])){                   // user located
                            console.log(`${rows[j][0]}`)
                            //for(let k = 0; k < 6; ++k){
                            //    console.log(`${rows[j][k]}`)
                            //}
                        
                        }
                    }
                } else {
                console.log('No data found.');
            }
          });
    }


}

function _getPlayerLocation(){

}
function _changeItem(){

}
function _makeColumn(){
    
}

// player class is a string
// only used in command ~loot-history @Class
function _accessClassFromDoc (auth, accessString, playerClass, accessDate, isWriting=false, isRetracted=false){
    const sheets = google.sheets({version: 'v4', auth});

}
/*
   
    const sheets = google.sheets({version: 'v4', auth});

    sheets.spreadsheets.values.get({
    spreadsheetId: '1Uyd3PpkEt6z985lVIFUxLlS4awXOpB1WdkyJewB8WOg',
    range: 'B:DW',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
        //console.log('Name, Major:');
        // Print columns A and E, which correspond to indices 0 and 4.
        rows.map((row) => {
            console.log(`${row[0]}, ${row[4]}`);
        });
        } else {
        console.log('No data found.');
    }
  });
*/


bot.on('error', err => {
   console.warn(err);
});

bot.login(botToken);                                                                             // connects the bot to the discord server.