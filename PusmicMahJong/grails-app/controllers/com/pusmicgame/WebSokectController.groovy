package com.pusmicgame

import com.pusmicgame.domain.ActionMessageDomain
import com.pusmicgame.domain.MessageDomain
import grails.converters.JSON
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import org.springframework.messaging.handler.annotation.Headers
import org.springframework.messaging.handler.annotation.MessageMapping

class WebSokectController {

    def userService
    def gameRoundLunService
    def index() { }
    def websokectService
    def gameRoundService
    def gameStepService

    @MessageMapping("/user_private_message")
    protected String user_private_message(String message,@Headers Map<String, Object> headers){
        //println "userResiveMessage:@@@@@@@@@@@@@@@@@@@@@@@@:${message}"
        MessageDomain messageJsonObj=JSON.parse(message);
       // println "userResiveMessage:"+messageJsonObj.messageAction
        //closeGameRoundLun
        if(messageJsonObj.messageAction.equals("joinRoom")){
           // println gameRoundService.getPopeleCountForJoinRoom(messageJsonObj)
            if(gameRoundService.getPopeleCountForJoinRoom(messageJsonObj).equals("!")){

                messageJsonObj = userService.joinNoExistRoom(messageJsonObj)
            /*    def s2 = JsonOutput.toJson(messageJsonObj)
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)*/
            }else {


                if (gameRoundService.getPopeleCountForJoinRoom(messageJsonObj).equals("<")) {
                    messageJsonObj = userService.joinRoom(messageJsonObj)
                   /* def s = JsonOutput.toJson(messageJsonObj)
                    websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)*/
                } else if (gameRoundService.getPopeleCountForJoinRoom(messageJsonObj).equals("=")) {
                    //start fapai
                    messageJsonObj = userService.joinRoom(messageJsonObj)
                } else {
                    //>

                    messageJsonObj = userService.joinFullRoom(messageJsonObj)

                }
            }

            def s2 = JsonOutput.toJson(messageJsonObj)
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
        }
        if(messageJsonObj.messageAction.equals("userReadyStatuChange")){

            messageJsonObj=userService.changeUserStatus(messageJsonObj)
            def s = new JsonBuilder(messageJsonObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s)
            //check the all user if all already done
            def faPaiFlag= userService.checkAllUserStatus(messageJsonObj)
            if(faPaiFlag){

            }
        }
        if(messageJsonObj.messageAction.equals("closeGameRoundLun")){
            gameRoundLunService.closeGameRoundLun(messageJsonObj)

        }
        if(messageJsonObj.messageAction.equals("buildNewRoundLun")){

            messageJsonObj=gameRoundLunService.createNewGameRoundLun(messageJsonObj)
            def s = new JsonBuilder(messageJsonObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s)
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

        //--------------------Game Action-----------------------
        if(messageJsonObj.messageAction.equals("gameAction")){

            gameStepService.gameStep(messageJsonObj)
            def s = new JsonBuilder(messageJsonObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s)

        }


    }

}
