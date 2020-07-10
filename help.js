/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: help.js
*  Description: Module export function for assistance
*******************************************************************/

const fs = require('fs');
require('dotenv').config();

/*******************************************************************
*  helpMessage
*       usr     : The user that the bot will message
* This function messages a user with the help message, with instructions
*   on how to use this bot.
*******************************************************************/

module.exports = {
    helpMessage: function (usr){
        usr.send(         (("Hello and thank you for using the Loot Assistant bot.")
                    +'\n'+("The following are a list of commands that may be invoked.")
                    +'\n'+("All commands must start with the control character indicated by " + process.env.commandPrefix)
                    +'\n'+("'"+process.env.commandPrefix+"loot-history' @user [options] will display the loot history for that user specified by the options, \n\t'all' for all the history or '#' for the amount of entries or 'all' if number is too high.")
                    +'\n'+("'"+process.env.commandPrefix+"loot-history' @class [options] will display the loot history for the whole class")
                    +'\n'+("The following commands will require officer permissions to use. Please refer to the README if you have further questions.")
                    +'\n'+("'"+process.env.commandPrefix+"loot' @user [item text] will give [item text] to that user: alternative command "+process.env.commandPrefix+"l")
                    +'\n'+("'"+process.env.commandPrefix+"retract' @user [item text] will remove [item text] from that user: alternative command "+process.env.commandPrefix+"r")
                    +'\n'+("'"+process.env.commandPrefix+"add-player' @user @class will add the player to the raid roster, their class tag must be included: alternative command "+process.env.commandPrefix+"ap")
                    +'\n'+("'"+process.env.commandPrefix+"remove-player' @user will remove the player from the raid roster, class tag is not needed here: alternative command "+process.env.commandPrefix+"rp") )
                    +'\n'+("'"+process.env.commandPrefix+"attendance' @user will make the player present for the specified raid. If an item is given to the player, attendance is already taken: alternative command "+process.env.commandPrefix+"a")
                );
        usr.send(         (("'"+process.env.commandPrefix+"set-raid' [raid date] will set the current raid for operations. Only needed when modifying existing raids: alternative command "+process.env.commandPrefix+"sr")
                    +'\n'+("'"+process.env.commandPrefix+"what-raid' will display the currently set raid: alternative command "+process.env.commandPrefix+"wr")
                    +'\n'+("'"+process.env.commandPrefix+"create-raid' [raid date] will create a new raid field in the roster, this will also set the raid for operations: alternative command "+process.env.commandPrefix+"cr or "+process.env.commandPrefix+"c")
                    +'\n'+("'"+process.env.commandPrefix+"delete-raid' [raid date] will delete the raid field from the roster, once this is done, you can not retrieve it back except from restore-file command.")
                    +'\n'+("'"+process.env.commandPrefix+"set-file' [file_name] with no extensions. Will set the file for the operations to performed on. Only needed when changing files or starting up the bot")
                    +'\n'+("'"+process.env.commandPrefix+"what-file' will tell you what file the bot is working with.")
                    +'\n'+("'"+process.env.commandPrefix+"create-file' [file_name] with no extensions. will create a new empty file for operations, must add players. ")
                    +'\n'+("'"+process.env.commandPrefix+"backup-file' will backup the currently set file as a backup. It is recommmended that you backup regularly.")
                    +'\n'+("'"+process.env.commandPrefix+"restore-file' will restore a file from an existing backup, this must be done AFTER a backup operation is performed.")
                    +'\n'+("'"+process.env.commandPrefix+"delete-file' [file_name] Warning: once a file is deleted, it is gone forever. Do at your own risk.")
                    +'\n'+("Please do not respond to this direct message and good luck in the raid!") )
                );
    }
}