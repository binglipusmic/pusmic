package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser

class GameUser {

    SpringUser springUser
    Integer[] paiList
    int  gameRoundScore
    int gameScoreCount
    String gameReadyStatu
    String publicIp
    String headImageFileName
    Date  joinRoundTime
    static belongsTo = [gameRound:GameRound]
    static constraints = {
        gameRoundScore nullable: true
        gameScoreCount nullable: true
        paiList nullable: true
        gameReadyStatu nullable: true
        headImageFileName nullable: true
        joinRoundTime   nullable: true
        gameRound  nullable: true
    }
}
