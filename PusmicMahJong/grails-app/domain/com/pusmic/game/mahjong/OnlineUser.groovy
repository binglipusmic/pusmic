package com.pusmic.game.mahjong
/**
 * online user
 */
class OnlineUser {
    //Date loginTime
    String  roomNumber
    SpringUser springUser
    String publicIPAddress
    //LoingUserInfo logUserInfo
    static constraints = {
        roomNumber nullable: true
        //loginTime nullable: true
    }
}
