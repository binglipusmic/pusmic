package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser

class GameUser {

    SpringUser springUser
    Integer[] paiList
    int  gameScore

   // static belongsTo = [gameRound:GameRound]
    static constraints = {
        gameScore nullable: true
        paiList nullable: true
    }
}
