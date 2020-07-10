/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: add_date.js
*  Description: Module export function for assistance
*******************************************************************/

const Discord = require('discord.js');    
const fs = require('fs');
require('dotenv').config();

/*******************************************************************
*  addDate 
*       fileName : the name of the file no extensions
*       raidDate : the string for the raid date no spaces
* This function adds the raid date into the file(raid roster)
* it would be used whenever a new raid is created.
*******************************************************************/

module.exports = {
    addDate: function (fileName, raidDate){
        
        
        let contents = fs.readFileSync(fileName, 'utf8').split('\n')

        let raidArray = [];
        let lineArray = '';

                                                                                                                        // how many cols are there in the file
        for(let elem = 0; elem < contents.length; elem++){                                                              // split the file into an array for parsing
            raidArray.push(contents[elem].split(','));
        }

        for(let find = 0; find < contents.length;++find)

            if(raidArray[find][0] == raidDate)                                                                          // date is already in use
                throw 'Only unique entries may be applied (Raid or date).';


        lineArray += raidDate;
        for(let i = 0; i < raidArray[0].length-1; ++i)
            lineArray += ',' + '{absent}';                                                                              // All players will be assumed absent until attendance is taken

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
            })
        throw ('Raid added to the roster with attribute : ' + raidDate);
    }
}