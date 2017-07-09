package com.pusmicgame.game

import com.pusmic.game.mahjong.LoingUserInfo
import com.pusmic.game.mahjong.OnlineUser
import com.pusmic.game.mahjong.PublicMessage
import com.pusmic.game.mahjong.SpringUser
import com.pusmicgame.domain.ActionMessageDomain
import com.pusmicgame.domain.ClientGaneRoundParameterObj
import com.pusmicgame.domain.GameModeJson
import com.pusmicgame.domain.GameRoundListPage
import com.pusmicgame.domain.GameRoundPlatObj
import com.pusmicgame.domain.GameUserPlatObj
import com.pusmicgame.domain.JoinRoom
import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.domain.MoveResultObject
import com.pusmicgame.domain.UserInfo
import com.pusmicgame.domain.UserAuthObject
import com.pusmicgame.domain.WXUserInfo
import com.pusmicgame.domain.WebChatTokenObj
import com.pusmicgame.mahjong.Utils

import grails.transaction.Transactional
import grails.converters.JSON
import groovy.json.JsonBuilder
import groovy.json.JsonOutput


import com.pusmicgame.utils.CustomComparatorForGameUserPlatObj
import org.springframework.web.context.request.RequestContextHolder

import javax.swing.Spring

@Transactional
class UserService {
    def appid = "wxc759dfd81a4af8da";
    def appSecrect = "a8864c0ae4a3422e78561be99c46cb5e";
    def grant_type = ""
    def grailsApplication

    def websokectService

    def gameRoundLunService

    def myUtil = new Utils()

    //---change spring user to plat object and get it json strnig

    def getSpringUserJsonStringspringUser(gameU) {


        GameUserPlatObj outputUser = new GameUserPlatObj()
        outputUser.id = gameU.id
        outputUser.nickName = gameU.springUser.nickname
        outputUser.openid = gameU.springUser.openid
        outputUser.headimgurl = gameU.springUser.headimgurl
        outputUser.unionid = gameU.springUser.unionid
        outputUser.userCode = gameU.springUser.userCode
        def onlineUser2 = OnlineUser.findBySpringUser(gameU.springUser)
        if (onlineUser2) {
            outputUser.publicIp = onlineUser2.publicIPAddress
        } else {
            outputUser.publicIp = "no found"
        }

        outputUser.paiList = ""
        outputUser.gameRoundScore = gameU.gameRoundScore
        outputUser.gameScoreCount = gameU.gameScoreCount
        outputUser.gameReadyStatu = gameU.gameReadyStatu
        outputUser.headImageFileName = gameU.headImageFileName


    }


    //---------------------------------------------------------------------------------------

    def moveDemondToOtherUser(MessageDomain messageDomain){
        def returnMessage=""
        def flag="success"
        def domondNumberStr=""
        MoveResultObject moveResultObject=new MoveResultObject()
        moveResultObject.sourceUserOpenId=""
        moveResultObject.targetUserOpenId=""
        if(messageDomain.messageBody){
            def obj=JSON.parse(messageDomain.messageBody)
            if(!obj.fromUserCode){
                returnMessage="转移钻石失败,没有发现转移源用户代码。"
                flag="fail"
            }else if(!obj.toUserCode){
                returnMessage="转移钻石失败,没有发现转移目标用户代码。"
                flag="fail"
            }else if(!obj.demondNumber){
                returnMessage="转移钻石失败,没有发现钻石数目。"
                flag="fail"
            }else{
                //start zhuanyi
                def userCode=obj.fromUserCode.toString()
                SpringUser sourceUser=SpringUser.findByUserCode(userCode)
                println "sourceUser:"+sourceUser.openid
                if(!sourceUser){
                    returnMessage="没有发现源用户通过这个用户代码:"+obj.fromUserCode+"."
                    flag="fail"
                }else {
                    SpringUser targetUser=SpringUser.findByUserCode(obj.toUserCode.toString())
                    if(!targetUser){
                        returnMessage="没有发现目标用户通过这个用户代码:。"+obj.toUserCode
                        flag="fail"
                    }else{

                        def demondNumber=obj.demondNumber
                        demondNumber=demondNumber.toInteger()
                        def sourceUserDemondNUmber=sourceUser.diamondsNumber
                        if(demondNumber>sourceUserDemondNUmber){
                            returnMessage="你拥有的钻石数目小于转移的钻石数目,请检查后重新输入"
                            flag="fail"
                        }else{
                            sourceUser.diamondsNumber=sourceUser.diamondsNumber-demondNumber
                            sourceUser.save(flush: true, failOnError: true)
                            targetUser.diamondsNumber=targetUser.diamondsNumber+demondNumber
                            targetUser.save(flush: true, failOnError: true)
                            flag="success"
                            moveResultObject.sourceUserOpenId=sourceUser.openid
                            moveResultObject.targetUserOpenId=targetUser.openid
                            returnMessage="成功转移"+demondNumber+"个钻石,从"+sourceUser.nickname+"到"+targetUser.nickname+"。"




                        }

                        domondNumberStr=obj.demondNumber

                    }
                }
            }

        }else{
            returnMessage="转移钻石失败,请检查发送消息。"
            flag="fail"
        }




        moveResultObject.demondNumber=domondNumberStr
        moveResultObject.flag=flag.toString()
        moveResultObject.returnMessage=returnMessage


        MessageDomain newMessageObj = new MessageDomain()
        newMessageObj.messageBelongsToPrivateChanleNumber = messageDomain.messageBelongsToPrivateChanleNumber
        newMessageObj.messageAction = "demondMoveResult"
        newMessageObj.messageBody =new JsonBuilder(moveResultObject).toPrettyString()
        newMessageObj.messageType = "gameAction"
        def s2 = JsonOutput.toJson(newMessageObj)
        websokectService.privateUserChanelByRoomNumber(messageDomain.messageBelongsToPrivateChanleNumber, s2)

    }

