package com.pusmicgame

import com.pusmicgame.domain.ActionMessageDomain
import com.pusmicgame.domain.MessageDomain
import grails.converters.JSON
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import org.springframework.messaging.handler.annotation.Headers
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.simp.SimpMessageHeaderAccessor

class WebSokectController {

    def userService
    def gameRoundLunService

    def index() {}
    def websokectService
    def gameRoundService
    def gameStepService
    def paiService
    def showActionBarService
    def onlineUserService

    @MessageMapping("/user_private_message")
    protected String user_private_message(String message, @Headers Map<String, Object> headers) {
        // println "userResiveMessage:@@@@@@@@@@@@@@@@@@@@@@@@:${message}"
        // if(message) {
        Map<String, Object> sessionHeaders = SimpMessageHeaderAccessor.getSessionAttributes(headers);
        def messageByte = message.decodeBase64()
        message = new String(messageByte)
        println "userResiveMessage:@@@@@@@@@@@@@@@@@@@@@@@@ decode1:${message}"
        MessageDomain messageJsonObj = JSON.parse(message);

        // println "userResiveMessage:"+messageJsonObj.messageAction
        //closeGameRoundLun
        //gameinistal
        //getGameRoundlunScoreCount

         if (messageJsonObj.messageAction.equals("getGameRoundlunScoreCount")) {
             println "getGameRoundlunScoreCount:41"
            def s = gameRoundLunService.getUserScoreCount(messageJsonObj.messageBelongsToPrivateChanleNumber)
            MessageDomain newMessageObj = new MessageDomain()
            newMessageObj.messageBelongsToPrivateChanleNumber = messageJsonObj.messageBelongsToPrivateChanleNumber
            newMessageObj.messageAction = "getGameRoundlunScoreCount"
            newMessageObj.messageBody = s+"1splitCharaPusmicGame1"+messageJsonObj.messageBody
            newMessageObj.messageType = "gameAction"
            def s2 = new JsonBuilder(newMessageObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
        }
        if (messageJsonObj.messageAction.equals("offlineUserKouFen")) {
            userService.kouFenByOpenId(messageJsonObj);
            //sessionHeaders.put("openid",messageJsonObj.messageBody);
            //sessionHeaders.put("roomNumber",messageJsonObj.messageBelongsToPrivateChanleNumber);
        }

        //**************************************************************************************
        if (messageJsonObj.messageAction.equals("gameinistal")) {
            //sessionHeaders.put("openid",messageJsonObj.messageBody);
            sessionHeaders.put("roomNumber",messageJsonObj.messageBelongsToPrivateChanleNumber);
        }

        if (messageJsonObj.messageAction.equals("joinRoom")) {
            //sotre the user info and room info into head of http
            //we still need add a flag ,to decide it is gameing or not gameing
            sessionHeaders.put("openid",messageJsonObj.messageBody);
            sessionHeaders.put("roomNumber",messageJsonObj.messageBelongsToPrivateChanleNumber);


            def flag = gameRoundService.checkGameRoomExist(messageJsonObj)
            if (flag) {
                //join already exist room
                def paiStr = userService.joinExitRoom(messageJsonObj)
                println("paiStr:" + paiStr)
                MessageDomain newMessageObj = new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber = messageJsonObj.messageBelongsToPrivateChanleNumber
                newMessageObj.messageAction = "joinExistRoom"
                newMessageObj.messageBody = messageJsonObj.messageBody
                newMessageObj.messageType = "gameAction"
                def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
                //Fix user online status
                onlineUserService.reJoinRoomFixOnlineUser(messageJsonObj.messageBody)

            } else {
                def gpsStatus = gameRoundService.checkGpsLimit(messageJsonObj)
                // println gameRoundService.getPopeleCountForJoinRoom(messageJsonObj)
                if (gameRoundService.getPopeleCountForJoinRoom(messageJsonObj).equals("!")) {

                    messageJsonObj = userService.joinNoExistRoom(messageJsonObj)
                    /*    def s2 = JsonOutput.toJson(messageJsonObj)
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)*/
                } else {


                    if (gameRoundService.getPopeleCountForJoinRoom(messageJsonObj).equals("<")) {
                        if (gpsStatus == 8 || gpsStatus == 4) {
                            messageJsonObj = userService.joinRoom(messageJsonObj)
                        }else{
                            messageJsonObj = userService.joinGPSLimitRoom(messageJsonObj, gpsStatus)
                            def s2 = JsonOutput.toJson(messageJsonObj)
                            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
                        }
                        /* def s = JsonOutput.toJson(messageJsonObj)
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)*/
                    } else if (gameRoundService.getPopeleCountForJoinRoom(messageJsonObj).equals("=")) {
                        //start fapai
                        //check the gps limit

                        if (gpsStatus == 8 || gpsStatus == 4) {
                            messageJsonObj = userService.joinRoom(messageJsonObj)
                        } else {

                            messageJsonObj = userService.joinGPSLimitRoom(messageJsonObj, gpsStatus)
                            def s2 = JsonOutput.toJson(messageJsonObj)
                            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
                        }
                    } else {
                        //>

                        messageJsonObj = userService.joinFullRoom(messageJsonObj)

                    }
                }

                def s2 = JsonOutput.toJson(messageJsonObj)
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
            }

        }
        if (messageJsonObj.messageAction.equals("userReadyStatuChange")) {

            messageJsonObj = userService.changeUserStatus(messageJsonObj)
            def s = new JsonBuilder(messageJsonObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)
            //check the all user if all already done
            def faPaiFlag = userService.checkAllUserStatus(messageJsonObj)
            println("faPaiFlag:" + faPaiFlag)
            if (faPaiFlag) {
                def paiStr = paiService.faPai(messageJsonObj)
                println("paiStr:" + paiStr)
                MessageDomain newMessageObj = new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber = messageJsonObj.messageBelongsToPrivateChanleNumber
                newMessageObj.messageAction = "faPai"
                newMessageObj.messageBody = paiStr
                newMessageObj.messageType = "gameAction"
                def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
                // println("s2:" + s2)
            }
        }
        if (messageJsonObj.messageAction.equals("closeGameRoundLun")) {
            gameRoundLunService.closeGameRoundLun(messageJsonObj)
            def s2 = new JsonBuilder(messageJsonObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)

        }
        if (messageJsonObj.messageAction.equals("buildNewRoundLun")) {
            def useropendid=gameRoundLunService.getOpenIdFromBuildNewGameRoundLun(messageJsonObj)
            sessionHeaders.put("openid",useropendid);

            sessionHeaders.put("roomNUmber",messageJsonObj.messageBelongsToPrivateChanleNumber);

            if (!gameRoundLunService.checkIfCanBuildNewRoundLun(messageJsonObj)) {
                MessageDomain newMessageObj = new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber = messageJsonObj.messageBelongsToPrivateChanleNumber
                newMessageObj.messageAction = "buildRoundFail"
                newMessageObj.messageBody = "NoEnoughDemond"
                newMessageObj.messageType = "alertFailMessage"

                def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)

            } else {
                messageJsonObj = gameRoundLunService.createNewGameRoundLun(messageJsonObj)
                def s = new JsonBuilder(messageJsonObj).toPrettyString()
                //println "----121:"+s
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)
            }


        }

