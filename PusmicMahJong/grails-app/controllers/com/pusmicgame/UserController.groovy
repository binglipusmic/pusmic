package com.pusmicgame

import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.domain.UserAuthObject
import com.pusmicgame.domain.UserInfo
import grails.converters.JSON
import org.grails.web.json.JSONElement
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
        def s
        if(code){
            s=userService.loginUserByCode(code);
        }

        MessageDomain messageJsonObj = JSON.parse(authObject);
        if(messageJsonObj){
           // def s=userService.createNewSpringUserOrUpdate(code,publicIp)
           if(messageJsonObj.messageAction.equals("saveAuthToken")){
               UserAuthObject userAuthObj=JSON.parse(messageJsonObj.messageBody);
               userService.createNewSpringUserOrUpdate(userAuthObj)
           }

            if(messageJsonObj.messageAction.equals("saveUserInfo")){
                UserInfo userInfo=JSON.parse(messageJsonObj.messageBody);
                userService.createNewSpringUserOrUpdateUserInfo(userInfo);
            }

            //UserInfo
        }


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
