package com.pusmicgame.game

import com.pusmicgame.domain.MessageDomain
import grails.converters.JSON
import grails.transaction.Transactional

@Transactional
class GameStepService {

    def serviceMethod() {

    }


    def gameStep(MessageDomain messageDomain){
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameStep gameStep=new GameStep()
        def obj = JSON.parse(messageDomain.messageBody)
        gameStep.fromUserOpenid=obj.fromUserOpenid
        gameStep.actionName=obj.actionName
        gameStep.paiNumber=obj.paiNumber
        gameStep.joinRoomNumber=roomNumber
        gameStep.toUserOpenid=obj.toUserOpenid
        gameStep.executeTime=new Date();
        gameStep.save(flush: true, failOnError: true)

        //add gameStep to game round

        GameRoomNumber gameRoomNumber=GameRoomNumber.findByRoomNumber(roomNumber)
        if(gameRoomNumber){
            GameRound  gameRound=gameRoomNumber.gameRound
            if(gameRound){
                gameRound.addToGameStep(gameStep)
                gameRound.save(flush: true, failOnError: true)
            }

        }


    }
}
