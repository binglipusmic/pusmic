package com.pusmicgame

import com.pusmicgame.game.GameUser

class ListGameUserController {

    def index() {

        def list= GameUser.list()


    }
}
