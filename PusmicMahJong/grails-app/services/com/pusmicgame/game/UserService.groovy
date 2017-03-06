package com.pusmicgame.game

import com.pusmic.game.mahjong.LoingUserInfo
import com.pusmic.game.mahjong.OnlineUser
import com.pusmic.game.mahjong.SpringUser
import com.pusmicgame.domain.ActionMessageDomain
import com.pusmicgame.domain.GameModeJson
import com.pusmicgame.domain.GameUserPlatObj
import com.pusmicgame.domain.JoinRoom
import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.domain.UserInfo
import com.pusmicgame.mahjong.Utils

import grails.transaction.Transactional
import grails.converters.JSON
import groovy.json.JsonBuilder
import groovy.json.JsonOutput


import com.pusmicgame.utils.CustomComparatorForGameUserPlatObj

@Transactional
class UserService {

    def grailsApplication

    def myUtil = new Utils()

    private getGameRoomNumberService() {
        grailsApplication.mainContext.gameRoomNumberService
    }

    def updateQuePaiForUser(MessageDomain messageDomain){
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        def obj = JSON.parse(messageJsonObj.messageBody)
        def que=obj.quePai
        def openid=obj.openid
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        if(gameRound) {
            gameRound.gameUser.each { gameU ->
                if(gameU.springUser.openid.equals(openid)){
                    gameU.quePai=que
                    gameU.save(flush: true, failOnError: true)
                }
            }

        }
    }

    //----change user status--------------------------------
    //The user already exist in the Room

    def joinExitRoom(MessageDomain messageDomain) {
        def openid = messageDomain.messageBody;
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        def paiStr=""
        def index=1
        if(gameRound) {
            def gameUserListArray = []
            gameRound.gameUser.each{gameU->
                GameUserPlatObj outputUser = new GameUserPlatObj()

                outputUser.id = gameU.id
                outputUser.nickName = gameU.springUser.nickname
                outputUser.openid = gameU.springUser.openid
                outputUser.headimgurl = gameU.springUser.headimgurl
                outputUser.unionid = gameU.springUser.unionid
                outputUser.userCode = gameU.springUser.userCode
                def onlineUser2 = OnlineUser.findBySpringUser(gameU.springUser)
                if (onlineUser2) {
                    outputUser.publicIp = onlineUser.publicIPAddress
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

                outputUser.paiList = gameU.paiList.toString()
                outputUser.quePai  =gameU.quePai

                gameUserListArray.add(outputUser)

            }

            Collections.sort(gameUserListArray, new CustomComparatorForGameUserPlatObj());
            paiStr = JsonOutput.toJson(gameUserListArray);
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
                GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
                if (onlineRoomNumber) {
                    GameRound gameRound = onlineRoomNumber.gameRound
                    if (gameRound) {
                        def gameMode = gameRound.gameMode
                        def gameUserList = gameRound.gameUser
                        def exist = false
                        GameUser gu = null
                        if (gameUserList) {


                            gameUserList.each { gameU ->

                                if (gameU.springUser.openid.equals(openid)) {
                                    exist = true
                                    gu = gameU
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
                            gu.headImageFileName = user.headImageFileName
                            gu.joinRoundTime = new Date()
                            gu.gameRound = gameRound
                            gu.save(flush: true, failOnError: true)
                            gameRound.addToGameUser(gu)
                            gameRound.save(flush: true, failOnError: true)
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
                                outputUser.publicIp = onlineUser.publicIPAddress
                            } else {
                                outputUser.publicIp = "no found"
                            }

                            outputUser.paiList = ""
                            outputUser.gameRoundScore = gameU.gameRoundScore
                            outputUser.gameScoreCount = gameU.gameScoreCount
                            outputUser.gameReadyStatu = gameU.gameReadyStatu
                            outputUser.headImageFileName = gameU.headImageFileName
                            gameUserListArray.add(outputUser)

                        }

                        //gameUserListArray.s
                        actionMessageDomain.messageExecuteFlag = "success"
                        Collections.sort(gameUserListArray, new CustomComparatorForGameUserPlatObj());
                        print "115"
                        def s = JsonOutput.toJson(gameUserListArray);
                        print "117"
                        GameModeJson gmjson = new GameModeJson()
                        gmjson = myUtil.gameModeToJsonObject(gameMode, gmjson)
                        def gmStr = JsonOutput.toJson(gmjson);
                        print "119"
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
    /**
     * Check the all user if already start
     * @param messageDomain
     */
    def checkAllUserStatus(MessageDomain messageDomain){
        def flag=false;
        def readFlag=true;
        def peopleGameModeNumber=0;
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        if(gameRound){
            def gameRoundLun=gameRound.gameRoundLun
            if(gameRoundLun){
                def gameMode=gameRoundLun.gameMode
                if(gameMode){
                    peopleGameModeNumber=gameMode.gamePeopleNumber
                }
            }

            def gameUsersCount=gameRound.gameUser.size()+""
            def gameUsers=gameRound.gameUser
            if(peopleGameModeNumber+""==gameUsersCount){
                flag=true;

                gameUsers.each {gu->

                    if(gu.gameReadyStatu!="1"){
                        readFlag=false
                    }

                }
            }
        }

        if(flag==true &&readFlag ==true ){
            return true
        }else{
            return false
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
        def flag="false"
        def obj = JSON.parse(messageDomain.messageBody)
        def openid = obj.openid
        def paiList =obj.huanSanZhangPaiList
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        println "setHuanSanZhang roomNumber:"+roomNumber
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
                    println "setHuanSanZhang peopleCount:"+peopleCount
                    println "setHuanSanZhang peopleGameModeNumber:"+peopleGameModeNumber
                    if (peopleCount.toInteger() >= peopleGameModeNumber.toInteger()) {
                        flag = "true"
                    }

                }


            }
        }
        println "setHuanSanZhang roomNumber flag:"+flag
        return flag

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
        println "changeUserStatus roomNumber:"+roomNumber
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        def userReadyStatu = obj.userReadyStatu
        println "changeUserStatus userReadyStatu:"+userReadyStatu
        def openid = obj.openid
        if (openid) {

            SpringUser user = SpringUser.findByOpenid(openid)
            if (user) {
                GameUser gu =null
                def gameUserList = gameRound.gameUser
                gameUserList.each { gameU ->
                    if( openid == gameU.springUser.openid){
                        gu=gameU
                    }
                }

                if (gu) {
                    gu.gameReadyStatu = userReadyStatu

                    gu.save(flush: true, failOnError: true)
                    println ("changeUserStatus gu:"+gu.id)
                    println ("changeUserStatus gu openid :"+gu.springUser.openid)
                    println ("changeUserStatus gu gameReadyStatu:"+gu.gameReadyStatu)
                    //messageDomain.messageBody = "success:" + openid





                    def gameUserListArray = []
                    gameUserList.each { gameU ->
                        println ("changeUserStatus gameU id :"+gameU.id)
                        println ("changeUserStatus gameU openid :"+gameU.springUser.openid)
                        println ("changeUserStatus gameU gameReadyStatu:"+gameU.gameReadyStatu)
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
        println "changeUserStatus:"+s2
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
            println "conn.inputStream:"+conn.inputStream.bytes.length
            println  "fileName:"+fileName
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
