//Author: Shawn Ray

const Discord = require('discord.js');                                                          // The class client for connecting a bot to discord.                             
//var assert = require('assert')                                                                  // for handling assertions 
///const SynchronousPromise = require('synchronous-promise')

const fs = require('fs');
//const readline = require('readline');
//const { raw } = require('body-parser');
//const { ifError } = require('assert');

const commandPrefix = '~';                                                                      // The prefix to initialize the commands


///////////////////////////////// Discord Server Unique Information ///////////////////////////////////////////////////////////////
const botToken = '..';
const guildID = "";

const officerRoleID = ''; // TEST if all but officer is 0
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
const shamanRoleID = '<@&>';
const monkRoleID = '<@&>';
const deathKnightRoleID = '<@&>';
const demonHunterRoleID = '<@&>';

//const raidFileName = "Skill_vendor_loot.txt"
let raidFileName;
let raidDate;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const bot = new Discord.Client();                                                               // Create a Client instance with our bot token.

//const guild = new Discord.Guild()

var hasRaidBegun = true; // TODO : This value was changed to assist in debugging
//var hasRaidBegun = false;


bot.on('ready', () => {                                                                         // When the bot is connected and ready, log to console.
    console.log('Loot Assistant is connected and ready.');

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
    let firstUser = (msg.mentions.users == null) ? null : msg.mentions.users.first()            // enforce null conditions

    let member = new Promise ((resolve, reject) => {
        resolve(guild.members.fetch(firstUser));                                                // don't accept rejections

    });
    //TODO: Officers should only be able to ivnoke item items, anyone should be able to access loot history
    //TODO: Limit the bots access to specific roles
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
        await member.then((values) => {
            let commandUsr = '';                                                                    // the user beind referenced 
            let commandString = '';                                                                 // The items in question

            for(var pos = i+2; pos < args.length; ++pos){                                           // Start at the position in the command list when 
                if(args[pos].startsWith(commandPrefix)) break;                                      // all commands shall start with '~' if they do, it's not an (item)
                commandString += (args[pos]) + ' ';                                                 // append all string literals into an (item)
            } 

            switch(command) {                                                                       // check the valid commands
                
                case "~help":
                case "~h":
                    helpMessage(msg.author);                                                        // display the help message to the invokers private message
                break;
                case "~loot-history":
                case "~lh":
                    if(args[i+2].toLowerCase() == 'all'){
                        if(getClassFromMention(args[i+1]) == null) readPlayer(raidFileName, usr, raidDate, 'all');
                        else readClass(raidFileName, usrClass, raidDate, 'all');
                    }else if (args[i+2] !== null && args[i+2] > 0){
                        if(getClassFromMention(args[i+1]) == null) readPlayer(raidFileName, usr, raidDate, args[i+2]);
                        else readClass(raidFileName, usrClass, raidDate, args[i+2]);
                    }else {
                        if(getClassFromMention(args[i+1]) == null) readPlayer(raidFileName, usr, raidDate, 4);
                        else readClass(raidFileName, usrClass, raidDate, 4);
                    }
                break;
                //////////////////////////// Officer commands /////////////////////////////
                //These commands will have limited access, only officers and programmers may use these commands
                case "~loot": 
                case "~l":
                    var nick = (values.nickname == null) ? null : values.nickname;                          // enforce null conditions
                    if((nick == null)){                                                                     // if the nickname is null, the user doesn't have one
                        commandUsr = firstUser.username;
                    }else{
                        commandUsr = nick;
                }
                    editPlayer(raidFileName, commandUsr, raidDate, commandString, false);
                break;
                case "~retract":
                case "~r":
                    editPlayer(raidFileName, commandUsr, raidDate, commandString, true);
                break;
                case "~~add-player": 
                case "~ap":
                    if(getClassFromMention(args[i+2]) == null) throw 'Can not add a player without a class!'; 
                    else addPlayer(raidFileName, commandUsr, getClassFromMention(args[i+2]));
                break;
                case "~~remove-player": 
                case "~rp":
                    removePlayer(raidFileName, commandUsr);
                break;
    
                case "~attendance":
                case "~a":
                    takeAttendance(raidFileName, commandUsr, raidDate)
                break;
                case "~start-raid":
                    raidDate = args[i+1];
                    throw ('The raid for ' + raidDate + ' has begun. Good luck!');
                break;
                case "~end-raid":
                    let returnString = ('The raid for ' + raidDate + ' has ended.')
                    raidDate = '';
                    throw returnString;
                break;
                case "~create-raid":
                case "~cr":
                case "~c":
                    addDate(raidFileName, args[i+1])
                break;
                case "~delete-raid":
                case "~dr":
                case "~d":
                    removeRaid(raidFileName, args[i+1])
                break;
                case "~set-file":
                    raidFileName = args[i+1];
                    throw ('File set for the bot as ' + raidFileName + ' all operations will be performed on this file unless specified otherwise.');
                break;            
                case "~create-file":
                    createNewFile(args[i+1], userList, classList)
                break;
                case "~backup-file":
                    backupFile(raidFileName, backupFileName)
                break;    
                case "~restore-file":
                    restoreBackup(fileName, backupFileName)
                break;
                case "~delete-file":
                    if(fs.existsSync(args[i+1])){
                        fs.unlink(args[i+1], function (err) {                                                      // delete the previous backup file
                            if (err) throw err;
                            throw 'File: '+ args[i+1] +' has been Deleted.';
                            //console.log('Old Backup File deleted!');
                          });
                    
                    }
                break;
                //////////////////////////// Officer commands /////////////////////////////     
            default: 
            
            }


        
    }).catch((err) => { console.log(err); if(!(err == null)) msg.channel.send(err);});              // Catch any errors or messages, display to the console and the discord bot
    

}});


