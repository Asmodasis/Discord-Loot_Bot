/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: remove_player.js
*  Description: Module export function for assistance
*******************************************************************/

const fs = require('fs');
require('dotenv').config();

/*******************************************************************
*  removePlayer
*       fileName        : The name of the file
*       usr             : The user being removed
* This function removes a player from the file (raid roster)
*******************************************************************/

module.exports = {
    removePlayer: function (fileName, usr){
        
        let contents = fs.readFileSync(fileName, 'utf8').split('\n')

        if(usr == undefined)
            throw 'Can not remove a player without specifying whom.';

        let raidArray = [];
        let tempString = '';
        let foundCol = 0;                                                                                               // how many cols are there in the file
        let find = 0;                                                                                                   // find locations                                                                                                                   


        tempString = contents[0].split(',');
        
        for(find = 0; find < tempString.length; ++find){
            if((tempString[find] == usr)){                                                                             // redundant: but checks for user prior to adding
                break;
            }
        }
        if(find == tempString.length)
            throw 'No player located, unable to remove.' ;

        for(let elem = 0; elem < contents.length; elem++){                                                              // split the file into an array for parsing
            raidArray.push(contents[elem].replace('\n','').replace('\r','').split(','));
        }


        for(find = 1; find < raidArray[0].length; ++find){
            if(raidArray[0][find] == usr){                                                                              // user located
                foundCol = find; 
            break;       
            }        
                                                                                                                        // only an error if user can't be copied(issue in node.js) to the raidArray
        }

        if(find == raidArray[0].length-1)                                                                               // full epoch, no attribute found
            throw 'No player located, unable to remove.' ;                                                              // no user located
        

        let fileData = '';
        for(let j = 0; j < raidArray.length-1; ++j){
            for(let i = 0; i < raidArray[0].length; ++i){
                if(i !== foundCol){
                    if(i == raidArray[0].length - 1) fileData += raidArray[j][i].toString();
                    else fileData += raidArray[j][i].toString()+',';
                }
            }
            if(!(j == raidArray.length - 1)) fileData += '\n';
        }

        fs.writeFile(fileName, fileData, (err) => {
            if(err) throw err;
        })
        throw (usr + ' has been removed from the raid roster.');

    }
}