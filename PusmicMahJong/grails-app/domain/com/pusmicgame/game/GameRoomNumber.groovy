package com.pusmicgame.game

class GameRoomNumber {

    String roomNumber

    //static belongsTo = [gameRoundLun:GameRoundLun]
    static hasOne = [gameRound:GameRound]
    static constraints = {
        gameRound nullable: true
    }
}
