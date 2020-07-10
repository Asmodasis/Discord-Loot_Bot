/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: take_attendance.js
*  Description: Module export function for assistance
*******************************************************************/

const fs = require('fs');
require('dotenv').config();

/*******************************************************************
*  takeAttendance
*       fileName    : The name of the file 
*       usr         : The user in question
*       accessDate  : The raid date where modifications occur
* This function takes attendance for the user mentioned.
*******************************************************************/

module.exports = {
    takeAttendance: function (fileName, usr, accessDate){

        if(accessDate == undefined)
            throw 'Date is not defined, please either use create-raid or the ~set-raid commands in order to continue.'

        let contents = fs.readFileSync(fileName, 'utf8').split('\n')

        let raidArray = [];

        let foundRow = 0, foundCol = 0;
                                                                                                                    // how many cols are there in the file
        for(let elem = 0; elem < contents.length; elem++){                                                          // split the file into an array for parsing
            raidArray.push(contents[elem].split(','));
        }

        for(let find = 0; find < contents.length;++find)
            if(raidArray[find][0] == accessDate){                                                                   // date located
                foundRow = find;
                break;  
            }
        for(let find = 1; find < raidArray[0].length; ++find){
            if(raidArray[0][find] == usr){                                                                          // user located
                foundCol = find; 
                break;       
            }
        }

        
        if(foundRow == 0)
            throw 'No date located! Unable to take attendance.';
        if(foundCol == 0)                                                                              
            throw 'That player is not in the roster. Please add-player first.';

        if((raidArray[foundRow][foundCol] == '{absent}'))
            raidArray[foundRow][foundCol] = '{No Item}';
        else
            throw 'Attendance has already been taken for this player';

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

        throw ("Attendance taken for " + usr + " for the raid " + accessDate);
    }
}