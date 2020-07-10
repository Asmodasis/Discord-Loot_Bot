/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: bot_file.js
*  Description: Module export function for assistance
*******************************************************************/

const fs = require('fs');
require('dotenv').config();



module.exports = {


/*******************************************************************
*  createNewFile
*       fileName        : The name of the file 
*       userList        : Any users to add to the file
*       classList       : Any classes to add to the file, 
*                               needed if userList is used
* This function creates a new file for the raid roster  
*******************************************************************/
    createNewFile: function(fileName, userList, classList){
        

        let conjoinUser = '';
        let conjoinClass = '';
        let fileData = '';

        if(!(userList == null)){  
            if(!(userList.length == classList.length))                                                                  // Every user MUST have a class
                throw 'Error received: Userlist and Classlist must have the same amount of elements.';
        
            for(let i = 0; i < userList.length; ++i){
                conjoinUser += ','+userList[i].toString();                                                              // add all the users into the file
                conjoinClass += ','+classList[i].toString();                                                            // every user has a class
            }
            fileData = 'Name' + conjoinUser + '\n' + 'Class' + conjoinClass;
        }else{
            fileData = 'Name' + '\n' + 'Class';
        }
    
            fs.writeFile(fileName, fileData, (err) => {
                if(err) throw err;
            })

        throw 'New Raid file has been created created as '+ fileName +' also set for the lifespan of the bot.\nNo need to run set-file.';
    },

/*******************************************************************
*  backupFile
*       fileName        : The file name to backup
*       backupFileName  : The filename of the backup
* This function makes a backup for the raid roster.
*******************************************************************/

    backupFile: function (fileName, backupFileName){
        if(fs.existsSync(backupFileName)){
            fs.unlink(backupFileName, (err) => {                                                                  // delete the previous backup file
                if (err) throw err;
            });
        
        }
            fs.copyFile(fileName, backupFileName, (err) => {                                                            // copy the file to a backupfile 
                if (err) throw err;
            });

        throw ('Backup stored as ' + backupFileName);

    },

/*******************************************************************
*  restoreBackup
*       fileName        : The file name to backup
*       backupFileName  : The filename of the backup
* This function restores a backup for the raid roster.
*******************************************************************/

    restoreBackup: function (fileName, backupFileName){

            fs.copyFile(backupFileName, fileName, (err) => {                                                            // copy the file to a backupfile 
                if (err) throw err;
            });

        throw (fileName + ' restored from backup ' + backupFileName);

    }
};
