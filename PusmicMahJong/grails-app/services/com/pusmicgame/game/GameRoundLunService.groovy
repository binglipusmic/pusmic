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
                                // println "line 61 springuser:"+springUser.id
                                springUser.removeFromGameRoundLun(gu)
                                if (springUser.gameRoundLun) {
                                    springUser.gameRoundLun.each { u ->
                                        def gameRoundL = GameRoundLun.get(u.id)
                                        if (gameRoundL) {
                                            springUser.removeFromGameRoundLun(gameRoundL)
                                        }
                                    }
                                }
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

        SpringUser user = SpringUser.findByOpenid(userOpenid)
        OnlineUser onlineUser=OnlineUser.findBySpringUser(user)
        GameUserPlatObj outputUser =new GameUserPlatObj()
        if (user) {

            //create a new GameMode
            GameMode gameMode = new GameMode()
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
            gameRoundLun.save(flush: true, failOnError: true)
            println "line 120:"
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
            gu.save(flush: true, failOnError: true)
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
            //outputUser.headImageFileName=user.headImageFileName
        }

        messageDomain.messageBody= new JsonBuilder(outputUser).toPrettyString()
        return messageDomain

    }


}
