package com.pusmicgame

import com.pusmic.game.mahjong.Role
import com.pusmic.game.mahjong.SpringUser
import grails.plugin.springsecurity.annotation.Secured

//@Secured("ROLE_USER")
class FaPaiController {
    def paiService
    def gameRoomNumberService
    def index() {

        if (isLoggedIn()) {
            String username = getAuthenticatedUser().username
           // getAuthenticatedUser().
            println ("print login:"+username);
           // if(getAuthenticatedUser().)
            def adminRole = Role.findOrSaveByAuthority('ROLE_ADMIN')
            if (getAuthenticatedUser().authorities.contains(adminRole)) {
                println ("foudn admin user :"+username);
            }else{
                println ("not foudn admin user :"+username);
            }
        }else{

        }
        def pai=paiService.xiPai()
        render pai.toString()

    }

    def getRoomNumber(){
        def room=gameRoomNumberService.getRandomRoomNumber()
        render room

    }
}
