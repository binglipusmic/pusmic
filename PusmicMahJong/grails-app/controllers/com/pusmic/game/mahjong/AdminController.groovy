package com.pusmic.game.mahjong
import grails.plugin.springsecurity.annotation.Secured
@Secured(['ROLE_ADMIN'])
class AdminController {

    def index() {
        def g=request._csrf.token
        render "admin:"+g
    }
}
