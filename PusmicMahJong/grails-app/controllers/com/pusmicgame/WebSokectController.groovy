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
    def paiService

    @MessageMapping("/user_private_message")
    protected String user_private_message(String message,@Headers Map<String, Object> headers){
        //println "userResiveMessage:@@@@@@@@@@@@@@@@@@@@@@@@:${message}"
        MessageDomain messageJsonObj=JSON.parse(message);
       // println "userResiveMessage:"+messageJsonObj.messageAction
        //closeGameRoundLun
        if(messageJsonObj.messageAction.equals("joinRoom")){
            def flag=gameRoundService.checkGameRoomExist(messageJsonObj)
            if(flag){
                //join already exist room
                def paiStr= userService.joinExitRoom(messageJsonObj)
                println ("paiStr:"+paiStr)
                MessageDomain newMessageObj=new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber=messageJsonObj.messageBelongsToPrivateChanleNumber
                newMessageObj.messageAction ="joinExistRoom"
                newMessageObj.messageBody = paiStr
                newMessageObj.messageType ="gameAction"
                def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s2)

            }else {

                // println gameRoundService.getPopeleCountForJoinRoom(messageJsonObj)
                if (gameRoundService.getPopeleCountForJoinRoom(messageJsonObj).equals("!")) {

                    messageJsonObj = userService.joinNoExistRoom(messageJsonObj)
                    /*    def s2 = JsonOutput.toJson(messageJsonObj)
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)*/
                } else {


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
        }
        if(messageJsonObj.messageAction.equals("userReadyStatuChange")){

            messageJsonObj=userService.changeUserStatus(messageJsonObj)
            def s = new JsonBuilder(messageJsonObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s)
            //check the all user if all already done
            def faPaiFlag= userService.checkAllUserStatus(messageJsonObj)
            println ("faPaiFlag:"+faPaiFlag)
            if(faPaiFlag){
               def paiStr= paiService.faPai(messageJsonObj)
                println ("paiStr:"+paiStr)
                MessageDomain newMessageObj=new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber=messageJsonObj.messageBelongsToPrivateChanleNumber
                newMessageObj.messageAction ="faPai"
                newMessageObj.messageBody = paiStr
                newMessageObj.messageType ="gameAction"
                def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s2)
                println ("s2:"+s2)
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

        //huan san Zhang
        if(messageJsonObj.messageAction.equals("userHuanSanZhang")){
            def flag=userService.setHuanSanZhang(messageJsonObj)

          /*  MessageDomain newMessageObj=new MessageDomain()
            newMessageObj.messageBelongsToPrivateChanleNumber=messageJsonObj.messageBelongsToPrivateChanleNumber
            newMessageObj.messageAction ="HuanSanZhangResult"
            newMessageObj.messageBody = flag
            newMessageObj.messageType ="gameAction"
            def s2 = new JsonBuilder(newMessageObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s2)*/

            if(flag.equals("true")){

                def paiStr= paiService.huanSanZhangFaPai(messageJsonObj)
                MessageDomain newMessageObj=new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber=messageJsonObj.messageBelongsToPrivateChanleNumber
                newMessageObj.messageAction ="huanSanZhangFaPai"
                newMessageObj.messageBody = paiStr
                newMessageObj.messageType ="gameAction"
                def  s2 = new JsonBuilder(newMessageObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s2)
            }
        }

        //quepai only send

        if(messageJsonObj.messageAction.equals("sendQuePai")){
            userService.updateQuePaiForUser(messageJsonObj)
          //  updateQuePaiForUser
            def obj = JSON.parse(messageJsonObj.messageBody)
            def s = new JsonBuilder(messageJsonObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s)
            println "obj.quePaiCount.toString():"+obj.quePaiCount.toString()
            println "obj.peopleCount.toString():"+obj.peopleCount.toString()
            if(obj.quePaiCount.toString().equals(obj.peopleCount.toString())){
                messageJsonObj.messageAction="zhuangJiaChuPai"
                println "zhuangJiaChuPai:"+obj.peopleCount.toString()
                def s2 = new JsonBuilder(messageJsonObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s2)
            }else{

            }
           // messageJsonObj.messageAction="zhuangJiaChuPai"
           // def s3 = new JsonBuilder(messageJsonObj).toPrettyString()
           // websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s3)
           // messageJsonObj.messageAction="zhuangJiaChuPai"
            println "zhuangJiaChuPai1:"+obj.peopleCount.toString()




        }

        //--------------------Game Action-----------------------
        if(messageJsonObj.messageAction.equals("gameAction")){



            def obj = JSON.parse(messageJsonObj.messageBody)
            if(obj.actionName=="chuPai"){
                gameStepService.gameStep(messageJsonObj)
                def s = new JsonBuilder(messageJsonObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s)


            }else if(obj.actionName=="moPai"){

                //mopai in next user
                obj.paiNumber= paiService.moPai(obj.toUserOpenid,messageJsonObj.messageBelongsToPrivateChanleNumber)
                if(   obj.paiNumber) {
                    obj.actionName = "moPai"
                    //obj.toUserOpenid =obj.nextOpenid
                    obj.fromUserOpenid  ="server"

                    def s2 = new JsonBuilder(obj).toPrettyString()
                    messageJsonObj.messageBody = s2
                    gameStepService.gameStep(messageJsonObj)
                    def s3 = new JsonBuilder(messageJsonObj).toPrettyString()
                    websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s3)
                }else{
                    //liu ju---pai end ,send end game to all user.

                }

            }else {
                def s = new JsonBuilder(messageJsonObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s)

            }

        }


    }

}
