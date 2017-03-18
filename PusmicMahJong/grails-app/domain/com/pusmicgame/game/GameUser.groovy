package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser

class GameUser {

    SpringUser springUser
    Integer[] paiList
    int  gameRoundScore
    int gameScoreCount
    String gameReadyStatu
    String publicIp
    String headImageFileName
    String zhuang
    Date  joinRoundTime
    String huPai
    String huPaiType
    String huanSanZhang
    String quePai


    //+
    int huPaiNumber
    int ziGangNumber
    int baGangNumber
    //-
    int dianGangNumber
    int dianPaoNumber
    static belongsTo = [gameRound:GameRound]
    static constraints = {
        gameRoundScore nullable: true
        gameScoreCount nullable: true
        paiList nullable: true
        gameReadyStatu nullable: true
        headImageFileName nullable: true
        joinRoundTime   nullable: true
        gameRound  nullable: true
        zhuang nullable: true
        huPai nullable: true
        huPaiType nullable: true
        huanSanZhang nullable: true
        quePai  nullable: true
    }
}