//TODO: Add all classes for the modern expansion

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
        }else if(msg == shamanRoleID){
            returnClass = 'Shaman';
        }else if(msg == monkRoleID){
            returnClass = 'Monk';
        }else if(msg == deathKnightRoleID){
            returnClass = 'Demon Hunter';
        }else if(msg == demonHunterRoleID){
            returnClass = 'Death Knight';
        }else 
            returnClass = null;
        return returnClass;
    
    }
}

//TODO: Fix help message
function helpMessage (usr){
    usr.send("Hello and thank you for using the Loot Assistant bot.");
    usr.send("The following are a list of commands that may be invoked.");
    usr.send("All commands must start with the control character indicated by '~', without the quotations.");
    usr.send("'~loot' followed by an @user and [item text] will indicate that loot had been given to said user.");
    usr.send("'~add-player' followed by an @user and [item text] will indicate that loot had been given to said user.");
    usr.send("'~remove-player' followed by an @user and [item text] will indicate that loot had been given to said user.");
    usr.send("'~retract' followed by an @user and [item text] will retract the item from the user.");
    usr.send("'~loot-history' followed by an @user or @role will display the loot history for that player or class.");
    usr.send("'~attendance' ");
    usr.send("'~raid-roster' will display the current raid roster.");
    usr.send("'~start-raid' will begin a raid specified by the current date. It must be ended before the day is over." );
    usr.send("'~end-raid' will end the raid specified by the current day. It must be used after the '~start-raid' command was indicated");
    usr.send("Please do not respond to this direct message and good luck in the raid!");
}

/*
function applyLoot (msg, lootString, lootUsr, accessDate, isRetracted=false){
    // lootString may contain the item to retract or give to the player.

    if(isRetracted){                                                                                // is the item being retracted from the document
        //console.log('The Item being removed is ' + lootString)                                    // display the string (item) to the console
        msg.channel.send(msg.author.username + ' has retracted ' + lootString +' from ' + lootUsr); // display the message to discord
        


    }else{                                                                                          // then the item is being applied to the document
        //console.log('The Item being added is ' + lootString)                                      // display the string (item) to the console
        msg.channel.send(msg.author.username + ' has given '+ lootString + ' to ' + lootUsr);       // display the message to discord
       

    }

}

function lootHistory (msg, historyUsr, playerClass, accessDate, isClassFlag=false){
    var historyString = '';                                                                        // The string for the loot item the player receives 


    if(isClassFlag){                                                                                // class mode, has to access all members of the class
        //credentials, callback, callbackString, callbackDate, isWriting =false

    }else{                                                                                          // individual user mode
        //credentials, callback, callbackString, callbackDate, isWriting =false

    }

}
*/

