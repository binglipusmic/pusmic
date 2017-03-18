package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser

class GameRoundLun {
    Date  startTime
    Date  endTime
    GameMode gameMode
    SpringUser user
    int  currentRoundCount
  //  String roomNumber
    static belongsTo = SpringUser
    static hasMany = [gameRound:GameRound,users:SpringUser]
    //static hasOne=[gameMode:GameMode]
    static constraints = {
        endTime nullable: true
        gameRound nullable: true
        user nullable: true
        users nullable: true
    }
}
