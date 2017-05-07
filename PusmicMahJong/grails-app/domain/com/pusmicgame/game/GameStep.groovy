package com.pusmicgame.game

class GameStep {

    String fromUserOpenid
    String actionName
    String paiNumber
    String toUserOpenid
    String joinRoomNumber
    String gangPaiListStr
    String pengPaiListStr
    String paiList
    String chuPaiType
    String roundId
    Date   executeTime
    static constraints = {
        toUserOpenid   nullable: true
        gangPaiListStr nullable:true
        pengPaiListStr nullable:true
        paiList        nullable:true
        chuPaiType     nullable:true
    }
}
