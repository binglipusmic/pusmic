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
        brokerMessagingTemplate.convertAndSend "/queue/pusmicGamePushLoginUserInfoChanle"+roomNumber, message
    }

    void privateUserChanelByRoomNumber(def roomNumber,def message){
        brokerMessagingTemplate.convertAndSend "/queue/privateUserChanel"+roomNumber, message
    }

}
