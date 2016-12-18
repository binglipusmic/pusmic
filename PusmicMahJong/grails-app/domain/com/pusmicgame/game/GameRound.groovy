package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser

class GameRound {
    Date  startTime
    Date  endTime
    GameMode gameMode
    Integer[] restPaiList

    static belongsTo = [user:SpringUser]
    static hasMany = [gameScore:GameScore,gameSetp:GameSetp,gamePai:GamePai]

    static constraints = {
    }
}