function createNewFile(fileName, userList, classList){
    

    let conjoinUser = '';
    let conjoinClass = '';
    let fileData = '';

    if(!(userList == null)){  
        if(!(userList.length == classList.length))                                                      // Every user MUST have a class
            throw 'Error received: Userlist and Classlist must have the same amount of elements.';
    
        for(let i = 0; i < userList.length; ++i){
            conjoinUser += ','+userList[i].toString();                                   // add all the users into the file
            conjoinClass += ','+classList[i].toString();                                 // every user has a class
        }
        fileData = 'Name' + conjoinUser + '\n' + 'Class' + conjoinClass;
    }else{
        fileData = 'Name,' + '\n' + 'Class,';
    }
  
        fs.writeFile(fileName, fileData, (err) => {
            if(err) throw err;
            //throw 'New Raid file created.'
            //console.log('New File created!')
        })

    throw 'New Raid file created.';
}

function backupFile(fileName, backupFileName){
    if(fs.existsSync(backupFile)){
        fs.unlink(backupFileName, function (err) {                                                      // delete the previous backup file
            if (err) throw err;
            //console.log('Old Backup File deleted!');
          });
    
    }
        fs.copyFile(fileName, backupFileName, (err) => {                                              // copy the file to a backupfile 
            if (err) throw err;
            //console.log('source.txt was copied to destination.txt');
          });

    throw ('Backup stored as ' + backupFileName);

}
function restoreBackup(fileName, backupFileName){

        fs.copyFile(backupFileName, fileName, (err) => {                                              // copy the file to a backupfile 
            if (err) throw err;
            //console.log('source.txt was copied to destination.txt');
          });

    throw (fileName + ' restored from backup ' + backupFileName);

}


function addDate(fileName, raidDate){
    
    let contents = fs.readFileSync(fileName, 'utf8').split('\n')

    let raidArray = [];
    let lineArray = '';

                                                                                                                  // how many cols are there in the file
    for(let elem = 0; elem < contents.length; elem++){                                                            // split the file into an array for parsing
        raidArray.push(contents[elem].split(','));
    }

    for(let find = 0; find < contents.length;++find)

        if(raidArray[find][0] == raidDate)                                                                      // date is already in use
            throw 'Only unique entries may be applied (Raid or date).';


    lineArray += raidDate;
    for(let i = 0; i < raidArray[0].length-1; ++i)
        lineArray += ',' + '{absent}';                                                                          // All players will be assumed absent until attendance is taken

    raidArray.push(lineArray.split(','));

    let fileData = '';
    for(let j = 0; j < raidArray.length; ++j){
        for(let i = 0; i < raidArray[0].length; ++i){
            if(i == raidArray[0].length - 1) fileData += raidArray[j][i].toString();
            else fileData += raidArray[j][i].toString()+',';
        }
        if(!(j == raidArray.length - 1)) fileData += '\n';
    }
        fs.writeFile(fileName, fileData, (err) => {
            if(err) throw err;
            //console.log('New File created!')
        })
    throw ('Raid Applied with attribute : ' + raidDate);
}


function takeAttendance(fileName, usr, accessDate){

    let contents = fs.readFileSync(fileName, 'utf8').split('\n')

    let raidArray = [];
    //let lineArray = '';
    let foundRow = 0, foundCol = 0;
                                                                                                                  // how many cols are there in the file
    for(let elem = 0; elem < contents.length; elem++){                                                            // split the file into an array for parsing
        raidArray.push(contents[elem].split(','));
    }

    for(let find = 0; find < contents.length;++find)
        if(raidArray[find][0] == accessDate){                                                                       // date located
            foundRow = find;
            break;  
        }
    for(let find = 1; find < raidArray[0].length; ++find){
        if(raidArray[0][find] == usr){                                                                                 // user located
            foundCol = find; 
            break;       
        }
    }

    
    if(foundRow == 0 || foundCol == 0)                                                                              // no user or no date
        throw 'Either player or the date attribute can not be located.';

    if(!(raidArray[foundRow][foundCol] == '{absent}'))
        throw 'Attendance has already been taken for this player';
    else
        raidArray[foundRow][foundCol] = '{No Item}';

    let fileData = '';
    for(let j = 0; j < raidArray.length; ++j){
        for(let i = 0; i < raidArray[0].length; ++i){
            if(i == raidArray[0].length - 1) fileData += raidArray[j][i].toString();
            else fileData += raidArray[j][i].toString()+',';
        }
        if(!(j == raidArray.length - 1)) fileData += '\n';
    }

    fs.writeFile(fileName, fileData, (err) => {
        if(err) throw err;
        //console.log('New File created!')
    })

    throw ("Attendance taken for " + usr + " with attribute " + accessDate);
}

