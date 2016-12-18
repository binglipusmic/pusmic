package com.pusmic.game.mahjong
/**
 * online user
 */
class OnlineUser {
    Date loginTime
    String  gameRoomNumber
    SpringUser springUser
    static constraints = {
        gameRoomNumber nullable: true
    }
}
