package com.pusmicgame.game

class GameStep {

    String fromUserOpenid
    String actionName
    String paiNumber
    String toUserOpenid
    String joinRoomNumber
    Date   executeTime
    static constraints = {
        toUserOpenid   nullable: true
    }
}
