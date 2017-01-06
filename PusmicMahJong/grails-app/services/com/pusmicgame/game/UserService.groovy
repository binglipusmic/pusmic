package com.pusmicgame.game

import com.pusmic.game.mahjong.LoingUserInfo
import com.pusmic.game.mahjong.OnlineUser
import com.pusmic.game.mahjong.SpringUser
import com.pusmicgame.domain.ActionMessageDomain
import com.pusmicgame.domain.GameUserPlatObj
import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.domain.UserInfo
import com.pusmicgame.mahjong.Utils
import grails.transaction.Transactional
import grails.converters.JSON
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import org.apache.commons.lang.StringEscapeUtils
import org.grails.web.util.WebUtils
import org.springframework.web.context.request.RequestContextHolder

import javax.swing.Spring


@Transactional
class UserService {

    def grailsApplication

    def myUtil=new Utils()
    private getGameRoomNumberService() {
        grailsApplication.mainContext.gameRoomNumberService
    }



    //----change user status--------------------------------
    def joinRoom(MessageDomain messageDomain) {
        ActionMessageDomain actionMessageDomain = new ActionMessageDomain()
        def openid = messageDomain.messageBody;
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        if (openid) {
            SpringUser user = SpringUser.findByOpenid(openid)
            if (user) {
                OnlineUser onlineUser = OnlineUser.findBySpringUser(user)
                GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
                if (onlineRoomNumber) {
                    GameRound gameRound = onlineRoomNumber.gameRound
                    if (gameRound) {
                        def gameUserList = gameRound.gameUser
                        def exist = false
                        GameUser gu = null
                        if (gameUserList) {



                            gameUserList.each { gameU ->

                                if (gameU.springUser.openid.equals(openid)) {
                                    exist = true
                                    gu=gameU
                                }

                            }
                        }

                        if (!exist) {
                            gu = new GameUser()
                            gu.springUser = user
                            gu.gameReadyStatu = "0"
                            gu.gameRoundScore = 0
                            gu.gameScoreCount = 1000
                            gu.publicIp = onlineUser.publicIPAddress
                            gu.save(flush: true, failOnError: true)
                            gameRound.addToGameUser(gu)
                            gameRound.save(flush: true, failOnError: true)
                        }

                        gameUserList = gameRound.gameUser

                        def gameUserListArray=[]
                        gameUserList.each { gameU ->
                            GameUserPlatObj outputUser = new GameUserPlatObj()
                            outputUser.id = gameU.id
                            outputUser.nickName = gameU.springUser.nickname
                            outputUser.openid = gameU.springUser.openid
                            outputUser.headimgurl = gameU.springUser.headimgurl
                            outputUser.unionid = gameU.springUser.unionid
                            outputUser.userCode = gameU.springUser.userCode
                            def onlineUser2 = OnlineUser.findBySpringUser(gameU.springUser)
                            if(onlineUser2){
                                outputUser.publicIp = onlineUser.publicIPAddress
                            }else{
                                outputUser.publicIp ="no found"
                            }

                            outputUser.paiList = ""
                            outputUser.gameRoundScore = gameU.gameRoundScore
                            outputUser.gameScoreCount = gameU.gameScoreCount
                            outputUser.gameReadyStatu = gameU.gameReadyStatu
                            gameUserListArray.add(outputUser)

                        }


                        actionMessageDomain.messageExecuteFlag = "success"
                        def s=JsonOutput.toJson(gameUserListArray);
                        //s=myUtil.fixJsonStr(s)
                        actionMessageDomain.messageExecuteResult =  s
                        //actionMessageDomain
                        //messageDomain.messageBody="success:"+openid

                    }
                } else {
                    actionMessageDomain.messageExecuteFlag = "fail"
                    actionMessageDomain.messageExecuteResult = "房间号出错,请检查后重新输入!"
                    //messageDomain.messageBody=""
                }

            }else{
                actionMessageDomain.messageExecuteFlag = "fail"
                actionMessageDomain.messageExecuteResult = "不能查找到该用户:"+openid
            }
        }else{
            actionMessageDomain.messageExecuteFlag = "fail"
            actionMessageDomain.messageExecuteResult = "不能发现openid"
        }
        def s2=JsonOutput.toJson(actionMessageDomain)
       // s2=myUtil.fixJsonStr(s2)
        messageDomain.messageBody= s2

        return messageDomain
    }

