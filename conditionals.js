
const Discord = require('discord.js');  

require('dotenv').config();
module.exports = {
    onlyOfficer: function (msg){
                if(!(msg.member.roles.cache.has(process.env.officerRoleID)     ||
                    msg.member.roles.cache.has(process.env.programmerRoleID)   ||
                    msg.member.roles.cache.has(process.env.guildMasterRoleID)  ||
                    msg.member.roles.cache.has(process.env.classLeaderRoleID)
                    )) 
                    throw 'Only a user with an Officer role may use these commands.'
    }
}