package com.pusmicgame.game

class GameRoomNumber {

    String roomNumber

    static belongsTo = [gameRoundLun:GameRoundLun]
    static constraints = {
    }
}
