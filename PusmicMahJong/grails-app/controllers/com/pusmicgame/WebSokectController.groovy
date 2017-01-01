package com.pusmicgame

import com.pusmicgame.domain.MessageDomain
import grails.converters.JSON
import org.springframework.messaging.handler.annotation.MessageMapping

class WebSokectController {

    def userService
    def gameRoundLunService
    def index() { }

    @MessageMapping("/userResiveMessage")
    protected String user_resive_message(String message){

        MessageDomain messageJsonObj=(MessageDomain)JSON.parse(message);


        if(messageJsonObj.messageAction.equals("buildNewRoundLun")){

        }

        if(messageJsonObj.messageAction.equals("buildNewRound")){
            //GameMode gameMode=(GameMode)JSON.parse(messageJsonObj.me);
            gameRoundLunService.createNewGameRoundLun(messageJsonObj)
        }

        if(messageJsonObj.messageAction.equals("removeOnlineUser")){
            //GameMode gameMode=(GameMode)JSON.parse(messageJsonObj.me);
            gameRoundLunService.createNewGameRoundLun(messageJsonObj)
        }
        //updateOnlinUserDateTime

        if(messageJsonObj.messageAction.equals("updateOnlinUserDateTime")){
            //GameMode gameMode=(GameMode)JSON.parse(messageJsonObj.me);
            def openId=messageJsonObj.messageBody
            if(openId){
                userService.updateOnlineTime(openId)
            }

        }

    }

}