        if (messageJsonObj.messageAction.equals("buildNewRound")) {
            //GameMode gameMode=(GameMode)JSON.parse(messageJsonObj.me);
            // gameRoundLunService.createNewGameRoundLun(messageJsonObj)
        }

        if (messageJsonObj.messageAction.equals("removeOnlineUser")) {
            //GameMode gameMode=(GameMode)JSON.parse(messageJsonObj.me);
            gameRoundLunService.createNewGameRoundLun(messageJsonObj)
        }
        //updateOnlinUserDateTime

        if (messageJsonObj.messageAction.equals("updateOnlinUserDateTime")) {
            //GameMode gameMode=(GameMode)JSON.parse(messageJsonObj.me);
            println "updateOnlinUserDateTime"
            def openId = messageJsonObj.messageBody
            if (openId) {
                userService.updateOnlineTime(openId)
            }

        }

        //huan san Zhang
        if (messageJsonObj.messageAction.equals("userHuanSanZhang")) {
            def flag = userService.setHuanSanZhang(messageJsonObj)

            /*  MessageDomain newMessageObj=new MessageDomain()
              newMessageObj.messageBelongsToPrivateChanleNumber=messageJsonObj.messageBelongsToPrivateChanleNumber
              newMessageObj.messageAction ="HuanSanZhangResult"
              newMessageObj.messageBody = flag
              newMessageObj.messageType ="gameAction"
              def s2 = new JsonBuilder(newMessageObj).toPrettyString()
              websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s2)*/

            if (flag.equals("true")) {

                def paiStr = paiService.huanSanZhangFaPai(messageJsonObj)
                MessageDomain newMessageObj = new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber = messageJsonObj.messageBelongsToPrivateChanleNumber
                newMessageObj.messageAction = "huanSanZhangFaPai"
                newMessageObj.messageBody = paiStr
                newMessageObj.messageType = "gameAction"
                def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
            }
        }
        //update user location

        if (messageJsonObj.messageAction.equals("updateLocation")) {
            def flag = userService.updateUserLocation(messageJsonObj)
            def obj = JSON.parse(messageJsonObj.messageBody)
            sessionHeaders.put("roomNumber",messageJsonObj.messageBelongsToPrivateChanleNumber);
            sessionHeaders.put("openid",obj.openid);

        }

