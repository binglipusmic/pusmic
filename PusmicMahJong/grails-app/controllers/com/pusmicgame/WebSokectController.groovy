package com.pusmicgame

import com.pusmicgame.domain.MessageDomain
import grails.converters.JSON
import org.springframework.messaging.handler.annotation.Headers
import org.springframework.messaging.handler.annotation.MessageMapping

class WebSokectController {

    def userService
    def gameRoundLunService
    def index() { }

    @MessageMapping("/user_private_message")
    protected String user_private_message(String message,@Headers Map<String, Object> headers){
        println "userResiveMessage:@@@@@@@@@@@@@@@@@@@@@@@@:${message}"
        MessageDomain messageJsonObj=JSON.parse(message);
        println "userResiveMessage:"+messageJsonObj.messageAction
        //closeGameRoundLun
        if(messageJsonObj.messageAction.equals("closeGameRoundLun")){
            gameRoundLunService.closeGameRoundLun(messageJsonObj)

        }
        if(messageJsonObj.messageAction.equals("buildNewRoundLun")){

            gameRoundLunService.createNewGameRoundLun(messageJsonObj)
        }

        if(messageJsonObj.messageAction.equals("buildNewRound")){
            //GameMode gameMode=(GameMode)JSON.parse(messageJsonObj.me);
           // gameRoundLunService.createNewGameRoundLun(messageJsonObj)
        }

        if(messageJsonObj.messageAction.equals("removeOnlineUser")){
            //GameMode gameMode=(GameMode)JSON.parse(messageJsonObj.me);
            gameRoundLunService.createNewGameRoundLun(messageJsonObj)
        }
        //updateOnlinUserDateTime

        if(messageJsonObj.messageAction.equals("updateOnlinUserDateTime")){
            //GameMode gameMode=(GameMode)JSON.parse(messageJsonObj.me);
            println "updateOnlinUserDateTime"
           def openId=messageJsonObj.messageBody
            if(openId){
                userService.updateOnlineTime(openId)
            }

        }

    }

}