    //------------login user by code----------------------------

    def loginUserByCode(code, pulicIp) {
        grant_type = "authorization_code";
        def url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appSecrect + "&code=" + code + "&grant_type=" + grant_type;
        def springUser
        def jsonString = new URL(url).getText()
        if (jsonString) {
            if (jsonString.contains("errcode")) {
                println "Web chat login error:" + jsonString;
            } else {
                println "jsonString:" + jsonString
                WebChatTokenObj userAuthObj = JSON.parse(jsonString);
                springUser = createNewSpringUserOrUpdate(userAuthObj, code)
                springUser = createNewSpringUserOrUpdateUserInfo(springUser.openid)
            }


        } else {

        }
        def s = ""
        if (springUser) {
            s = getUserInfoFromSpringUserBySpringUser(springUser, pulicIp)
        }


        return s


    }
    //---------spring user create or update --------------------
    def createNewSpringUserOrUpdate(WebChatTokenObj userAuthObject, String code) {
        def openid = userAuthObject.openid
        def springUser
        if (openid) {
            springUser = SpringUser.findByOpenid(openid)
            if (!springUser) {
                springUser = new SpringUser(username: "", password: 'password%^', city: "", country: "CN", language: "chinese",
                        nickname: "", openid: openid, province: "", headimgurl: "", unionid: "", access_token: "",
                        refresh_token: "", userCode: "")
            }

            springUser.userCode = getUserCode()
            springUser.webChatUserCode = code
            springUser.username = openid
            springUser.userType = ""
            springUser.headImageFileName = ""
            springUser.headimgurl = ""
            springUser.unionid = ""
            springUser.city = ""
            springUser.password = "password%^"
            springUser.province = ""
            springUser.nickname = ""
            springUser.country = ""
            springUser.refresh_token = userAuthObject.refresh_token;
            springUser.access_token = userAuthObject.access_token
            springUser.save(flush: true, failOnError: true)

            //update online user


        }
        return springUser
    }

    def createNewSpringUserOrUpdateUserInfo(openid) {

        def springUser
        if (openid) {

            springUser = SpringUser.findByOpenid(openid)
            if (springUser) {
                def url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + springUser.access_token + "&openid=" + springUser.openid

                def jsonString = new URL(url).getText()
                if (jsonString) {

                    WXUserInfo userInfo = JSON.parse(jsonString);
                    springUser.nickname = userInfo.nickname
                    springUser.sex = userInfo.sex
                    springUser.province = userInfo.province
                    springUser.city = userInfo.city
                    springUser.country = userInfo.country
                    springUser.headimgurl = userInfo.headimgurl
                    springUser.save(flush: true, failOnError: true)
                }
            }

        }

        return springUser

    }


    def refreshTokenByOpenid(openid, publicIp) {
        def springUser
        if (openid) {

            springUser = SpringUser.findByOpenid(openid)
            if (springUser) {
                def url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=" + appid + "&grant_type=refresh_token&refresh_token=" + springUser.refresh_token
                println "refreshTokenByOpenid url:" + url
                def jsonString = new URL(url).getText()
                if (jsonString) {
                    WebChatTokenObj userAuthObj = JSON.parse(jsonString);
                    //TODO check if change ,no change ,no store
                    springUser.access_token = userAuthObj.access_token
                    springUser.refresh_token = userAuthObj.refresh_token
                    //TODO referesh user info from webchat server in here
                    springUser.save(flush: true, failOnError: true)
                }
            }
        }

        def s = ""
        if (springUser) {
            s = getUserInfoFromSpringUserBySpringUser(springUser, publicIp)
        }


        return s
        //https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN

    }

