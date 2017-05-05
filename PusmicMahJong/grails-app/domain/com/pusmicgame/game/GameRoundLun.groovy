package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser

class GameRoundLun {
    Date  startTime
    Date  endTime
    GameMode gameMode
    SpringUser user
    int  currentRoundCount=0
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

    static mapping = {
        //gameRoundLun lazy: false
        //gameUser sort: 'joinRoundTime', order: 'asc'

        //gameRound sort: 'id', order: 'desc'
    }
}
