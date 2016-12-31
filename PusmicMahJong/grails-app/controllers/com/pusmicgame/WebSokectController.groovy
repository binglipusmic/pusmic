package com.pusmicgame

import grails.converters.JSON
import org.springframework.messaging.handler.annotation.MessageMapping
import  com.pusmicgame.domain.messageDomain
class WebSokectController {

    def index() { }

    @MessageMapping("/userResiveMessage")
    protected String user_resive_message(String message){

        def messageJsonObj=JSON.parse(message);


        if(messageJsonObj.messageAction.equals("")){

        }

    }

}
