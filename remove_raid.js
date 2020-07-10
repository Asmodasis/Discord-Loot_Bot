/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: remove_raid.js
*  Description: Module export function for assistance
*******************************************************************/
const fs = require('fs');
require('dotenv').config();

/*******************************************************************
*  removeRaid
*       fileName : the name of the file no extensions
*       accessDate : the string for the raid date to access no spaces
* This function deletes a raid from the file (raid roster)
*******************************************************************/

module.exports = {
    removeRaid: function (fileName, accessDate){
        
        let contents = fs.readFileSync(fileName, 'utf8').split('\n')

        if(accessDate == undefined)
            throw 'Can not remove a raid without a proper raid attribute';

        let raidArray = [];

        let foundRow = 0;                                                                                               // how many cols are there in the file
        let find = 0;                                                                                                   // find locations                                                                                                                   


        for(let elem = 0; elem < contents.length; elem++){                                                              // split the file into an array for parsing
            raidArray.push(contents[elem].replace('\n','').replace('\r','').split(','));
        }
    

        for(find = 0; find < contents.length;++find){
            if(raidArray[find][0] == accessDate){                                                                       // date located
                foundRow = find;
                break;  
            }   

        }
        if(find == contents.length)                                                                                     // full epoch, no attribute found
            throw 'No attribute located, can\'t edit loot for a player without a proper raid attribute';                // no date located

        let fileData = '';
        for(let j = 0; j < raidArray.length; ++j){ 
            if(foundRow == raidArray.length - 1){
                if(!(j == foundRow)){
                    for(let i = 0; i < raidArray[0].length; ++i){
                        
                            if(i == raidArray[0].length - 1) fileData += raidArray[j][i].toString();
                            else fileData += raidArray[j][i].toString()+',';
                        
                    }

                    if(!((j == raidArray.length - 2))) fileData += '\n';
                }
            }else
            if(!(j == foundRow)){
                for(let i = 0; i < raidArray[0].length; ++i){
                    
                        if(i == raidArray[0].length - 1) fileData += raidArray[j][i].toString();
                        else fileData += raidArray[j][i].toString()+',';
                    
                }
                if(!((j == raidArray.length - 1))) fileData += '\n';
            }
        }

        fs.writeFile(fileName, fileData, (err) => {
            if(err) throw err;
        })
        throw ('The raid ' + accessDate + ' has been removed from the raid history.');  
    }
}