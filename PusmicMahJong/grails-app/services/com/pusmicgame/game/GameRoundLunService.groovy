package com.pusmicgame.game

import com.pusmic.game.mahjong.OnlineUser
import com.pusmic.game.mahjong.SpringUser
import com.pusmicgame.domain.GameUserPlatObj
import grails.converters.JSON
import grails.transaction.Transactional
import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.mahjong.Utils
import groovy.json.JsonBuilder
import org.grails.web.json.JSONObject

@Transactional
class GameRoundLunService {
    def myUtils = new Utils()
    def userService
    def gameRoundService
    def closeGameRoundLun(MessageDomain messageDomain) {
        def roomNumber = messageDomain.messageBody
        if (roomNumber) {
            def r = GameRoomNumber.findByRoomNumber(roomNumber)
            if (r) {
                GameRound gameRound = r.gameRound
                r.gameRound = null
                r.save(flush: true, failOnError: true)
                if (gameRound) {
                    println gameRound.gameRoundLun.class.simpleName
                    GameRoundLun gameRoundLun = gameRound.gameRoundLun
                    def userList = gameRoundLun.users

                    /*def springUserList=SpringUser.findAllByGameRoundLun(uList)
                    if(springUserList){
                        springUserList.each {
                            SpringUser u=(SpringUser)it
                            u.removeFromGameRoundLun(gameRoundLun)
                        }
                    }*/
                    if (gameRoundLun) {
                        def id = gameRoundLun.id
                        GameRoundLun gu = GameRoundLun.get(id)
                        def gameRoundList = gameRoundLun.gameRound
                        if (gameRoundList) {
                            gameRoundList.each { gm ->
                                gameRoundLun.removeFromGameRound(gameRound)

                                def gmId = gm.id
                                def gRound = GameRound.get(gmId)
                                //static hasMany = [gameScore:GameScore, gameStep:GameStep, gameUser:GameUser]

                                if (gm.gameUser) {
                                    gm.gameUser.each { gUser ->
                                        gm.removeFromGameUser(gUser)
                                        //gameRoundLun.removeFromUsers(gUser)
                                        //gUser.delete(flush: true, failOnError: true)
                                    }
                                }
                                //gRound.delete(flush: true, failOnError: true)

                            }
                        }

                        if (userList) {
                            userList.each { springUser ->
                                 println "line 61 springuser:"+springUser.id
                                springUser.removeFromGameRoundLun(gu)
//                                if (springUser.gameRoundLun) {
//                                    if(springUser.gameRoundLun.size()>0) {
//                                        springUser.gameRoundLun.each { u ->
//                                            if (u) {
//                                                println "gameLun:"+u.id
//                                                def gameRoundL = GameRoundLun.get(u.id)
//                                                if (gameRoundL) {
//                                                    springUser.removeFromGameRoundLun(gameRoundL)
//                                                }
//                                            }
//                                        }
//                                    }
//                                }
                                springUser.save(flush: true, failOnError: true)
                                // println "line 64: "+springUser.gameRoundLun.size()
                                gu.removeFromUsers(springUser)
                                gu.save(flush: true, failOnError: true)

                            }
                        }

                        println "GameRoundLun id:" + id

                        if (gu) {
                            gu.delete(flush: true, failOnError: true)
                        }
                    }


                }
            }
        }

    }

    def serviceMethod(MessageDomain messageDomain) {

    }

    def checkGameRounDone(MessageDomain messageDomain){
        def flag=false;
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber
        if (roomNumber) {
            def r = GameRoomNumber.findByRoomNumber(roomNumber)
            if (r) {
                GameRound gameRound = r.gameRound
                if(gameRound){
                    GameRoundLun gameRoundLun = gameRound.gameRoundLun
                    if(gameRoundLun){
                        def gameMode=gameRoundLun.gameMode
                        def modeCount=0

                        if(gameMode.roundCount8){
                            if(gameMode.roundCount8.toString()=="1"){
                                modeCount=8
                            }
                        }
                        if(gameMode.roundCount4){
                            if(gameMode.roundCount4.toString()=="1"){
                                modeCount=4
                            }
                        }
                        def currentCountRound=gameRoundLun.currentRoundCount
                        if(!currentCountRound){
                            currentCountRound=0
                        }
                        if(currentCountRound!=0)
                        if(currentCountRound==modeCount){
                            flag=true;
                        }
                    }
                }

            }
        }

        println ("checkGameRounDone:"+flag)

        return flag

    }