    private getGameRoomNumberService() {
        grailsApplication.mainContext.gameRoomNumberService
    }

    def updateQuePaiForUser(MessageDomain messageDomain) {
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        def obj = JSON.parse(messageDomain.messageBody)
        def que = obj.quePai
        def openid = obj.openid
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        if (gameRound) {
            gameRound.gameUser.each { gameU ->
                if (gameU.springUser.openid.equals(openid)) {
                    gameU.quePai = que
                    gameU.save(flush: true, failOnError: true)
                }
            }

        }
    }


    def checkQuePaiDone(MessageDomain messageDomain){
        boolean  checkque=true;
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;

        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        if (gameRound) {
            gameRound.gameUser.each { gameU ->
                if(gameU.quePai){

                }else{
                    checkque=false;
                }

            }

        }

        return checkque
    }

    //----change user status--------------------------------
    //The user already exist in the Room

    def joinExitRoom(MessageDomain messageDomain) {
        def openid = messageDomain.messageBody;
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        def paiStr = ""
        def index = 1
        if (gameRound) {
            def gameUserListArray = []
            gameRound.gameUser.each { gameU ->
                GameUserPlatObj outputUser = new GameUserPlatObj()

                outputUser.id = gameU.id
                outputUser.nickName = gameU.springUser.nickname
                outputUser.openid = gameU.springUser.openid
                outputUser.headimgurl = gameU.springUser.headimgurl
                outputUser.unionid = gameU.springUser.unionid
                outputUser.userCode = gameU.springUser.userCode
                def onlineUser2 = OnlineUser.findBySpringUser(gameU.springUser)
                if (onlineUser2) {
                    outputUser.publicIp = onlineUser2.publicIPAddress
                } else {
                    outputUser.publicIp = "no found"
                }

                outputUser.paiList = ""
                outputUser.gameRoundScore = gameU.gameRoundScore
                outputUser.gameScoreCount = gameU.gameScoreCount
                outputUser.gameReadyStatu = gameU.gameReadyStatu
                outputUser.headImageFileName = gameU.headImageFileName

                outputUser.openid = gameU.springUser.openid
                outputUser.zhuang = gameU.zhuang

                if (gameU.paiList) {
                    outputUser.paiList = gameU.paiList.join(",")
                }

                outputUser.quePai = gameU.quePai

                gameUserListArray.add(outputUser)

            }

            Collections.sort(gameUserListArray, new CustomComparatorForGameUserPlatObj());
            paiStr = JsonOutput.toJson(gameUserListArray);
            print "join paiStr 97:" + paiStr
            def gameMode = gameRound.gameMode
            GameModeJson gmjson = new GameModeJson()
            gmjson = myUtil.gameModeToJsonObject(gameMode, gmjson)
            def gmStr = JsonOutput.toJson(gmjson);
            print "join paiStr gameModeStr:" + gmStr
            JoinRoom jr = new JoinRoom()
            jr.gameMode = gmStr
            jr.userList = paiStr
            paiStr = JsonOutput.toJson(jr);
        }

        return paiStr
    }

