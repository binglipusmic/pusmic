package com.pusmicgame.game

class GameRound {
    Date  startTime
    Date  endTime
    //GameMode gameMode
    Integer[] restPaiList
    GameMode gameMode
    GameRoomNumber roomNumber

    static hasMany = [gameScore:GameScore, gameStep:GameStep, gameUser:GameUser]
    static belongsTo = [gameRoundLun:GameRoundLun]
    static constraints = {
        gameRoundLun nullable: true
        gameScore nullable: true
        gameStep nullable: true
        gameUser nullable: true
        restPaiList nullable: true
        endTime nullable: true
    }

    static mapping = {
        //gameRoundLun lazy: false
    }
}
