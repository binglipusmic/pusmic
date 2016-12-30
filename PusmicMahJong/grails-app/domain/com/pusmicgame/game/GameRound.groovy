package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser

class GameRound {
    Date  startTime
    Date  endTime
    //GameMode gameMode
    Integer[] restPaiList


    static hasMany = [gameScore:GameScore,gameSetp:GameSetp,gameUser:GameUser]
    static belongsTo = [gameRoundLun:GameRoundLun]
    static constraints = {
    }
}