    def joinRoom(MessageDomain messageDomain) {
        ActionMessageDomain actionMessageDomain = new ActionMessageDomain()
        def openid = messageDomain.messageBody;
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        if (openid) {
            SpringUser user = SpringUser.findByOpenid(openid)
            if (user) {
                OnlineUser onlineUser = OnlineUser.findBySpringUser(user)
                onlineUser.onlineStau=1
                onlineUser.save(flush: true, failOnError: true)
                GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
                if (onlineRoomNumber) {
                    GameRound gameRound = onlineRoomNumber.gameRound
                    if (gameRound) {
                        def gameRoundLun=gameRound.gameRoundLun
                        if(gameRoundLun){
                            user.addToGameRoundLun(gameRoundLun)
                            user.save(flush: true, failOnError: true)
                        }
                        def gameMode = gameRound.gameMode
                        def gameUserList = gameRound.gameUser
                        def exist = false
                        def firstUserFlag=false
                        GameUser gu = null
                        if (gameUserList) {


                            gameUserList.each { gameU ->

                                if (gameU.springUser.openid.equals(openid)) {
                                    exist = true
                                    gu = gameU
                                }

                            }
                        }else{
                            firstUserFlag=true
                        }

                        if (!exist) {
                            gu = new GameUser()
                            gu.springUser = user
                            gu.gameReadyStatu = "0"
                            gu.gameRoundScore = 0
                            gu.gameScoreCount = 1000
                            gu.publicIp = onlineUser.publicIPAddress
                            gu.headImageFileName = user.headImageFileName
                            gu.joinRoundTime = new Date()
                            gu.gameRound = gameRound
                            gu.save(flush: true, failOnError: true)
                            gameRound.addToGameUser(gu)
                            gameRound.save(flush: true, failOnError: true)
                        } else {
                            // gu.headImageFileName= user.headImageFileName
                            // gu.save(flush: true, failOnError: true)
                        }

                        if(firstUserFlag){
                            gu.zhuang="1"
                            gu.save(flush: true, failOnError: true)
                        }

                        gameUserList = gameRound.gameUser

                        def gameUserListArray = []
                        gameUserList.each { gameU ->
                            GameUserPlatObj outputUser = new GameUserPlatObj()
                            outputUser.id = gameU.id
                            outputUser.nickName = gameU.springUser.nickname
                            outputUser.openid = gameU.springUser.openid
                            outputUser.headimgurl = gameU.springUser.headimgurl
                            outputUser.unionid = gameU.springUser.unionid
                            outputUser.userCode = gameU.springUser.userCode
                            def onlineUser2 = OnlineUser.findBySpringUser(gameU.springUser)
                            if (onlineUser2) {
                                outputUser.publicIp = onlineUser2.publicIPAddress
                            } else {
                                outputUser.publicIp = "no found"
                            }

                            outputUser.paiList = ""
                            outputUser.gameRoundScore = gameU.gameRoundScore
                            outputUser.gameScoreCount = gameU.gameScoreCount
                            outputUser.gameReadyStatu = gameU.gameReadyStatu
                            outputUser.headImageFileName = gameU.springUser.headImageFileName
                            outputUser.zhuang = gameU.zhuang
                            if(gameU.springUser.gameCount){
                                outputUser.totalCount=gameU.springUser.gameCount.toString()
                            }else{
                                outputUser.totalCount="0"
                            }
                            if(gameU.springUser.winCount){
                                outputUser.winCount=gameU.springUser.winCount.toString()
                            }else{
                                outputUser.winCount="0"
                            }


                            def readyUserInfo = LoingUserInfo.findAllByUserOpeid(gameU.springUser.openid, [sort: 'loginTime']).last()
                            if(readyUserInfo){
                                outputUser.longitude=readyUserInfo.longitude
                                outputUser.latitude=readyUserInfo.latitude
                            }

                            gameUserListArray.add(outputUser)

                        }

                        //gameUserListArray.s
                        actionMessageDomain.messageExecuteFlag = "success"
                        Collections.sort(gameUserListArray, new CustomComparatorForGameUserPlatObj());
                        // print "115"
                        def s = JsonOutput.toJson(gameUserListArray);
                        // print "117"
                        GameModeJson gmjson = new GameModeJson()
                        gmjson = myUtil.gameModeToJsonObject(gameMode, gmjson)
                        def gmStr = JsonOutput.toJson(gmjson);
                        //  print "119"
                        JoinRoom jr = new JoinRoom()
                        jr.gameMode = gmStr
                        jr.userList = s
                        s = JsonOutput.toJson(jr);
                        //s=myUtil.fixJsonStr(s)
                        actionMessageDomain.messageExecuteResult = s
                        print "join s:" + s
                        //actionMessageDomain
                        //messageDomain.messageBody="success:"+openid

                    }
                } else {
                    actionMessageDomain.messageExecuteFlag = "fail"
                    actionMessageDomain.messageExecuteResult = "房间号出错,请检查后重新输入!"
                    //messageDomain.messageBody=""
                }

            } else {
                actionMessageDomain.messageExecuteFlag = "fail"
                actionMessageDomain.messageExecuteResult = "不能查找到该用户:" + openid
            }
        } else {
            actionMessageDomain.messageExecuteFlag = "fail"
            actionMessageDomain.messageExecuteResult = "不能发现openid"
        }
        def s2 = JsonOutput.toJson(actionMessageDomain)
        // s2=myUtil.fixJsonStr(s2)
        messageDomain.messageBody = s2

        return messageDomain
    }

    def joinNoExistRoom(MessageDomain messageDomain) {
        ActionMessageDomain actionMessageDomain = new ActionMessageDomain()
        actionMessageDomain.messageExecuteFlag = "fail"
        actionMessageDomain.messageExecuteResult = "此房间号码不正确,请检查后重新输入!"
        def s2 = JsonOutput.toJson(actionMessageDomain)
        messageDomain.messageBody = s2

        return messageDomain
    }

    def joinFullRoom(MessageDomain messageDomain) {
        ActionMessageDomain actionMessageDomain = new ActionMessageDomain()
        actionMessageDomain.messageExecuteFlag = "fail"
        actionMessageDomain.messageExecuteResult = "此房间人数已满,请加入别的房间!"
        def s2 = JsonOutput.toJson(actionMessageDomain)
        messageDomain.messageBody = s2

        return messageDomain
    }

