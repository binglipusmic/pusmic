package com.pusmicgame.game

class GameRound {
    Date  startTime
    Date  endTime
    //GameMode gameMode
    Integer[] restPaiList
    Integer[] gameingRestPaiList
    GameMode gameMode
    GameRoomNumber roomNumber
    //Integer huPaiPeopleNumberCount

    static hasMany = [gameScore:GameScore, gameStep:GameStep, gameUser:GameUser]
    static belongsTo = [gameRoundLun:GameRoundLun]
    static constraints = {
        gameRoundLun nullable: true
        gameScore nullable: true
        gameStep nullable: true
        gameUser nullable: true
        restPaiList nullable: true
        endTime nullable: true
        gameingRestPaiList  nullable: true
    }

    static mapping = {
        //gameRoundLun lazy: false
        //gameUser sort: 'joinRoundTime', order: 'asc'

        gameUser sort: 'id', order: 'desc'
    }


}
