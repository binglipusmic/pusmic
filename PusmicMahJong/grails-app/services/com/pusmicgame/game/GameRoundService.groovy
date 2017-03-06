package com.pusmicgame.game

import com.pusmicgame.domain.MessageDomain
import grails.transaction.Transactional

@Transactional
class GameRoundService {

    def checkGameRoomExist(MessageDomain messageJsonObj){
        def flag=false;
        def roomNumber = messageJsonObj.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        if(gameRound) {
            def openid = messageJsonObj.messageBody;
            gameRound.gameUser.each{gu->
                 if(gu.springUser.openid.equals(openid)){
                     flag=true;
                 }
            }
        }else{
            return flag
        }

        return flag
    }

    def getJoinPopeleCount(MessageDomain messageDomain) {

        def peopeleCount=0
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        if (onlineRoomNumber) {
            GameRound gameRound = onlineRoomNumber.gameRound
            if (gameRound) {
                //check the user count if already full

                GameMode gameMode=gameRound.gameMode
                println "getJoinPopeleCount gameMode:"+gameMode.id
                peopeleCount=gameMode.gamePeopleNumber.toInteger()
            }
        }
        //println "getJoinPopeleCount gameRound:"+gameRound.id
        //println "getJoinPopeleCount:"+peopeleCount
       return peopeleCount
    }

    def currentGameRoundPeopeCount(MessageDomain messageDomain){

        def peopeleCount=0
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        if (onlineRoomNumber) {
            GameRound gameRound = onlineRoomNumber.gameRound
            if (gameRound) {
                def  userList=gameRound.gameUser
                if(userList){
                    peopeleCount=userList.size()
                }else{
                    peopeleCount=0
                }
            }
        }
        println "currentGameRoundPeopeCount:"+peopeleCount
        return peopeleCount
    }

    def getPopeleCountForJoinRoom(MessageDomain messageDomain){

        def p1=getJoinPopeleCount(messageDomain)
        def p2=currentGameRoundPeopeCount(messageDomain)
        if(p1==0 && p2==0){
            return "!"
        }else{
            if(p2<p1){
                return "<"
            }else{
                if(p2==p1){
                    return "="
                }else{
                    return ">"
                }

            }
        }


    }

    def serviceMethod() {

    }
}