    def joinGPSLimitRoom(MessageDomain messageDomain, gpsStatus) {
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound
        def distanceLimit
        if (onlineRoomNumber) {
            gameRound = onlineRoomNumber.gameRound
            def gameMode = gameRound.gameRoundLun.gameMode
            distanceLimit = gameMode.gpsLimit
        }
        ActionMessageDomain actionMessageDomain = new ActionMessageDomain()
        actionMessageDomain.messageExecuteFlag = "fail"
        //0, no gps open for join user
        //1, no gps open for room ownser
        //2, gps open,  no gps limit
        //3, gps open,gps limit not pass
        //4, gps open ,gps limit pass
        //5, have gps limit

        //6.no gps open for join user ,but gps require
        //7.no gps open for room ownser,but gps require
        //8.no gps limit.
        def failMessage = "";
        if (gpsStatus == 6) {
            failMessage = "此房间已开启地理位置限制,但是你没有打开GPS,请打开本机上的GPS设置,并对该游戏允许GPS权限。"
        }else if (gpsStatus == 7) {
            failMessage = "此房间已开启地理位置限制,但是房主没有打开GPS,不能获取到其地理位置信息,请告诉房主关闭GPS限制,或者开启GPS。"
        }else if (gpsStatus == 3) {
            failMessage = "此房间已开启地理位置限制,要求位置距离大于:" + distanceLimit + "Km 才能加入。"
        }else{
            failMessage = "此房间已开启地理位置限制,要求位置距离大于:" + distanceLimit + "Km 才能加入。"
        }
        actionMessageDomain.messageExecuteResult = failMessage+"###"+messageDomain.messageBody
        def s2 = JsonOutput.toJson(actionMessageDomain)
        messageDomain.messageBody = s2

        return messageDomain
    }



    def getAllGameRoundByUser(MessageDomain messageDomain){

        ArrayList roundList=new ArrayList()
        //open id ,current index
        ClientGaneRoundParameterObj gameRoundClient = JSON.parse(messageDomain.messageBody);
        def openid=gameRoundClient.openid
        if(openid){
            SpringUser springUser=SpringUser.findByOpenid(openid)
            def GameRoundLunList=springUser.gameRoundLun
            if(GameRoundLunList){
                println ":"+GameRoundLunList.size()
                GameRoundLunList.each{gameLun->
                    println "gameLun:"+gameLun.id
                    def gameRoundList=gameLun.gameRound
                    if(gameRoundList){
                        println "gameRoundList.size:"+gameRoundList.size()
                        gameRoundList.each{gameRound->
                            println "gameRound.gameStep:"+gameRound.gameStep.size()
                            println "gameRound.gameRound:"+gameRound.id
                            if(gameRound.gameStep){

                                GameRoundPlatObj  gameRoundPlatObj=new GameRoundPlatObj()
                                gameRoundPlatObj.startTime=gameRound.startTime.format("yyyy-MM-dd HH:mm:ss")
                                gameRoundPlatObj.roomNumber=gameRound.roomNumber.roomNumber

                                roundList.add(gameRoundPlatObj)

                            }

                        }

                    }

                }
            }
        }

        if(roundList.size()>0){
            def s=new JsonBuilder(roundList).toPrettyString()
            GameRoundListPage gameRoundListPage=new GameRoundListPage()

            return s
        }else{
            return ""
        }

    }
    /**
     * Check the all user if already start
     * @param messageDomain
     */
    def checkAllUserStatus(MessageDomain messageDomain) {
        def flag = false;
        def readFlag = true;
        def peopleGameModeNumber = 0;
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        def  zhuangUser
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        def gameRoundLun
        if (gameRound) {
            gameRoundLun= gameRound.gameRoundLun
            if (gameRoundLun) {
                def gameMode = gameRoundLun.gameMode
                if (gameMode) {
                    peopleGameModeNumber = gameMode.gamePeopleNumber
                }
            }

            def gameUsersCount = gameRound.gameUser.size() + ""
            def gameUsers = gameRound.gameUser
            if (peopleGameModeNumber + "" == gameUsersCount) {
                flag = true;

                gameUsers.each { gu ->

                    if (gu.gameReadyStatu != "1") {
                        readFlag = false
                    }

                    if(gu.zhuang=="1"){
                        zhuangUser=gu
                    }

                }
            }
        }

        if (flag == true && readFlag == true) {

            //check if need - domend number
            def curentCount = gameRoundLun.currentRoundCount
            if (curentCount == 0 ||curentCount == 1) {
                def gameMode=gameRoundLun.gameMode
                if(zhuangUser){
                    ruseduDemond(gameMode,zhuangUser,messageDomain)
                }



            }


            return true
        } else {
            return false
        }
    }


