package com.pusmic.game.mahjong
/**
 * online user
 */
class OnlineUser {
    Date onlineTime
    String  roomNumber
    SpringUser springUser
    String publicIPAddress
    //0, offline ,1 online, 2 broken offline
    int onlineStau=0
    //LoingUserInfo logUserInfo
    static constraints = {
        roomNumber nullable: true
        onlineTime  nullable: true
        //loginTime nullable: true
    }
}
