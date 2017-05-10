package com.pusmicgame.game

import com.pusmic.game.mahjong.OnlineUser
import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.domain.OnlinUserPlatObj
import grails.transaction.Transactional
import groovy.json.JsonBuilder

@Transactional
class OnlineUserService {

    def websokectService
    def serviceMethod() {

    }


    def offlineUser(roomNUmber){

        OnlineUser onlineUser=OnlineUser.findByRoomNumber(roomNUmber)
        if(onlineUser){
            OnlinUserPlatObj onlinUserPlatObj=new OnlinUserPlatObj()
            onlinUserPlatObj.roomNumber=roomNUmber
            onlinUserPlatObj.onlineStau=onlineUser.onlineStau
            onlinUserPlatObj.springUserNickName=onlineUser.springUser.nickname
            onlinUserPlatObj.springUserOpenId=onlineUser.springUser.openid
            def s = new JsonBuilder(onlinUserPlatObj).toPrettyString()
            if(onlineUser.onlineStau==1){
                //push message to client

                MessageDomain newMessageObj = new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber = roomNUmber
                newMessageObj.messageAction = "userOffline"
                newMessageObj.messageBody = s
                newMessageObj.messageType = "userOffline"
                def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(roomNUmber, s2)

                onlineUser.delete(flush: true, failOnError: true)


            }else if(onlineUser.onlineStau==2){
                MessageDomain newMessageObj = new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber = roomNUmber
                newMessageObj.messageAction = "userOffline"
                newMessageObj.messageBody = s
                newMessageObj.messageType = "userOffline"
                def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(roomNUmber, s2)

            }else if(onlineUser.onlineStau==0){

                onlineUser.delete(flush: true, failOnError: true)

            }

            //if the online statu is 0 just remove this ,other status still need remove it


        }

    }
}
