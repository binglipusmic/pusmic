package com.pusmicgame

import org.grails.web.util.WebUtils
import org.springframework.messaging.handler.annotation.Header
import org.springframework.messaging.handler.annotation.Headers
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessageHeaderAccessor

class UserController {
    def PUBLICIP_ATTR="remoteIpAddress"
    //def session
    def userService
    def paiService
    def index() {
        session.getAttribute()
    }

    @MessageMapping("/usercode_resive_message")
    @SendTo("/queue/pusmicGamePushLoginUserInfoChanle")
    protected String usercode_resive_message(String code,@Headers Map<String, Object> headers) {
        println "usercode_resive_message headers::"+headers.toString()
     Map<String, Object> sessionHeaders = SimpMessageHeaderAccessor.getSessionAttributes(headers);
        String publicIp = (String) sessionHeaders.get(PUBLICIP_ATTR);
        println "usercode_resive_message ip::"+publicIp
        def s=userService.getUserInfoFromSpringUserByCode(code,publicIp)
        println "user info::"+s
        return s
    }


    def testFaPai(){
        def paiList=paiService.xiPai()

        def rList=paiService.getUserPaiList(paiList,1)
        println "user1:"
        println "paiRest:"+rList[0].toString()
        println "userPai:"+rList[1].toString()
        paiList=rList[0]

       rList=paiService.getUserPaiList(paiList,2)
        println "user2:"
        println "paiRest:"+rList[0].toString()
        println "userPai:"+rList[1].toString()
        paiList=rList[0]

        rList=paiService.getUserPaiList(paiList,2)
        println "user3:"
        println "paiRest:"+rList[0].toString()
        println "userPai:"+rList[1].toString()
        paiList=rList[0]

        rList=paiService.getUserPaiList(paiList,2)
        println "user4:"
        println "paiRest:"+rList[0].toString()
        println "userPai:"+rList[1].toString()
        paiList=rList[0]
    }
}
