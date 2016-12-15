package com.pusmicgame

class FaPaiController {
    def paiService
    def index() {

        def pai=paiService.xiPai()
        render pai.toString()

    }
}
