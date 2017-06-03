package com.pusmic.game

import grails.transaction.Transactional
import org.springframework.messaging.simp.SimpMessagingTemplate


@Transactional
class WebsokectService {


    SimpMessagingTemplate brokerMessagingTemplate

    void pusmicGameUserLogin(def message) {
        brokerMessagingTemplate.convertAndSend "/queue/pusmicGamePushLoginUserInfoChanle", message
    }

    void pusmicGameUserLoginPrivate(def roomNumber,def message) {
        message=message.encodeAsBase64()
        println "pusmicGameUserLoginPrivate:"+message
        brokerMessagingTemplate.convertAndSend "/queue/pusmicGamePushLoginUserInfoChanle"+roomNumber, message
    }

    void privateUserChanelByRoomNumber(def roomNumber,String message){
        //encode by base 64

        println  "privateUserChanelByRoomNumber:"+roomNumber
        println  "privateUserChanelByRoomNumber message:"+message
        message=message.encodeAsBase64()
        brokerMessagingTemplate.convertAndSend "/queue/privateUserChanel"+roomNumber, message
    }

}
