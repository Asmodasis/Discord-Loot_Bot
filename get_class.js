/*******************************************************************
*  Author:   Shawn Ray 
*  Date:     7/9/2020
*  Github:   https://github.com/Asmodasis
*  Discord:  https://discord.js.org/#/
*  Filename: get_class.js
*  Description: Module export function for assistance
*******************************************************************/

const Discord = require('discord.js');                                                          // The class client for connecting a bot to discord.                             

require('dotenv').config();

/*******************************************************************
*  getClassFromMention
*       msg         : The message to check for the class mention
* This function returns the class label when given a message
* Discord sends the role tag, so this gives a name to the tag
*******************************************************************/

module.exports = {
    getClassFromMention: function (msg, bot) {
        if (!msg) return;
        var returnClass = '';      
        
        if (bot.users.cache.get(msg) == undefined){
            if(msg == process.env.priestRoleID){
                returnClass = 'Priest';
            }else if(msg == process.env.warriorRoleID){
                returnClass = 'Warrior';
            }else if(msg == process.env.druidRoleID){
                returnClass = 'Druid';
            }else if(msg == process.env.mageRoleID){
                returnClass = 'Mage';
            }else if(msg == process.env.warlockRoleID){
                returnClass = 'Warlock';
            }else if(msg == process.env.hunterRoleID){
                returnClass = 'Hunter';
            }else if(msg == process.env.rogueRoleID){
                returnClass = 'Rogue';
            }else if(msg == process.env.paladinRoleID){
                returnClass = 'Paladin';
            }else if(msg == process.env.shamanRoleID){
                returnClass = 'Shaman';
            }else if(msg == process.env.monkRoleID){
                returnClass = 'Monk';
            }else if(msg == process.env.deathKnightRoleID){
                returnClass = 'Demon Hunter';
            }else if(msg == process.env.demonHunterRoleID){
                returnClass = 'Death Knight';
            }else 
                returnClass = null;
            return returnClass;
        
        }
    }
}