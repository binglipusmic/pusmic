package com.pusmic.game.mahjong
//SELECT picture.id, earth_distance(ll_to_earth(picture.lat, picture.lng), ll_to_earth(40.059286,116.418773))
class LoingUserInfo {
    Date loginTime
    Date offlineTiem
    String ipAddress
    double longitude
    double latitude


    static constraints = {
        offlineTiem nullable: true
        //offlineTiem nullable: true
    }
}
