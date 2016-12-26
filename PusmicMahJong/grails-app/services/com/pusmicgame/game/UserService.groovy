package com.pusmicgame.game

import com.pusmic.game.mahjong.LoingUserInfo
import com.pusmic.game.mahjong.OnlineUser
import com.pusmic.game.mahjong.SpringUser
import com.pusmicgame.domain.UserInfo
import grails.transaction.Transactional
import grails.converters.JSON
import groovy.json.JsonBuilder
import org.grails.web.util.WebUtils
import org.springframework.web.context.request.RequestContextHolder

@Transactional
class UserService {

    def grailsApplication
    private getGameRoomNumberService() {
        grailsApplication.mainContext.gameRoomNumberService
    }
    def serviceMethod() {

    }

    def getUserInfoFromSpringUserByCode(String userCode,def publicIp){
        def s
        def loopFlag=true;
       // def session = RequestContextHolder.currentRequestAttributes().getSession()
        if(userCode.equalsIgnoreCase("test")){

            def sprinUserlist= SpringUser.list()
            println "getUserInfoFromSpringUserByCode1 sprinUserlist:"+sprinUserlist.size()
            sprinUserlist.each { u ->
                if (loopFlag) {
                    println "getUserInfoFromSpringUserByCode1:" + u.id
                    def onlineUser = OnlineUser.findBySpringUser(u)
                    if (!onlineUser) {
                        //add  a new logininfor
                        loopFlag = false
                        println "getUserInfoFromSpringUserByCode"
                        def userLoginInfo = new LoingUserInfo()
                        userLoginInfo.ipAddress = publicIp
                        userLoginInfo.loginTime = new Date()
                        //userLoginInfo.save(flush: true, failOnError: true)

                        u.addToLoginUserInfo(userLoginInfo)
                        u.save(flush: true, failOnError: true)
                        onlineUser = new OnlineUser()
                        onlineUser.springUser = u
                        onlineUser.roomNumber = gameRoomNumberService.getRandomRoomNumber()
                        onlineUser.publicIPAddress = publicIp
                        onlineUser.save(flush: true, failOnError: true)

                        UserInfo userInfo = new UserInfo()
                        userInfo.publicIPAddress = onlineUser.publicIPAddress
                        userInfo.id = onlineUser.springUser.id
                        userInfo.city = onlineUser.springUser.city
                        userInfo.country = onlineUser.springUser.country
                        userInfo.language = onlineUser.springUser.language
                        userInfo.nickName = onlineUser.springUser.nickname
                        userInfo.openid = onlineUser.springUser.openid
                        userInfo.province = onlineUser.springUser.province
                        userInfo.headimgurl = onlineUser.springUser.headimgurl
                        userInfo.unionid = onlineUser.springUser.unionid
                        userInfo.sex = onlineUser.springUser.sex
                        userInfo.diamondsNumber = onlineUser.springUser.diamondsNumber
                        userInfo.gameCount = onlineUser.springUser.gameCount
                        userInfo.winCount = onlineUser.springUser.winCount
                        userInfo.agentLevel = onlineUser.springUser.agentLevel
                        userInfo.userCode = onlineUser.springUser.userCode
                        userInfo.userType = onlineUser.springUser.userType
                        userInfo.roomNumber = onlineUser.roomNumber
                        s = new JsonBuilder(userInfo).toPrettyString()
                        return false

                    }
                }
            }

        }else{

        }

        return s

    }

}