    def checkIfCanBuildNewRoundLun(MessageDomain messageDomain){
        def obj = JSON.parse(messageDomain.messageBody)

        def userOpenid = obj.userOpenId
        def gameModeJsonObj = obj.gameMode
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber
        def needDemon=0;
        if(gameModeJsonObj.roundCount4+""=="1"){
            needDemon=2
        }

        if(gameModeJsonObj.roundCount8+""=="1"){
            needDemon=3
        }


        SpringUser user = SpringUser.findByOpenid(userOpenid)
        println "gameModeJsonObj:"+obj.gameMode.toString()
        println "user.diamondsNumber:"+user.diamondsNumber
        println "user.needDemon:"+needDemon

        if(user.diamondsNumber>=needDemon){
            return true
        }else{
            return false
        }

    }

    /**
     *  o.userOpenId=userInfo.openid;
     o.gameMode=messageObj
     * @param messageDomain
     */

    def createNewGameRoundLun(MessageDomain messageDomain) {
        //1. parse the game mode
        def obj = JSON.parse(messageDomain.messageBody)

        def userOpenid = obj.userOpenId
        def gameModeJsonObj = obj.gameMode
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber
        //2. create a new game round lun
        println "userOpenid:${userOpenid}"
        SpringUser user = SpringUser.findByOpenid(userOpenid)
        GameUserPlatObj outputUser =new GameUserPlatObj()
        OnlineUser onlineUser
        GameMode gameMode
        try {
            if (user) {
                onlineUser=OnlineUser.findBySpringUser(user)

                //create a new GameMode
                gameMode= new GameMode()
                //JSONObject.getProperties()


                println "gameModeJsonObj:${gameModeJsonObj.getProperties()}--" + gameModeJsonObj.ziMoJiaDi

                myUtils.copyProperties(gameModeJsonObj, gameMode)

                gameMode.save(flush: true, failOnError: true)

                //println "roomNumber:"+roomNumber

                GameRoomNumber gRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)

                def gameRoundLun = new GameRoundLun()
                gameRoundLun.startTime = new Date()
                gameRoundLun.addToUsers(user)
                //gameRoundLun.user=user
                gameRoundLun.gameMode = gameMode
                gameRoundLun.currentRoundCount=1;
                gameRoundLun.save(flush: true, failOnError: true)
                println "line 222:"
                user.addToGameRoundLun(gameRoundLun)
                //gameRoundLun.gameRound=gRoomNumber
                //create a new Game Round
                GameRound gameRound = new GameRound()
                gameRound.startTime = new Date()
                gameRound.gameMode = gameMode
                gameRound.gameRoundLun = gameRoundLun
                gameRound.roomNumber = gRoomNumber

                GameUser gu = new GameUser()
                gu.springUser = user
                //gu.gameRound=gameRound
                gu.gameReadyStatu="0"
                gu.gameRoundScore=0
                gu.gameScoreCount=1000
                gu.publicIp=onlineUser.publicIPAddress
                gu.joinRoundTime=new Date()
                gu.headImageFileName=user.headImageFileName
                gu.zhuang="1"
                gu.save(flush: true, failOnError: true)
                println "line 243:"
                //println "line 133:"
                gameRound.addToGameUser(gu)
                gameRound.save(flush: true, failOnError: true)
                gu.gameRound=gameRound
                gu.save(flush: true, failOnError: true)
                //println "line 136:"
                //save the gameround lun
                gameRoundLun.addTo("gameRound", gameRound)
                gameRoundLun.save(flush: true, failOnError: true)

                //update the room number


                gRoomNumber.gameRound = gameRound
                gRoomNumber.save(flush: true, failOnError: true)
                println "line 259:"
                outputUser.id=user.id
                outputUser.nickName=user.nickname
                outputUser.openid=user.openid
                outputUser.headimgurl=user.headimgurl
                outputUser.unionid=user.unionid
                outputUser.userCode=user.userCode
                outputUser.publicIp=onlineUser.publicIPAddress
                outputUser.paiList=gu.paiList.toString()
                outputUser.gameRoundScore=gu.gameRoundScore
                outputUser.gameScoreCount=gu.gameScoreCount
                outputUser.gameReadyStatu=gu.gameReadyStatu
                outputUser.headImageFileName=gu.headImageFileName
                //outputUser.headImageFileName=user.headImageFileName
                println "line 273:"
                //add game count
    //            if(user.gameCount){
    //                user.gameCount=user.gameCount+1
    //            }else{
    //                user.gameCount=1
    //            }
    //            user.save(flush: true, failOnError: true)

                //test reduce domonad------
                //gameRoundService.updateScoreAndWinCountAndPushToClient(user,messageDomain.messageBelongsToPrivateChanleNumber)
                //test-----end -----
            }
        } catch (ex) {
            println ex.message
            println ex.printStackTrace()
        }



