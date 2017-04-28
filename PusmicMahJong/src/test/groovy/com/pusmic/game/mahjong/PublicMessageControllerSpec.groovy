package com.pusmic.game.mahjong

import grails.test.mixin.*
import spock.lang.*

@TestFor(PublicMessageController)
@Mock(PublicMessage)
class PublicMessageControllerSpec extends Specification {

    def populateValidParams(params) {
        assert params != null

        // TODO: Populate valid properties like...
        //params["name"] = 'someValidName'
        assert false, "TODO: Provide a populateValidParams() implementation for this generated test suite"
    }

    void "Test the index action returns the correct model"() {

        when:"The index action is executed"
            controller.index()

        then:"The model is correct"
            !model.publicMessageList
            model.publicMessageCount == 0
    }

    void "Test the create action returns the correct model"() {
        when:"The create action is executed"
            controller.create()

        then:"The model is correctly created"
            model.publicMessage!= null
    }

    void "Test the save action correctly persists an instance"() {

        when:"The save action is executed with an invalid instance"
            request.contentType = FORM_CONTENT_TYPE
            request.method = 'POST'
            def publicMessage = new PublicMessage()
            publicMessage.validate()
            controller.save(publicMessage)

        then:"The create view is rendered again with the correct model"
            model.publicMessage!= null
            view == 'create'

        when:"The save action is executed with a valid instance"
            response.reset()
            populateValidParams(params)
            publicMessage = new PublicMessage(params)

            controller.save(publicMessage)

        then:"A redirect is issued to the show action"
            response.redirectedUrl == '/publicMessage/show/1'
            controller.flash.message != null
            PublicMessage.count() == 1
    }

    void "Test that the show action returns the correct model"() {
        when:"The show action is executed with a null domain"
            controller.show(null)

        then:"A 404 error is returned"
            response.status == 404

        when:"A domain instance is passed to the show action"
            populateValidParams(params)
            def publicMessage = new PublicMessage(params)
            controller.show(publicMessage)

        then:"A model is populated containing the domain instance"
            model.publicMessage == publicMessage
    }

    void "Test that the edit action returns the correct model"() {
        when:"The edit action is executed with a null domain"
            controller.edit(null)

        then:"A 404 error is returned"
            response.status == 404

        when:"A domain instance is passed to the edit action"
            populateValidParams(params)
            def publicMessage = new PublicMessage(params)
            controller.edit(publicMessage)

        then:"A model is populated containing the domain instance"
            model.publicMessage == publicMessage
    }

    void "Test the update action performs an update on a valid domain instance"() {
        when:"Update is called for a domain instance that doesn't exist"
            request.contentType = FORM_CONTENT_TYPE
            request.method = 'PUT'
            controller.update(null)

        then:"A 404 error is returned"
            response.redirectedUrl == '/publicMessage/index'
            flash.message != null

        when:"An invalid domain instance is passed to the update action"
            response.reset()
            def publicMessage = new PublicMessage()
            publicMessage.validate()
            controller.update(publicMessage)

        then:"The edit view is rendered again with the invalid instance"
            view == 'edit'
            model.publicMessage == publicMessage

        when:"A valid domain instance is passed to the update action"
            response.reset()
            populateValidParams(params)
            publicMessage = new PublicMessage(params).save(flush: true)
            controller.update(publicMessage)

        then:"A redirect is issued to the show action"
            publicMessage != null
            response.redirectedUrl == "/publicMessage/show/$publicMessage.id"
            flash.message != null
    }

    void "Test that the delete action deletes an instance if it exists"() {
        when:"The delete action is called for a null instance"
            request.contentType = FORM_CONTENT_TYPE
            request.method = 'DELETE'
            controller.delete(null)

        then:"A 404 is returned"
            response.redirectedUrl == '/publicMessage/index'
            flash.message != null

        when:"A domain instance is created"
            response.reset()
            populateValidParams(params)
            def publicMessage = new PublicMessage(params).save(flush: true)

        then:"It exists"
            PublicMessage.count() == 1

        when:"The domain instance is passed to the delete action"
            controller.delete(publicMessage)

        then:"The instance is deleted"
            PublicMessage.count() == 0
            response.redirectedUrl == '/publicMessage/index'
            flash.message != null
    }
}
