package com.pusmicgame.game

import grails.transaction.Transactional
import com.pusmicgame.game.GameRoomNumber
@Transactional
class GameRoomNumberService {

    def getRandomRoomNumber() {
        int max = 999999
        int min = 100000
        Random rand = new Random()
        int randomNumber = rand.nextInt(max - min) + min;
        def r=GameRoomNumber.findByRoomNumber(randomNumber+"")
        while(r){
            randomNumber = rand.nextInt(max - min) + min;
            r=GameRoomNumber.findByRoomNumber(randomNumber+"")
        }
        return randomNumber;

    }
}