        //quepai only send

        if (messageJsonObj.messageAction.equals("sendQuePai")) {
            userService.updateQuePaiForUser(messageJsonObj)
            //  updateQuePaiForUser
            def obj = JSON.parse(messageJsonObj.messageBody)
            def s = new JsonBuilder(messageJsonObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)
            println "obj.quePaiCount.toString():" + obj.quePaiCount.toString()
            println "obj.peopleCount.toString():" + obj.peopleCount.toString()
            if (obj.quePaiCount.toString().equals(obj.peopleCount.toString())) {
                messageJsonObj.messageAction = "zhuangJiaChuPai"
                println "zhuangJiaChuPai:" + obj.peopleCount.toString()
                def s2 = new JsonBuilder(messageJsonObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
            } else {

            }
            // messageJsonObj.messageAction="zhuangJiaChuPai"
            // def s3 = new JsonBuilder(messageJsonObj).toPrettyString()
            // websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s3)
            // messageJsonObj.messageAction="zhuangJiaChuPai"
            println "zhuangJiaChuPai1:" + obj.peopleCount.toString()


        }
        //-------------------Audio message----------------------
        //sendMp3Message
        if (messageJsonObj.messageAction.equals("sendMp3Message")) {
            def obj = JSON.parse(messageJsonObj.messageBody);
            def audioMessage = obj.audioMessage
            def userCode = obj.userCode
            audioMessage.replaceAll("\r", "")
            audioMessage.replaceAll("\n", "")



            MessageDomain newMessageObj = new MessageDomain()
            newMessageObj.messageBelongsToPrivateChanleNumber = messageJsonObj.messageBelongsToPrivateChanleNumber
            newMessageObj.messageAction = "playMp3Message"
            newMessageObj.messageBody = audioMessage
            newMessageObj.messageType = userCode
            def s2 = new JsonBuilder(newMessageObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
        }

        //------send MESSAGE------------------------------------
        //sendMessageToUser
        if (messageJsonObj.messageAction.equals("sendMessageToUser")) {
            def s = new JsonBuilder(messageJsonObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)
        }
        if (messageJsonObj.messageAction.equals("sendMessage")) {
            def s = new JsonBuilder(messageJsonObj).toPrettyString()
            websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)
        }
        //--------------------Game Action-----------------------
        if (messageJsonObj.messageAction.equals("gameAction")) {


            def obj = JSON.parse(messageJsonObj.messageBody)
            if (obj.actionName == "chuPai") {
                gameStepService.gameStep(messageJsonObj)
                def s = new JsonBuilder(messageJsonObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)
                println "chupai ********"


            } else if (obj.actionName == "moPai") {

                //mopai in next user
                obj.paiNumber = paiService.moPai(obj.toUserOpenid, messageJsonObj.messageBelongsToPrivateChanleNumber)
                println "195:" + obj.paiNumber
                if (obj.paiNumber) {
                    obj.actionName = "moPai"
                    //obj.toUserOpenid =obj.nextOpenid
                    obj.fromUserOpenid = "server"

                    def s2 = new JsonBuilder(obj).toPrettyString()
                    messageJsonObj.messageBody = s2
                    gameStepService.gameStep(messageJsonObj)
                    def s3 = new JsonBuilder(messageJsonObj).toPrettyString()
                    websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s3)
                } else {
                    //liu ju---pai end ,send end game to all user.

                    //check if the round already comple the count for the game lun.
                    //No complet---start a new game round
                    //comple ----end this game lun
                    def s3
                    if (gameRoundLunService.checkGameRounDone(messageJsonObj)) {
                        messageJsonObj.messageAction = "endGameRoundLun"
                        s3 = new JsonBuilder(messageJsonObj).toPrettyString()
                        websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s3)
                    } else {
                        messageJsonObj.messageAction = "endGameRoundAndStartNewRound"
                        s3 = new JsonBuilder(messageJsonObj).toPrettyString()
                        websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s3)
                    }

                    println "222 s3:" + s3

                }
//huPai
            } else if (obj.actionName == "huPai") {
                def executeNextStepFlag=false;
                //if it is have other action
                if(obj.needWaitOhterUser=="needWaitOther"){
                    //removet this action from showActionBar SQL db.
                    def allActionDoneFlag=showActionBarService.handelHuAcion(obj)
                    if(allActionDoneFlag){
                        executeNextStepFlag=true
                    }else{
                        executeNextStepFlag=false;
                    }

                }else{
                    executeNextStepFlag=true
                }

                obj.executeNextStepFlag=executeNextStepFlag
                //check if end this round
                //show hu pai for other user
                messageJsonObj.messageBody=new JsonBuilder(obj).toPrettyString()
                gameStepService.gameStep(messageJsonObj)
                def s = new JsonBuilder(messageJsonObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)



                //save hupai number into Count of round
             //   def huPaiCount=gameRoundService.saveHuPaiNumberIntoGameRound(messageJsonObj)

                //check if it round end
               // if(gameRoundService.checkGameRoundEnd(messageJsonObj,huPaiCount)){
                    //send game round end

               // }else{
                    //send mo pai on nextUser

   //             }
//





//checkRoundEnd
            } else if (obj.actionName == "checkRoundEnd") {
                //this should check the lun round if end
                if (gameRoundLunService.checkGameRounDone(messageJsonObj)) {
                    messageJsonObj.messageAction = "endGameRoundLun"
                    def s2 = new JsonBuilder(messageJsonObj).toPrettyString()
                    websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
                } else {
                    //start a new round
                    def currentRoundCount = gameRoundLunService.createNewGameRound(messageJsonObj,obj.zhuangOpenId)
                    if (currentRoundCount != -1) {
                        MessageDomain newMessageObj = new MessageDomain()
                        newMessageObj.messageBelongsToPrivateChanleNumber = messageJsonObj.messageBelongsToPrivateChanleNumber
                        newMessageObj.messageAction = "setCurrentRoundCount"
                        newMessageObj.messageBody = currentRoundCount
                        newMessageObj.messageType = "gameAction"
                        def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                        websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
                    }


                    messageJsonObj.messageAction = "endGameRoundAndStartNewRound"
                    def s3 = new JsonBuilder(messageJsonObj).toPrettyString()
                    websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s3)

                }

                //startNewRound

            } else if (obj.actionName == "startNewRound") {
                def currentRoundCount = gameRoundLunService.createNewGameRound(messageJsonObj)
                if (currentRoundCount != -1) {
                    MessageDomain newMessageObj = new MessageDomain()
                    newMessageObj.messageBelongsToPrivateChanleNumber = messageJsonObj.messageBelongsToPrivateChanleNumber
                    newMessageObj.messageAction = "setCurrentRoundCount"
                    newMessageObj.messageBody = currentRoundCount
                    newMessageObj.messageType = "gameAction"
                    def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                    websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s2)
                }
