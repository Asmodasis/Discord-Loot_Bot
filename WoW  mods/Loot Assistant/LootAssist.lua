-- Author: Shawn Ray
-- Title: Loot Assistant


-- Generate Frame
-- the frame needs to hold the buttons and messages,

-- Generate Buttons
-- the buttons need to  export raid and guild information and take attendance 


local frame=CreateFrame("Frame");                                                               -- Need a frame to capture events
frame:RegisterEvent("CHAT_MSG_RAID");                                                           -- Register our event

frame:SetScript("OnEvent",
   function(self,event,msg)                                                                     -- OnEvent handler receives event triggers
      if event=="CHAT_MSG_RAID" --and showToolTip(msg) then                                     -- Someone sends an item in raid then
      then findLink(msg)
         --SendChatMessage("TEST}","RAID");                                                     -- Send message through raid
      end
end);

--local gameFrame=CreateFrame("GameTooltip");

function findLink(msg) 
        
        local link = nil                                                                        -- the location of the hyperlink

        for item in split(msg, " ")  do                                                         -- split the message by the spaces
                if string.find(item, "|h|r") then                                               -- find a portion of the hypertext
                        link = item                                                             -- if it is found, the item is a link
                        break
                end
        end

                                                                                                -- extract all information from the hyperlink
        --local itemName, itemLink, itemRarity, itemLevel, itemMinLevel, itemType, itemSubType, itemStackCount,
         --               itemEquipLoc, itemIcon, itemSellPrice, itemClassID, itemSubClassID, bindType, expacID, itemSetID, 
         --               isCraftingReagent 
        --        = GetItemInfo(link) 

        if link ~= nil then
                SendChatMessage("{TEST} ITEM DETECTED as :" + link,"RAID");       
        else
                SendChatMessage("{TEST} NO ITEM DETECTED","RAID");
        end

end