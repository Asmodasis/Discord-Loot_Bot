/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: read_class.js
*  Description: Module export function for assistance
*******************************************************************/

const fs = require('fs');
require('dotenv').config();

/*******************************************************************
*  readClass
*       fileName        :   The name of the file
*       usrClass        :   The class we are mentioning 
*       accessDate      :   The raid date where operations start
*       amountOfEntries :   The amount of raid dates from accessDate
* This function reads the loot history for a mentioned class, starting
*   from accessDate and iterating into amountOfEntries from accessDate
*******************************************************************/

module.exports = {
    readClass: function (fileName, usrClass, accessDate, amountOfEntries){
        
        if(accessDate == undefined)
            throw 'Date is not defined, please either use ~create-raid or the set-raid commands in order to continue.'

        if(usrClass == undefined)
            throw 'Class is not specified, please try that command again with the class tag.'


        let contents = fs.readFileSync(fileName, 'utf8').split('\n')

        let raidArray = [];
        let classArray = [];
        let tempString = '';
        let returnString = '';
        let foundRow = 0, foundCol = 0;                                                                                 // how many cols are there in the file
        let find = 0;                                                                                                   // find locations                                                                                                                   

        let entries = 0;

        tempString = contents[1].split(',');
        

        for(find = 0; find < tempString.length; ++find){

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

        if(amountOfEntries !== 'all' && amountOfEntries > raidArray.length-1) 
            amountOfEntries = 'all';                                                                                    // if the amount of entries is larger than the file, just get all entries

        if(find == contents.length)                                                                                     // full epoch, no attribute found
            throw 'No raid located, can\'t edit loot for a player without a proper raid attribute';                     // no date located

        if(amountOfEntries == 'all')
            entries = foundRow-1;                                                                                       // the amount of dates there are in the file
        else entries = amountOfEntries;   

        if(find == raidArray[0].length-1)                                                                               // full epoch, no attribute found
            throw 'No player located, please add the player prior to editing the loot table.' ;                         // no user located
        
        returnString = 'The loot history for ' + usrClass + " is as follows: \n";

        for(let col of classArray){

            for(let back = foundRow; back >  (foundRow-entries); --back){                                               // count back from date entries and display the

                returnString += raidArray[0][col] + ' Date: ' + raidArray[back][0] + ' with item(s) ' + raidArray[back][col].replace('{','').replace('}', '').split('/').join(', ') + '\n';
            }
        }
        
            throw returnString;
    }
}