// TODO: Test user tag with class tag (Confirm class)
// TODO: If no date, don't occupy with anything
function addPlayer(fileName, usr, usrClass){

    let contents = fs.readFileSync(fileName, 'utf8').split('\n')

    let raidArray = [];
    let tempString = '';
    //let foundRow = 0, foundCol = 0;
                                                                                                                    // how many cols are there in the file

    tempString = contents[0].split(',');
    for(let find = 0; find < tempString.length; ++find){
        if(tempString[find] == usr){
            throw 'Player already exists in this raid roster.' ;
        }
    }
    tempString = contents[0]+','+usr;
    raidArray.push(tempString.split(','));
    tempString = contents[1]+','+usrClass;
    raidArray.push(tempString.split(',')); 

    for(let elem = 2; elem < contents.length; elem++){                                                              // split the file into an array for parsing
        raidArray.push(contents[elem].split(','));
    }
    for(let iter = 2; iter < raidArray.length; ++iter){
        raidArray[iter][raidArray[0].length-1] = '{absent}'
    }
    
    //console.log(raidArray);
    
    let fileData = '';
    for(let j = 0; j < raidArray.length; ++j){
        for(let i = 0; i < raidArray[0].length; ++i){
            if(i == raidArray[0].length - 1) fileData += raidArray[j][i].toString();
            else fileData += raidArray[j][i].toString()+',';
        }
        if(!(j == raidArray.length - 1)) fileData += '\n';
    }
    //console.log(fileData);
    fs.writeFile(fileName, fileData, (err) => {
        if(err) throw err;
        //console.log('New File created!')
    })
    throw (usr + " has been added to the roster, with class " + usrClass);

}