        messageDomain.messageBody= new JsonBuilder(outputUser).toPrettyString()
        return messageDomain

    }

    /**
     * This method will create a new game round and add it to correct game round lun
     * @param messageDomain
     */

    def createNewGameRound(MessageDomain messageDomain) {
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber
        int currentRoundCount=-1;
        if(roomNumber){
            println "roomNumber:"+roomNumber
            GameRoomNumber gRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)

            if(gRoomNumber){
                println "gRoomNumber:"+gRoomNumber.id
                //we must get the game round from GameRoomNumber domain class, because the many round maybe work no the one room number.
                GameRound gameRound=gRoomNumber.gameRound
                println "gameRound:"+gameRound.id
                if(gameRound){
                    //check if we need build a new round------------------------
                    boolean checkFlag=false
                    if(gameRound.restPaiList==null){
                        //checkFlag=true;
                    }else{
                        if(gameRound.restPaiList.size()==0){
                            checkFlag=true;
                        }
                    }
                    int huPaiUserCount=0
                    gameRound.gameUser.each { gu ->
                        if(gu.roundScoreCount!=0 ||gu.huPaiDetails.length()>0){
                            huPaiUserCount++
                        }
                    }

                    if(huPaiUserCount>0){
                        if(huPaiUserCount== gameRound.gameUser.size()-1){
                            checkFlag=true;
                        }
                    }

                    //----------end check -------------------------------------


                   if(checkFlag==true) {
                       GameRoundLun gameRoundLun = gameRound.gameRoundLun
                       if (gameRoundLun) {
                           GameRound gameRound2 = new GameRound()
                           gameRound2.startTime = new Date()
                           gameRound2.gameMode = gameRound.gameMode
                           gameRound2.gameRoundLun = gameRoundLun
                           gameRound2.roomNumber = gRoomNumber
                           gameRound2.restPaiList=[13,15,34,23,35]
                           println "260:" + gameRound.id
                           println "260:" + gameRound.gameUser.size()
                           gameRound.gameUser.each { gu ->
                               GameUser newgu = new GameUser()
                               //println "262:"+newgu.springUser.openid


                               newgu.gameScoreCount = 0
                               newgu.gameReadyStatu = "0"
                               newgu.gameRoundScore = 0
                               newgu.joinRoundTime = new Date()
                               newgu.huPai = ""
                               newgu.huPaiType = ""
                               newgu.huanSanZhang = ""
                               newgu.quePai = ""
                               newgu.roundScoreCount = 0;
                               newgu.huPaiDetails = "";
                               newgu.springUser = gu.springUser;
                               newgu.publicIp = gu.publicIp;

                               newgu.save(flush: true, failOnError: true)
                               gameRound2.addToGameUser(newgu)
                               gameRound2.save(flush: true, failOnError: true)
                               newgu.gameRound = gameRound2
                               newgu.save(flush: true, failOnError: true)
                               //gameRound2.save(flush: true, failOnError: true)

                               def user=gu.springUser
                               if(user.gameCount){
                                   user.gameCount=user.gameCount+1
                               }else{
                                   user.gameCount=2
                               }
                               user.save(flush: true, failOnError: true)
                           }

                           // gameRound2.gameUser=gameRound.gameUser
                           gameRound2.save(flush: true, failOnError: true)
                           gameRoundLun.addTo("gameRound", gameRound2)
                           gameRoundLun.currentRoundCount=gameRoundLun.currentRoundCount+1;
                           currentRoundCount= gameRoundLun.currentRoundCount;
                           gameRoundLun.save(flush: true, failOnError: true)

                           gRoomNumber.gameRound = gameRound2
                           gRoomNumber.save(flush: true, failOnError: true)

                           //
                       }
                   }
                }
            }

        }

        return currentRoundCount

    }


}
