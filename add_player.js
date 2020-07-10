/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: add_player.js
*  Description: Module export function for assistance
*******************************************************************/

const fs = require('fs');
require('dotenv').config();

/*******************************************************************
*  addPlayer
*       filename    : The name of the file to read from 
*       usr         : The user we wish to add to the roster
*       usrClass    : The class of the user we wish to add (I.E. Priest)
*
* This function adds a player and a class to the file (raid roster)
*******************************************************************/

module.exports = {
    addPlayer: function (fileName, usr, usrClass){


        let contents = fs.readFileSync(fileName, 'utf8').split('\n')

        let raidArray = [];
        let tempString = '';
   
        if(usr == undefined)                                                                                            // If no user, end
            throw 'Player not specified, please try again.';

        tempString = contents[0].split(',');                                                                            // Check the for the existance of a user
        for(let find = 0; find < tempString.length; ++find){
            if(tempString[find] == usr){
                throw 'Player already exists in this raid roster.' ;
            }
        }
        tempString = '';

        tempString = contents[0].replace('\n','').replace('\r','')+','+usr;                                             // add the new user with their class
        raidArray.push(tempString.split(','));                                                                          // to the existing player base
        tempString = contents[1].replace('\n','').replace('\r','')+','+usrClass;
        raidArray.push(tempString.split(','));                                                                                  


        if(contents.length >= 2)
            for(let elem = 2; elem < contents.length; elem++){                                                         // split the file into an array for parsing
                raidArray.push((contents[elem].replace('\n','').replace('\r','')+',{absent}').split(',') );
            }
            console.log(raidArray)
        let fileData = '';
        for(let j = 0; j < raidArray.length; ++j){
            for(let i = 0; i < raidArray[0].length; ++i){
                if(i == raidArray[0].length - 1) fileData += raidArray[j][i].toString();
                else fileData += raidArray[j][i].toString()+',';
            }
            if(!(j == raidArray.length - 1)) fileData += '\n';
        }
        console.log(fileData)
        fs.writeFile(fileName, fileData, (err) => {
            if(err) throw err;

        })
        throw (usr + " has been added to the roster, with class " + usrClass);

    }
}