function editPlayer(fileName, usr, accessDate, playerItem, isRetracted=false){

    let contents = fs.readFileSync(fileName, 'utf8').split('\n')

    if(playerItem == null)
        throw 'Loot can not be applied to a player without an item.';

    let raidArray = [];
    let tempArray = [];
    let tempString = '';
    let returnString = '';
    let foundRow = 0, foundCol = 0;                                                                                 // how many cols are there in the file
    let find = 0;                                                                                                   // find locations                                                                                                                   
    let count = 0;

    tempString = contents[0].split(',');
    
    for(find = 0; find < tempString.length; ++find){
        if((tempString[find] == usr)){                                                                             // redundant: but checks for user prior to adding
            break;
        }
    }
    console.log(tempString.length-1);
    if(find == tempString.length)
        throw 'No player located, please add the player prior to editing the loot table.' ;

    for(let elem = 0; elem < contents.length; elem++){                                                              // split the file into an array for parsing
        raidArray.push(contents[elem].split(','));
    }


    for(find = 0; find < contents.length;++find){
        if(raidArray[find][0] == accessDate){                                                                       // date located
            foundRow = find;
            break;  
        }   

    }
    if(find == contents.length)                                                                                     // full epoch, no attribute found
        throw 'No attribute located, can\'t edit loot for a player without a proper raid attribute';                     // no date located

    for(find = 1; find < raidArray[0].length; ++find){
        if(raidArray[0][find] == usr){                                                                              // user located
            foundCol = find; 
        break;       
        }        
                                                                                                                    // only an error if user can't be copied(issue in node.js) to the raidArray
    }

    if(find == raidArray[0].length-1)                                                                               // full epoch, no attribute found
        throw 'No player located, please add the player prior to editing the loot table.' ;                         // no user located
    
    
    if(isRetracted){                                                                                                // remove an item from the player
        if(raidArray[foundRow][foundCol] == '{absent}' || raidArray[foundRow][foundCol] == '{No Item}'){            // the player has no items yet
            returnString = 'There is no item to remove from the player.';                                                                                                                 

        }else{                                                                                                      // the player has an item

                tempArray = raidArray[foundRow][foundCol].replace('{','').replace('}', '').split('/');
                

                for(find = 0; find < tempArray.length; ++find){                                                              // iterate all items assigned to a player
                    
                    if((tempArray[find] == playerItem))
                        break;

                }
                console.log(tempArray[find])
                tempString = '{';
                for(let i = 0; i < tempArray.length; ++i){
                    if(tempArray[i] != tempArray[find]){
                        if((i<tempArray.length-1)) tempString += tempArray[i]+'/';
                        else tempString += tempArray[i];
                    }

                }
                tempString += '}'; 
                raidArray[foundRow][foundCol] = tempString;
                returnString = (playerItem + ' has been removed from ' + usr + ' for the raid ' + accessDate);    
        }

    }else{                                                                                                          // GIVE ITEM MODE
        if(raidArray[foundRow][foundCol] == '{absent}' || raidArray[foundRow][foundCol] == '{No Item}'){            // the player has no items yet

            raidArray[foundRow][foundCol] = '{'+playerItem+'}';                                                                                              
            returnString = (playerItem + ' has been given to ' + usr + ' for the raid ' + accessDate);
        }else{                                                                                                      // the player has an item

            tempArray = raidArray[foundRow][foundCol].replace('{','').replace('}', '').split('/');
            tempString = '{';

            for(let j = 0; j < tempArray.length; ++j){                                                              // iterate all items assigned to a player

                if(tempArray[j] == playerItem){
                    throw ( usr + ' already has this item for the raid ' + accessDate);
                }else
                    tempString += tempArray[j]+'/'
            }
            tempString +=  playerItem +'}'; 
            raidArray[foundRow][foundCol] = tempString;
            returnString = (playerItem + ' has been given to ' + usr + ' for the raid ' + accessDate);
        }

    }

    let fileData = '';
    for(let j = 0; j < raidArray.length; ++j){
        for(let i = 0; i < raidArray[0].length; ++i){
            if(i == raidArray[0].length - 1) fileData += raidArray[j][i].toString();
            else fileData += raidArray[j][i].toString()+',';
        }
        if(!(j == raidArray.length - 1)) fileData += '\n';
    }

    fs.writeFile(fileName, fileData, (err) => {
        if(err) throw err;
       console.log('New File created!')
    })
    throw returnString;

}