    def ruseduDemond(GameMode gameMode,GameUser gu,MessageDomain messageDomain){


        def needRecuse =0
        if(gameMode.roundCount4+""=="1"){
            needRecuse=2
        }
        if(gameMode.roundCount8+""=="1"){
            needRecuse=3
        }
        println  "ruseduDemond  ruseduDemond:"+needRecuse

       // gameRound.gameUser.each{gu->

            if(gu.zhuang=="1"){
                SpringUser spUser=gu.springUser
                spUser.diamondsNumber=spUser.diamondsNumber-needRecuse
                spUser.save(flush: true, failOnError: true)

                def useropenid=spUser.openid

                //push to client updaet to UI
                UserInfo userInfo = new UserInfo()
                userInfo.openid=useropenid
                userInfo.diamondsNumber=spUser.diamondsNumber
                MessageDomain newMessageObj = new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber = messageDomain.messageBelongsToPrivateChanleNumber
                newMessageObj.messageAction = "updateDiamond"
                newMessageObj.messageBody =new JsonBuilder(userInfo).toPrettyString()
                newMessageObj.messageType = "gameAction"
                def s2 = JsonOutput.toJson(newMessageObj)
                websokectService.privateUserChanelByRoomNumber(messageDomain.messageBelongsToPrivateChanleNumber, s2)

           // }

        }

    }
    /**
     * Execute huan san zhang
     * @param messageDomain
     */