    def joinFullRoom(MessageDomain messageDomain){
        ActionMessageDomain actionMessageDomain = new ActionMessageDomain()
        actionMessageDomain.messageExecuteFlag = "fail"
        actionMessageDomain.messageExecuteResult = "此房间人数已满,请加入别的房间!"
        def s2=JsonOutput.toJson(actionMessageDomain)
        messageDomain.messageBody= s2

        return messageDomain
    }

    def changeUserStatus(MessageDomain messageDomain) {
        def obj = JSON.parse(messageDomain.messageBody)

        def userReadyStatu = obj.userReadyStatu
        def openid = obj.openid
        if (openid) {

            SpringUser user = SpringUser.findByOpenid(openid)
            if (user) {
                GameUser gu = GameUser.findBySpringUser(user)
                if (gu) {
                    gu.gameReadyStatu = userReadyStatu
                    gu.save(flush: true, failOnError: true)
                    messageDomain.messageBody = "success:" + openid
                } else {
                    messageDomain.messageBody = "no found game user"
                }
            } else {
                messageDomain.messageBody = "no found spring user"
            }
        } else {
            messageDomain.messageBody = "openid is invaid"
        }

        return messageDomain
    }

    def serviceMethod() {

    }

    def updateOnlineTime(def userOpenId) {
        def springUser = SpringUser.findByOpenid(userOpenId)
        if (springUser) {
            def onlineUser = OnlineUser.findBySpringUser(springUser)
            if (onlineUser) {
                onlineUser.onlineTime = new Date()
                onlineUser.save(flush: true, failOnError: true)
            }
        }
    }

    def removeOnlineUser(def userOpenId) {

    }

    def getUserInfoFromSpringUserByCode(String userCode, def publicIp) {
        def s
        def loopFlag = true;
        // def session = RequestContextHolder.currentRequestAttributes().getSession()
        if (userCode.equalsIgnoreCase("test")) {

            def sprinUserlist = SpringUser.list()
            println "getUserInfoFromSpringUserByCode1 sprinUserlist:" + sprinUserlist.size()
            sprinUserlist.each { u ->
                if (loopFlag) {
                    println "getUserInfoFromSpringUserByCode1:" + u.id
                    def onlineUser = OnlineUser.findBySpringUser(u)
                    if (!onlineUser) {
                        //add  a new logininfor
                        loopFlag = false
                        println "getUserInfoFromSpringUserByCode"

                        onlineUser = new OnlineUser()
                        onlineUser.springUser = u
                        onlineUser.roomNumber = gameRoomNumberService.getRandomRoomNumber()
                        onlineUser.publicIPAddress = publicIp
                        onlineUser.save(flush: true, failOnError: true)


                    } else {
                        //update the public
                        onlineUser.roomNumber = gameRoomNumberService.getRandomRoomNumber()
                        onlineUser.publicIPAddress = publicIp
                        onlineUser.save(flush: true, failOnError: true)

                    }

                    def userLoginInfo = new LoingUserInfo()
                    userLoginInfo.ipAddress = publicIp
                    userLoginInfo.loginTime = new Date()
                    //userLoginInfo.save(flush: true, failOnError: true)

                    u.addToLoginUserInfo(userLoginInfo)
                    u.save(flush: true, failOnError: true)

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

        } else {

        }

        return s

    }


    def getUserCode() {
        /*  def userCode=100000
          def userCount=SpringUser.count()
          if(userCount==0){
              userCode=100000
          }else{
              userCode=userCode+userCount
          }*/

        int max = 999999
        int min = 100000
        Random rand = new Random()
        int randomNumber = rand.nextInt(max - min) + min;
        def r = SpringUser.findByUserCode(randomNumber + "")
        while (r) {
            randomNumber = rand.nextInt(max - min) + min;
            r = GameRoomNumber.findByRoomNumber(randomNumber + "")
        }
        return randomNumber;
    }

}
