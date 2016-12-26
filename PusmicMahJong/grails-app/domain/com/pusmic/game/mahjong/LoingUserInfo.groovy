package com.pusmic.game.mahjong

class LoingUserInfo {
    Date loginTime
    Date offlineTiem
    String ipAddress


    static constraints = {
        offlineTiem nullable: true
        //offlineTiem nullable: true
    }
}
