/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: edit_player.js
*  Description: Module export function for assistance
*******************************************************************/

const fs = require('fs');
require('dotenv').config();

/*******************************************************************
*  editPlayer
*       fileName        : The name of the file
*       usr             : The user of which is to be edited
*       accessDate      : The editing date in questions
*       playerItem      : The item to either add or remove 
*       isRetracted     : Whether the item is being given or removed
* This function is used to edit a player in the roster, which means
*   to either add or remove an item from a player.
*******************************************************************/

module.exports = {
    editPlayer: function (fileName, usr, accessDate, playerItem, isRetracted=false){
        
        if(accessDate == undefined)
            throw 'Date is not defined, please either use create-raid or the set-raid commands in order to continue.'

        let contents = fs.readFileSync(fileName, 'utf8').split('\n')

        if(playerItem == null)
            throw 'Loot can not be applied to a player without an item.';

        playerItem = playerItem.trim();                                                                                // trim off the edged whitespace

        let raidArray = [];
        let tempArray = [];
        let tempString = '';
        let returnString = '';
        let foundRow = 0, foundCol = 0;                                                                                 // how many cols are there in the file
        let find = 0;                                                                                                   // find locations 
        let foundFlag = false;                                                                                                                  

        tempString = contents[0].split(',');
        
        for(find = 0; find < tempString.length; ++find){
            if((tempString[find] == usr)){                                                                             // redundant: but checks for user prior to adding
                break;
            }
        }

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
            throw 'No attribute located, can\'t edit loot for a player without a proper raid attribute';                // no date located

        for(find = 1; find < raidArray[0].length; ++find){
            if(raidArray[0][find] == usr){                                                                              // user located
                foundCol = find; 
            break;       
            }        
                                                                                                                        // only an error if user can't be copied(issue in node.js) to the raidArray
        }

        if(foundCol == raidArray[0].length)                                                                             // full epoch, no attribute found
            throw 'No player located, please add the player prior to editing the loot table.' ;                         // no user located
        
        
        if(isRetracted){                                                                                                // remove an item from the player
            if(raidArray[foundRow][foundCol] == '{absent}' || raidArray[foundRow][foundCol] == '{No Item}'){            // the player has no items yet
                returnString = 'There is no item to remove from the player.';                                                                                                                 

            }else if (raidArray[foundRow][foundCol] == '{'+playerItem+'}'){                                             // only Item they have
                raidArray[foundRow][foundCol] = '{No Item}';
                returnString = (playerItem + ' has been removed from ' + usr + ' for the raid ' + accessDate);
            }else{                                                                                                      // the player has an item

                    tempArray = raidArray[foundRow][foundCol].replace('{','').replace('}', '').split('/');
                    

                    for(find = 0; find < tempArray.length; ++find){                                                     // iterate all items assigned to a player
                        
                        if((tempArray[find] == playerItem)){
                            foundFlag = true;
                            break;
                        }
                            

                    }
                    if(!foundFlag)
                        throw 'That item is not assigned to that player, it can not be removed.';

                    tempString = '{';

                    for(let firstHalf = 0; firstHalf < find; ++firstHalf){
                        tempString += tempArray[firstHalf] + '/';
                    }

                    for(let secondHalf = find+1; secondHalf < tempArray.length; ++secondHalf){
                        if((secondHalf<tempArray.length-1)) tempString += tempArray[secondHalf] + '/';
                        else tempString += tempArray[secondHalf];
                    }

                    tempString += '}'; 
                    raidArray[foundRow][foundCol] = tempString;
                    returnString = (playerItem + ' has been removed from ' + usr + ' for the raid ' + accessDate);    
            }

        }else{                                                                                                          // GIVE ITEM MODE
            if(raidArray[foundRow][foundCol] == '{absent}' || raidArray[foundRow][foundCol] == '{No Item}'|| raidArray[foundRow][foundCol] == '{}'){ 
                                                                                                                        // the player has no items yet

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
        })
        throw returnString;

    }
}