//                    messageJsonObj.messageAction="endGameRoundLun"
//                    def s3 = new JsonBuilder(messageJsonObj).toPrettyString()
//                    websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s3)

//
//                def paiStr= userService.joinExitRoom(messageJsonObj)
//                println ("paiStr:"+paiStr)
//                MessageDomain newMessageObj=new MessageDomain()
//                newMessageObj.messageBelongsToPrivateChanleNumber=messageJsonObj.messageBelongsToPrivateChanleNumber
//                newMessageObj.messageAction ="joinExistRoom"
//                newMessageObj.messageBody = paiStr
//                newMessageObj.messageType ="gameAction"
//
//                def s2 = new JsonBuilder(newMessageObj).toPrettyString()
//                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber,s2)
            } else if (obj.actionName == "saveRoundScore") {

                gameRoundService.saveRoundScore(obj, messageJsonObj.messageBelongsToPrivateChanleNumber)
                if (gameRoundLunService.checkGameRounDone(messageJsonObj)) {

                } else {

                }
//showActionBar
            } else if (obj.actionName == "showActionBar") {

                def s = new JsonBuilder(messageJsonObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)

            } else if (obj.actionName == "cancleAction") {

                //check if it already have other action in the SQL table
                // No exist other ,send mopai
                //Exist other ,send other showActionBar .

                def executeNextStepFlag=false;
                //if it is have other action
                if(obj.needWaitOhterUser=="needWaitOther"){
                    //removet this action from showActionBar SQL db.
                    def allActionDoneFlag=showActionBarService.handelHuAcion(obj)
                    if(allActionDoneFlag){
                        executeNextStepFlag=true
                    }else{
                        executeNextStepFlag=false;
                    }

                }else{
                    executeNextStepFlag=true
                }

                obj.executeNextStepFlag=executeNextStepFlag
                //check if end this round
                //show hu pai for other user
                messageJsonObj.messageBody=new JsonBuilder(obj).toPrettyString()
                //gameStepService.gameStep(messageJsonObj)

                def s = new JsonBuilder(messageJsonObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)
//allShowActionBar
            }else if (obj.actionName == "allShowActionBar") {
                //store all show Action into

            } else {

                println "send no recongnize action"
                gameStepService.gameStep(messageJsonObj)
                def s = new JsonBuilder(messageJsonObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(messageJsonObj.messageBelongsToPrivateChanleNumber, s)

            }

        }


    }

}