function readPlayer(fileName, usr, accessDate, amountOfEntries){
    
    let contents = fs.readFileSync(fileName, 'utf8').split('\n')

    let raidArray = [];
    //let tempArray = [];
    let tempString = '';
    let returnString = '';
    let foundRow = 0, foundCol = 0;                                                                                 // how many cols are there in the file
    let find = 0;                                                                                                   // find locations                                                                                                                   
    //let count = 0;
    let entries = 0;

    tempString = contents[0].split(',');
    

    for(find = 0; find < tempString.length; ++find){
        //console.log(find);
        if((tempString[find] == usr)){                                                                              // redundant: but checks for user prior to adding
            break;
        }
    }
    console.log(tempString.length-1);
    if(find == tempString.length)
        throw 'No player located, please add the player prior to requesting the loot table.' ;

    for(let elem = 0; elem < contents.length; elem++){                                                              // split the file into an array for parsing
        raidArray.push(contents[elem].split(','));
    }


    for(find = 0; find < contents.length;++find){
        if(raidArray[find][0] == accessDate){                                                                       // date located
            foundRow = find;
            break;  
        }   

    }
    console.log('foundRow is ' + foundRow) // REMOVE
    console.log('raid Array length' + raidArray.length)

            
    if(find == contents.length)                                                                                     // full epoch, no attribute found
        throw 'No raid located, can\'t edit loot for a player without a proper raid attribute';                // no date located


    if(foundRow-1 < amountOfEntries)
    throw 'Unable to fetch that many entries. There are not enough raids for that request.' ;

    if(amountOfEntries == 'all')
        entries = foundRow-1;                                                                                       // the amount of dates there are in the file
    else entries = amountOfEntries;   
    console.log('amountofentries is ' + amountOfEntries); // REMOVE

    for(find = 1; find < raidArray[0].length; ++find){
        if(raidArray[0][find] == usr){                                                                              // user located
            foundCol = find; 
        break;       
        }        
                                                                                                                    // only an error if user can't be copied(issue in node.js) to the raidArray
    }

    if(find == raidArray[0].length-1)                                                                               // full epoch, no attribute found
        throw 'No player located, please add the player prior to editing the loot table.' ;                         // no user located

    returnString = 'The loot history for ' + usr + " is as follows: \n";
    //if()
    for(let back = foundRow; back >  (foundRow-entries); --back){          //TODO: ERROR -- On some entries it only displays one or nothing                                                     // count back from date entries and display the
        //if(back<=1) break;
        //if(back == foundRow-entries) break;
        returnString += 'Date: ' + raidArray[back][0] + ' with item(s) ' + raidArray[back][foundCol].replace('{','').replace('}', '').split('/').join(', ') + '\n';
    }
    
    
        throw returnString;
}

function readClass(fileName, usrClass, accessDate, amountOfEntries){
    
    let contents = fs.readFileSync(fileName, 'utf8').split('\n')

    let raidArray = [];
    let classArray = [];
    let tempString = '';
    let returnString = '';
    let foundRow = 0, foundCol = 0;                                                                                 // how many cols are there in the file
    let find = 0;                                                                                                   // find locations                                                                                                                   
    //let count = 0;
    let entries = 0;

    tempString = contents[1].split(',');
    

    for(find = 0; find < tempString.length; ++find){
        //console.log(find);
        if((tempString[find] == usrClass)){                                                                         // redundant: but checks for user prior to adding
            classArray.push(find);                                                                                  // append all the locations of the class into the arrya
        }
    }
    console.log(tempString.length-1);
    if(classArray.length == 0)
        throw 'No players with that class specified.' ;

    for(let elem = 0; elem < contents.length; elem++){                                                              // split the file into an array for parsing
        raidArray.push(contents[elem].split(','));
    }


    for(find = 0; find < contents.length;++find){
        if(raidArray[find][0] == accessDate){                                                                       // date located
            foundRow = find;
            break;  
        }   

    }

    if(find == contents.length)                                                                                     // full epoch, no attribute found
        throw 'No raid located, can\'t edit loot for a player without a proper raid attribute';                // no date located

    if(foundRow-1 < amountOfEntries)
        throw 'Unable to fetch that many entries. There are not enough raids for that request.' ;

    if(amountOfEntries == 'all')
        entries = foundRow-1;                                                                                       // the amount of dates there are in the file
    else entries = amountOfEntries;   

    console.log("entries is " + entries); // REMVOE
    console.log('raidArray.length is ' + raidArray.length) // REMOVE
    console.log('foundRow is ' + foundRow) // REMOVE

    if(find == raidArray[0].length-1)                                                                               // full epoch, no attribute found
        throw 'No player located, please add the player prior to editing the loot table.' ;                         // no user located
    
    returnString = 'The loot history for ' + usrClass + " is as follows: \n";

    for(let col of classArray){
        console.log("first for loop"); //REMOVE
        for(let back = foundRow; back >  (foundRow-entries); --back){                                 // count back from date entries and display the
            console.log("Second for loop"); //REMOVE
            returnString += raidArray[0][col] + ' Date: ' + raidArray[back][0] + ' with item(s) ' + raidArray[back][col].replace('{','').replace('}', '').split('/').join(', ') + '\n';
        }
    }
    
        throw returnString;
}

function removePlayer(fileName, usr){
    
}
function removeRaid(fileName, accessDate){
    
}


bot.on('error', err => {
   console.warn(err);
});

bot.login(botToken);                                                                                                // connects the bot to the discord server.