    def executeHuanSanZhang(MessageDomain messageDomain) {

    }
    /**
     *
     * @param messageDomain
     */
    def setHuanSanZhang(MessageDomain messageDomain) {
        def flag = "false"
        def obj = JSON.parse(messageDomain.messageBody)
        def openid = obj.openid
        def paiList = obj.huanSanZhangPaiList
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        println "setHuanSanZhang roomNumber:" + roomNumber
        GameRoomNumber onlineRoomNumber

        GameRoomNumber.withTransaction {
            onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)

            println "setHuanSanZhang roomNumber2:" + roomNumber
            GameRound gameRound = onlineRoomNumber.gameRound
            def gameRoundLun = gameRound.gameRoundLun
            def gameMode = gameRoundLun.gameMode
            def peopleGameModeNumber = 0;
            if (gameMode) {
                peopleGameModeNumber = gameMode.gamePeopleNumber
            }
            if (openid) {

                SpringUser user = SpringUser.findByOpenid(openid)
                if (user) {
                    GameUser gu = null
                    def gameUserList = gameRound.gameUser
                    def peopleCount = 0
                    gameUserList.each { gameU ->
                        if (openid == gameU.springUser.openid) {
                            gu = gameU
                        }
                        if (gameU.huanSanZhang) {
                            peopleCount++
                        }
                    }

                    if (gu) {
                        gu.huanSanZhang = paiList
                        gu.save(flush: true, failOnError: true)
                        peopleCount++
                    }
                    println "setHuanSanZhang peopleCount:" + peopleCount
                    println "setHuanSanZhang peopleGameModeNumber:" + peopleGameModeNumber
                    if (peopleCount.toInteger() >= peopleGameModeNumber.toInteger()) {
                        flag = "true"
                    }

                }


            }
        }
        println "setHuanSanZhang roomNumber flag:" + flag
        return flag

    }

    def updateUserLocation(MessageDomain messageDomain) {


        println "updateUserLocation:" + messageDomain.messageBody

        def obj = JSON.parse(messageDomain.messageBody)
        def openid = obj.openid

        if (openid) {
            def SpringUser user = SpringUser.findByOpenid(openid)
            if (user) {


                def longitude = Double.parseDouble(obj.longitude)
                def latitude = Double.parseDouble(obj.latitude)
                def loginInfo = LoingUserInfo.findAllByUserOpeid(user.openid, [sort: 'loginTime']).last()
                if (loginInfo) {
                    loginInfo.longitude = longitude
                    loginInfo.latitude = latitude
                    loginInfo.save(flush: true, failOnError: true)
                }

            }
        }
        return true
    }


    def kouFenByOpenId(MessageDomain messageDomain){

        def obj = JSON.parse(messageDomain.messageBody)

        def useropenid=obj.openid
        def maxFen=obj.maxFen
        if(useropenid){
            SpringUser springUser=SpringUser.findByOpenid(useropenid)
            if(springUser){
                if(springUser.gameScroe){
                    //user.roundScoreCount.toInteger()
                    springUser.gameScroe=springUser.gameScroe-maxFen.toInteger()
                }else{
                    springUser.gameScroe=0-maxFen.toInteger()
                }
            }

            //remove the online user

            def onlineUseList=OnlineUser.findAllBySpringUser(springUser)
            if(onlineUseList){
                onlineUseList.each{
                    it.delete(flush: true, failOnError: true)
                }
            }
        }

    }

    /**
     * Change the user status
     * @param messageDomain
     * @return
     */
    def changeUserStatus(MessageDomain messageDomain) {
        //if all user already be ready ,it should be fapai
        //otherwise ,it should be change the statu of user
        def obj = JSON.parse(messageDomain.messageBody)
        ActionMessageDomain actionMessageDomain = new ActionMessageDomain()
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        println "changeUserStatus roomNumber:" + roomNumber
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        def userReadyStatu = obj.userReadyStatu
        println "changeUserStatus userReadyStatu:" + userReadyStatu
        def openid = obj.openid
        if (openid) {

            SpringUser user = SpringUser.findByOpenid(openid)
            if (user) {
                GameUser gu = null
                def gameUserList = gameRound.gameUser
                gameUserList.each { gameU ->
                    if (openid == gameU.springUser.openid) {
                        gu = gameU
                    }
                }

                if (gu) {
                    gu.gameReadyStatu = userReadyStatu

                    gu.save(flush: true, failOnError: true)
                    println("changeUserStatus gu:" + gu.id)
                    println("changeUserStatus gu openid :" + gu.springUser.openid)
                    println("changeUserStatus gu gameReadyStatu:" + gu.gameReadyStatu)
                    //messageDomain.messageBody = "success:" + openid


                    def gameUserListArray = []
                    gameUserList.each { gameU ->
                        println("changeUserStatus gameU id :" + gameU.id)
                        println("changeUserStatus gameU openid :" + gameU.springUser.openid)
                        println("changeUserStatus gameU gameReadyStatu:" + gameU.gameReadyStatu)
                        GameUserPlatObj outputUser = new GameUserPlatObj()

                        outputUser.openid = gameU.springUser.openid

                        outputUser.gameReadyStatu = gameU.gameReadyStatu

                        gameUserListArray.add(outputUser)

                    }



                    Collections.sort(gameUserListArray, new CustomComparatorForGameUserPlatObj());
                    def s = JsonOutput.toJson(gameUserListArray);

                    actionMessageDomain.messageExecuteFlag = "success"
                    actionMessageDomain.messageExecuteResult = s

                } else {

                    actionMessageDomain.messageExecuteFlag = "fail"
                    actionMessageDomain.messageExecuteResult = "no found game user"

                }
            } else {
                actionMessageDomain.messageExecuteFlag = "fail"
                actionMessageDomain.messageExecuteResult = "no found spring user"
            }
        } else {
            actionMessageDomain.messageExecuteFlag = "fail"
            actionMessageDomain.messageExecuteResult = "openid is invaid"

        }


        def s2 = JsonOutput.toJson(actionMessageDomain)
        println "changeUserStatus:" + s2
        messageDomain.messageBody = s2

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

    def getUserInfoFromSpringUserBySpringUser(SpringUser springUser, def publicIp) {
        def onlineUser = OnlineUser.findBySpringUser(springUser)
        if (!onlineUser) {
            onlineUser = new OnlineUser()
        }

        onlineUser.springUser = springUser

        onlineUser.onlineTime = new Date()
        onlineUser.roomNumber = gameRoomNumberService.getRandomRoomNumber()
        onlineUser.publicIPAddress = publicIp
        onlineUser.save(flush: true, failOnError: true)
        //update login info record
        def userLoginInfo = new LoingUserInfo()
        userLoginInfo.ipAddress = publicIp
        userLoginInfo.loginTime = new Date()


        def userOpenid = springUser.openid
        def url = springUser.headimgurl
        //if (!noOnlineUser.headImageFileName) {
        def headImageName = getHeadImage(url, userOpenid)
        if (headImageName) {
            springUser.headImageFileName = headImageName
        }
        userLoginInfo.userOpeid = userOpenid
        userLoginInfo.save(flush: true, failOnError: true)
        springUser.addToLoginUserInfo(userLoginInfo)
        springUser.save(flush: true, failOnError: true)



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
        userInfo.webChatUserCode = onlineUser.springUser.webChatUserCode;
        userInfo.gameScroe=onlineUser.springUser.gameScroe
        if (springUser.headImageFileName) {
            userInfo.headImageFileName = springUser.headImageFileName
        } else {
            userInfo.headImageFileName = ""
        }
        def lastMessageList=PublicMessage.list()
        if(lastMessageList) {
            def lastMessage = lastMessageList.last()
            if (lastMessage) {
                userInfo.publicMessage = lastMessage.message
            } else {
                userInfo.publicMessage = "欢迎加入乐乐四川麻将"
            }
        }else{
            userInfo.publicMessage = "欢迎加入乐乐四川麻将"
        }

        //get if user already own join room
        OnlineUser alreadyExistOnline=OnlineUser.findBySpringUserAndOnlineStau(onlineUser.springUser,3)
        if(alreadyExistOnline){
            userInfo.onlineRoomNumber=alreadyExistOnline.roomNumber
            userInfo.onlineStatus=alreadyExistOnline.onlineStau
        }


        //set the ssesion
//        def session = RequestContextHolder.currentRequestAttributes().getSession()
//        session.useropnid=userInfo.openid
//
//        println "serer user openid:"+session.useropnid



        def s = new JsonBuilder(userInfo).toPrettyString()
        return s
    }

    def getUserInfoFromSpringUserByCode(String userCode, def publicIp) {
        def s
        def findFlag = false;
        def userOpenid = ""
        // def session = RequestContextHolder.currentRequestAttributes().getSession()
        if (userCode.equalsIgnoreCase("test")) {

            def sprinUserlist = SpringUser.list()
            def userIndex = 1
            println "getUserInfoFromSpringUserByCode1 sprinUserlist:" + sprinUserlist.size()
            def noOnlineUser
            def onlineUser
            for (int i = 1; i < 5; i++) {
                def name = "userCode" + i
                def user = SpringUser.findByUserCode(name)
                onlineUser = OnlineUser.findBySpringUser(user)
                if (!onlineUser) {
                    noOnlineUser = user;
                    break;
                }
            }

            if (!noOnlineUser) {
                noOnlineUser = SpringUser.findByUserCode("userCode4")

            }


            if (!onlineUser) {
                onlineUser = new OnlineUser()
            }

            onlineUser.springUser = noOnlineUser

            onlineUser.onlineTime = new Date()
            onlineUser.roomNumber = gameRoomNumberService.getRandomRoomNumber()
            onlineUser.publicIPAddress = publicIp
            onlineUser.save(flush: true, failOnError: true)
            //update login info record
            def userLoginInfo = new LoingUserInfo()
            userLoginInfo.ipAddress = publicIp
            userLoginInfo.loginTime = new Date()
            //userLoginInfo.save(flush: true, failOnError: true)

            def url = "http://wx.qlogo.cn/mmopen/Po9mkm3Z42tolYpxUVpY6mvCmqalibOpcJ2jG3Qza5qgtibO1NLFNUF7icwCibxPicbGmkoiciaqKEIdvvveIBfEQqal8vkiavHIeqFT/96"
            userOpenid = noOnlineUser.openid

            userLoginInfo.userOpeid = userOpenid
            //if (!noOnlineUser.headImageFileName) {
            def headImageName = getHeadImage(url, userOpenid)
            if (headImageName) {
                noOnlineUser.headImageFileName = headImageName
            }
            //}

            noOnlineUser.addToLoginUserInfo(userLoginInfo)
            noOnlineUser.save(flush: true, failOnError: true)

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
            if (noOnlineUser.headImageFileName) {
                userInfo.headImageFileName = noOnlineUser.headImageFileName
            } else {
                userInfo.headImageFileName = ""
            }



            s = new JsonBuilder(userInfo).toPrettyString()
            //return false

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

    def getHeadImage(def url, def userOpenId) {
        //1.first check the img if exist or not exist
        def fileImageName = "";
        def fileExistFlag = false;
        def testfileName = "src/main/webapp/webchatImage/" + userOpenId + ".jpg"
        File testf = new File(testfileName)
        if (testf.exists()) {
            fileExistFlag = true;
            fileImageName = userOpenId + ".jpg"
        }

        testfileName = "src/main/webapp/webchatImage/" + userOpenId + ".png"
        testf = new File(testfileName)
        if (testf.exists()) {
            fileExistFlag = true;
            fileImageName = userOpenId + ".png";
        }
        if (!fileExistFlag) {
            URL url2 = new URL(url);
            URLConnection conn = url2.openConnection();
            //def imageType=resp.getHeader("Content-Type")
            def imageType = conn.getHeaderField("Content-Type");
            imageType = imageType.replaceAll("image", "")
            imageType = imageType.substring(1)
            if (imageType.equals("jpeg")) {
                imageType = "jpg"
            }
            fileImageName = userOpenId + "." + imageType
            def fileName = "src/main/webapp/webchatImage/" + fileImageName
            File f = new File(fileName)
            if (f.exists()) {
                f.delete()
            }

            InputStream is = url2.openStream();
            println "conn.inputStream:" + conn.inputStream.bytes.length
            println "fileName:" + fileName
            //InputStream is = conn.inputStream
            FileOutputStream fos = new FileOutputStream(new File(fileName))

            byte[] b = new byte[2048];
            int length;

            while ((length = is.read(b)) != -1) {
                fos.write(b, 0, length);
            }

            // fos.write(buffer)
            //resp.inputStream.close()
            fos.close();
        } else {

        }

        return fileImageName
        //def http = new HTTPBuilder( urlAuthPage )
        /* AsyncHttpBuilder client = new AsyncHttpBuilder()
         Promise<HttpClientResponse> p = client.get(url)
         p.onComplete { HttpClientResponse resp ->

         }*/
    }

}
