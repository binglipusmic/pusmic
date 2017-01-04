package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser

class GameUser {

    SpringUser springUser
    Integer[] paiList
    int  gameRoundScore
    int gameScoreCount
    String gameReadyStatu
    String publicIp
   // static belongsTo = [gameRound:GameRound]
    static constraints = {
        gameRoundScore nullable: true
        gameScoreCount nullable: true
        paiList nullable: true
        gameReadyStatu nullable: true
    }
}
