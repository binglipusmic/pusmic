package com.pusmic.game.mahjong

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class PublicMessageController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond PublicMessage.list(params), model:[publicMessageCount: PublicMessage.count()]
    }

    def show(PublicMessage publicMessage) {
        respond publicMessage
    }

    def create() {
        respond new PublicMessage(params)
    }

    @Transactional
    def save(PublicMessage publicMessage) {
        if (publicMessage == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (publicMessage.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond publicMessage.errors, view:'create'
            return
        }

        publicMessage.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'publicMessage.label', default: 'PublicMessage'), publicMessage.id])
                redirect publicMessage
            }
            '*' { respond publicMessage, [status: CREATED] }
        }
    }

    def edit(PublicMessage publicMessage) {
        respond publicMessage
    }

    @Transactional
    def update(PublicMessage publicMessage) {
        if (publicMessage == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (publicMessage.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond publicMessage.errors, view:'edit'
            return
        }

        publicMessage.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'publicMessage.label', default: 'PublicMessage'), publicMessage.id])
                redirect publicMessage
            }
            '*'{ respond publicMessage, [status: OK] }
        }
    }

    @Transactional
    def delete(PublicMessage publicMessage) {

        if (publicMessage == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        publicMessage.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'publicMessage.label', default: 'PublicMessage'), publicMessage.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'publicMessage.label', default: 'PublicMessage'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
