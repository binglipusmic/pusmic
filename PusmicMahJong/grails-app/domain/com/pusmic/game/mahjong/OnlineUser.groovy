package com.pusmic.game.mahjong
/**
 * online user
 */
class OnlineUser {
    Date onlineTime
    String  roomNumber
    SpringUser springUser
    String publicIPAddress
    //0, online ,1 offline ,game not start, 2  offline,game start
    //0 -index, 1- offline game room but not start,2-offline and game starting
    int onlineStau=0
    //LoingUserInfo logUserInfo
    static constraints = {
        roomNumber nullable: true
        onlineTime  nullable: true
        //loginTime nullable: true
    }
}
