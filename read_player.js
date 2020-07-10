/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: read_player.js
*  Description: Module export function for assistance
*******************************************************************/

const Discord = require('discord.js');    

const fs = require('fs');
require('dotenv').config();

/*******************************************************************
*  readPlayer
*       fileName   : the name of the file no extensions
*       accessDate : the string for the raid date to access no spaces
*       usr        : the user to read from
*       amountOfEntries : how many raid dates to get history from
* This function reads a player from the raid roster. For displaying 
* user information to the discord server.
*******************************************************************/

module.exports = {
    readPlayer: function (fileName, usr, accessDate, amountOfEntries){
        
        if(accessDate == undefined)
            throw 'Date is not specified, please use either create-raid or the set-raid commands in order to continue.'


        let contents = fs.readFileSync(fileName, 'utf8').split('\n')

        let raidArray = [];

        let tempString = '';
        let returnString = '';
        let foundRow = 0, foundCol = 0;                                                                                 // how many cols are there in the file
        let find = 0;                                                                                                   // find locations                                                                                                                   

        let entries = 0;
        let foundUser = false;

        tempString = contents[0].split(',');
        

        for(find = 0; find < tempString.length; ++find){

            if((tempString[find] == usr)){                                                                              // redundant: but checks for user prior to adding
                foundUser = true;
            }
        }

        if(!foundUser)
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

        if(amountOfEntries !== 'all' && amountOfEntries > raidArray.length-1) 
            amountOfEntries = 'all';                                                                                    // if the amount of entries is larger than the file, just get all entries

        if(find == contents.length)                                                                                     // full epoch, no attribute found
            throw 'No raid located, can\'t edit loot for a player without a proper raid attribute';                // no date located

        if(amountOfEntries == 'all')
            entries = foundRow-1;                                                                                       // the amount of dates there are in the file
        else entries = amountOfEntries;   


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

        for(let back = foundRow; back >  (foundRow-entries); --back){                                                   // count back from date entries and display the

            returnString += 'Date: ' + raidArray[back][0] + ' with item(s) ' + raidArray[back][foundCol].replace('{','').replace('}', '').split('/').join(', ') + '\n';
        }
        
        
            throw returnString;
    }
}
