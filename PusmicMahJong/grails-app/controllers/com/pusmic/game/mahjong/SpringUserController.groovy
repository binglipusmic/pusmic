package com.pusmic.game.mahjong

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class SpringUserController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond SpringUser.list(params), model:[springUserCount: SpringUser.count()]
    }

    def show(SpringUser springUser) {
        respond springUser
    }

    def create() {
        respond new SpringUser(params)
    }

    @Transactional
    def save(SpringUser springUser) {
        if (springUser == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (springUser.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond springUser.errors, view:'create'
            return
        }

        springUser.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'springUser.label', default: 'SpringUser'), springUser.id])
                redirect springUser
            }
            '*' { respond springUser, [status: CREATED] }
        }
    }

    def edit(SpringUser springUser) {
        respond springUser
    }

    @Transactional
    def update(SpringUser springUser) {
        if (springUser == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (springUser.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond springUser.errors, view:'edit'
            return
        }

        springUser.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'springUser.label', default: 'SpringUser'), springUser.id])
                redirect springUser
            }
            '*'{ respond springUser, [status: OK] }
        }
    }

    @Transactional
    def delete(SpringUser springUser) {

        if (springUser == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        springUser.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'springUser.label', default: 'SpringUser'), springUser.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'springUser.label', default: 'SpringUser'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
