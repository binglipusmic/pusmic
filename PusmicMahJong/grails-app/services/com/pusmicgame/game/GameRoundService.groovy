package com.pusmicgame.game

import com.pusmicgame.domain.MessageDomain
import grails.transaction.Transactional

@Transactional
class GameRoundService {

    def getJoinPopeleCount(MessageDomain messageDomain) {

        def peopeleCount=0
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        if (onlineRoomNumber) {
            GameRound gameRound = onlineRoomNumber.gameRound
            if (gameRound) {
                //check the user count if already full

                GameMode gameMode=gameRound.gameMode
                peopeleCount=gameMode.gamePeopleNumber.toInteger()
            }
        }
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
        return peopeleCount
    }

    def getPopeleCountForJoinRoom(MessageDomain messageDomain){

        def p1=getJoinPopeleCount(messageDomain)
        def p2=currentGameRoundPeopeCount(messageDomain)
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

    def serviceMethod() {

    }
}
