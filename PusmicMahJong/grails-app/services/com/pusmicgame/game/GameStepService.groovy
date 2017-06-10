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
        def gameStepId=0
        def obj = JSON.parse(messageDomain.messageBody)
        if(!obj.actionName.toString().equals("showActionBar")) {
            gameStep.fromUserOpenid = obj.fromUserOpenid
            gameStep.actionName = obj.actionName
           if (obj?.paiNumber) {
                if (obj.paiNumber != "") {
                    gameStep.paiNumber = obj.paiNumber
                } else {
                    gameStep.paiNumber = "0"
                }

            } else {
                gameStep.paiNumber = "0"
            }


            if(obj.actionName.toString().equals("setCenterIndex")) {
                gameStep.paiNumber = "0"
            }

            gameStep.joinRoomNumber = roomNumber
            gameStep.toUserOpenid = obj.toUserOpenid
            gameStep.executeTime = new Date();
            gameStep.roundId="0"
            gameStep.save(flush: true, failOnError: true)

            gameStepId =gameStep.id

            //add gameStep to game round

            GameRoomNumber gameRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
            if (gameRoomNumber) {
                GameRound gameRound = gameRoomNumber.gameRound
                if (gameRound) {
                    gameStep.roundId=gameRound.id+""
                    gameStep.save(flush: true, failOnError: true)
                        gameStep=GameStep.findById(gameStepId)
                        if(gameStep){
                            println "gameStep:"+gameStep.id
                            println "gameStep joinRoomNumber:"+gameStep.joinRoomNumber
                            println "gameStep paiNumber:"+gameStep.paiNumber
                            println "gameStep roomNumber:"+roomNumber
                            //gameRound.roundId
                           // gameRound.addToGameStep(gameStep).save(flush: true, failOnError: true)
                           // gameRound
                        }else{
                            println "Error:No found sgame step"
                        }
                    }



            }
        }

        return gameStepId


    }
}
