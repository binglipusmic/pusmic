package com.pusmicgame.game

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class GameUserController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond GameUser.list(params), model:[gameUserCount: GameUser.count()]
    }

    def show(GameUser gameUser) {
        respond gameUser
    }

    def create() {
        respond new GameUser(params)
    }

    @Transactional
    def save(GameUser gameUser) {
        if (gameUser == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (gameUser.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond gameUser.errors, view:'create'
            return
        }

        gameUser.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'gameUser.label', default: 'GameUser'), gameUser.id])
                redirect gameUser
            }
            '*' { respond gameUser, [status: CREATED] }
        }
    }

    def edit(GameUser gameUser) {
        respond gameUser
    }

    @Transactional
    def update(GameUser gameUser) {
        if (gameUser == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (gameUser.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond gameUser.errors, view:'edit'
            return
        }

        gameUser.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'gameUser.label', default: 'GameUser'), gameUser.id])
                redirect gameUser
            }
            '*'{ respond gameUser, [status: OK] }
        }
    }

    @Transactional
    def delete(GameUser gameUser) {

        if (gameUser == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        gameUser.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'gameUser.label', default: 'GameUser'), gameUser.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'gameUser.label', default: 'GameUser'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
