package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser

class GameRoundLun {
    Date  startTime
    Date  endTime
    GameMode gameMode
  //  String roomNumber
    //static belongsTo = SpringUser
    static hasMany = [gameRound:GameRound]
    //static hasOne=[gameMode:GameMode]
    static constraints = {
        endTime nullable: true
        gameRound nullable: true

    }
}
