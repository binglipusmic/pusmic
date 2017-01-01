package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser

class GameRoundLun {
    Date  startTime
    Date  endTime
  //  String roomNumber
    static belongsTo = [user:SpringUser]
    static hasMany = [gameRound:GameRound]
    static hasOne=[gameMode:GameMode,roomNumber:GameRoomNumber]
    static constraints = {
    }
}
