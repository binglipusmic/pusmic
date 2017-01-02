package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser
import grails.converters.JSON
import grails.transaction.Transactional
import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.mahjong.Utils
import org.grails.web.json.JSONObject

@Transactional
class GameRoundLunService {
    def myUtils=new Utils()

    def closeGameRoundLun(MessageDomain messageDomain){
        def roomNumber=messageDomain.messageBody
        if(roomNumber){
            def r=GameRoomNumber.findByRoomNumber(roomNumber)
            if(r){
                GameRound gameRound=r.gameRound
                r.gameRound=null
                r.save(flush: true, failOnError: true)
                if(gameRound){
                    println gameRound.gameRoundLun.class.simpleName
                    GameRoundLun gameRoundLun=gameRound.gameRoundLun
                    ArrayList uList = new ArrayList()
                    uList.add(gameRoundLun)
                    /*def springUserList=SpringUser.findAllByGameRoundLun(uList)
                    if(springUserList){
                        springUserList.each {
                            SpringUser u=(SpringUser)it
                            u.removeFromGameRoundLun(gameRoundLun)
                        }
                    }*/
                    if(gameRoundLun){
                       def id= gameRoundLun.id
                        gameRoundLun.removeFromGameRound(gameRound)
                        GameRoundLun gu=GameRoundLun.get(id)
                        if(gu){
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

    def createNewGameRoundLun(MessageDomain messageDomain){
        //1. parse the game mode
        def obj=JSON.parse(messageDomain.messageBody)

        def userOpenid=obj.userOpenId
        def gameModeJsonObj=obj.gameMode
        def roomNumber =messageDomain.messageBelongsToPrivateChanleNumber
        //2. create a new game round lun

        SpringUser user=SpringUser.findByOpenid(userOpenid)
        if(user){

            //create a new GameMode
            GameMode gameMode=new GameMode()
            //JSONObject.getProperties()


            println "gameModeJsonObj:${gameModeJsonObj.getProperties()}--"+gameModeJsonObj.ziMoJiaDi
            gameModeJsonObj.clazz.getProperties().each { key, value ->
                println "${key}------${value}"
            }
            myUtils.copyProperties(gameModeJsonObj,gameMode)

            gameMode.save(flush: true, failOnError: true)

            println "roomNumber:"+roomNumber

            GameRoomNumber gRoomNumber=GameRoomNumber.findByRoomNumber(roomNumber)

            def gameRoundLun=new GameRoundLun()
            gameRoundLun.startTime=new Date()
           // gameRoundLun.addToUsers(user)
            //gameRoundLun.user=user
            gameRoundLun.gameMode=gameMode
            gameRoundLun.save(flush: true, failOnError: true)
            user.addToGameRoundLun(gameRoundLun)
            //gameRoundLun.gameRound=gRoomNumber
            //create a new Game Round
            GameRound gameRound=new GameRound()
            gameRound.startTime=new Date()
            gameRound.gameMode=gameMode
            gameRound.gameRoundLun=gameRoundLun
            gameRound.roomNumber=gRoomNumber

            GameUser gu=new GameUser()
            gu.springUser=user
            gu.save(flush: true, failOnError: true)
            gameRound.addToGameUser(gu)
            gameRound.save(flush: true, failOnError: true)

            //save the gameround lun
            gameRoundLun.addTo("gameRound",gameRound)
            gameRoundLun.save(flush: true, failOnError: true)

            //update the room number



            gRoomNumber.gameRound=gameRound
            gRoomNumber.save(flush: true, failOnError: true)

        }


    }


}
