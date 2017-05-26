package com.pusmicgame

import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.domain.UserAuthObject
import com.pusmicgame.domain.UserInfo
import grails.converters.JSON
import grails.web.context.ServletContextHolder
import org.grails.web.json.JSONElement
import org.grails.web.util.WebUtils
import org.springframework.messaging.handler.annotation.Header
import org.springframework.messaging.handler.annotation.Headers
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.support.WebApplicationContextUtils

import javax.servlet.http.HttpSession
import javax.websocket.EndpointConfig

class UserController {
    def PUBLICIP_ATTR = "remoteIpAddress"
    //def session
    def userService
    def paiService
    def websokectService
    def showActionBarService
    def gameRoundLunService

    def index() {
        session.getAttribute()
    }

    @MessageMapping("/usercode_resive_message")
 //   @SendTo("/queue/pusmicGamePushLoginUserInfoChanle")
    protected String usercode_resive_message(String messageString, @Headers Map<String, Object> headers) {
        println "usercode_resive_message headers::" + headers.toString()
        Map<String, Object> sessionHeaders = SimpMessageHeaderAccessor.getSessionAttributes(headers);


        String publicIp = (String) sessionHeaders.get(PUBLICIP_ATTR);
        println "usercode_resive_message ip::" + publicIp

        def s
//        if(code){
//            s=userService.loginUserByCode(code);
//        }

        if (messageString) {

            MessageDomain messageJsonObj = JSON.parse(messageString);
            if (messageJsonObj) {
                // def s=userService.createNewSpringUserOrUpdate(code,publicIp)
                def obj=JSON.parse(messageJsonObj.messageBody);
                def roomNumber
                if (messageJsonObj.messageAction.equals("getTokenByCode")) {
                    roomNumber=obj.roomNumber
                    def code=obj.code

                    //UserAuthObject userAuthObj = JSON.parse(messageJsonObj.messageBody);
                    //userService.createNewSpringUserOrUpdate(userAuthObj)
                    s=userService.loginUserByCode(code,publicIp);
                }

                if (messageJsonObj.messageAction.equals("refreshToken")) {
                    //UserInfo userInfo = JSON.parse(messageJsonObj.messageBody);
                    roomNumber=obj.roomNumber
                    def openid=obj.openid
                    s=userService.refreshTokenByOpenid(openid,publicIp);
                }
                // sessionHeaders.put("openid",messageJsonObj.messageBody);

                println "roomNumber:"+roomNumber


                websokectService.pusmicGameUserLoginPrivate(roomNumber,s)

            }
        }


        println "user info::" + s
        //return s
    }

    def testScorce(){
        def s =gameRoundLunService.getUserScoreCount("245144")
        render s

    }


    def testFaPai() {
        def paiList = paiService.xiPai()

        def rList = paiService.getUserPaiList(paiList, 1)
        println "user1:"
        println "paiRest:" + rList[0].toString()
        println "userPai:" + rList[1].toString()
        paiList = rList[0]

        rList = paiService.getUserPaiList(paiList, 2)
        println "user2:"
        println "paiRest:" + rList[0].toString()
        println "userPai:" + rList[1].toString()
        paiList = rList[0]

        rList = paiService.getUserPaiList(paiList, 2)
        println "user3:"
        println "paiRest:" + rList[0].toString()
        println "userPai:" + rList[1].toString()
        paiList = rList[0]

        rList = paiService.getUserPaiList(paiList, 2)
        println "user4:"
        println "paiRest:" + rList[0].toString()
        println "userPai:" + rList[1].toString()
        paiList = rList[0]
    }

    def testGetGameRound(){

        MessageDomain messageJsonObj=new MessageDomain()
        //messageJsonObj.messageBody="oCG9Xwo2BF--ukJXk9uCTLqhz8f8"
        //﻿oCG9Xwqb01c-ixC4XkGf1cTaWVD4
        //messageJsonObj.messageBody="oCG9Xwqb01c-ixC4XkGf1cTaWVD4"
        //def s=userService.getAllGameRoundByUser(messageJsonObj)
        def huString='''
[{"userOpenId":"test0","actionArray":"cancle,peng,gang","paiNumber":"11"},{"userOpenId":"test1","actionArray":"cancle,peng,gang","paiNumber":"11"},{"userOpenId":"test2","actionArray":"cancle,peng,gang","paiNumber":"11"}]
      '''
        showActionBarService.handelShowAllActionBar(huString,"")
        render "test"

    }
}
