package com.pusmicgame.game

import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.domain.ShowActionBarObj
import grails.converters.JSON
import grails.transaction.Transactional
import groovy.json.JsonBuilder
import org.apache.commons.logging.Log
import groovy.util.logging.Log4j

import grails.util.Holders

@Transactional
@Log4j
class ShowActionBarService {
    def websokectService

    def serviceMethod() {

    }

    def sendActionBar(MessageDomain messageJsonObj) {
        def obj = JSON.parse(messageJsonObj.messageBody);
        //First check the SQL db if already have other action bar ,if
    }

    def handelCancleAcion(def obj, def roomNumber) {

    }

    def handelHuAcion(def obj, def roomNumber) {
        def allActionDoneFlag = false;

        def huUserOpenId = obj.fromUserOpenid
        def reocrd = ShowActionBarCache.findByShowUserOpenIdAndRoomNumber(huUserOpenId, roomNumber)
        if (reocrd) {
            reocrd.delete(flush: true, failOnError: true)
        }

        def otherRecord = ShowActionBarCache.findAllByRoomNumber(roomNumber)
        if (!otherRecord) {
            allActionDoneFlag = true
        } else {
            //it stil exist other action ,check if it is noHU action
            boolean existHuFlag = false;
            otherRecord.each {
                if (it.actionArrayString.toString().contains("hu")) {
                    //
                    existHuFlag = true;
                }
            }
            //it only contain other action user ,no hu action ,it need send no hu action  to  user

            if (!existHuFlag) {
                def huObj = otherRecord.get(0)
                if (huObj) {
                    //it must need to be remove from SQL
                    sendActionBarToUser(huObj, roomNumber, "1");
                }

            }

        }

        return allActionDoneFlag

    }

    //-----------------------send show action bar object to user by roomnumber----------------------------------------------
    def sendActionBarToUser(huObj, roomNumber, needWait) {
        Date now=new Date();

        println now.toString()+":start sendActionBarToUser..."
        ShowActionBarObj showActionBarObj = new ShowActionBarObj()
        showActionBarObj.fromUserOpenid = huObj.showUserOpenId
        showActionBarObj.actionName = "showActionBar"
        if(huObj.actionArrayString){
            showActionBarObj.actionArrayStr = huObj.actionArrayString
        }else{
            showActionBarObj.actionArrayStr = ""
        }

        showActionBarObj.paiNumber = huObj.paiNumber

        showActionBarObj.otherActionStr = "";
        def s = new JsonBuilder(showActionBarObj).toPrettyString()

        MessageDomain newMessageObj = new MessageDomain()
        newMessageObj.messageBelongsToPrivateChanleNumber = roomNumber
        newMessageObj.messageAction = "gameAction"
        newMessageObj.messageBody = s
        newMessageObj.messageType = "gameAction"
        def s2 = new JsonBuilder(newMessageObj).toPrettyString()

        websokectService.privateUserChanelByRoomNumber(newMessageObj.messageBelongsToPrivateChanleNumber, s2)

    }
    /**
     * This function will create the all action return record for each user
     * @param gameStepId
     * @param joinRoomNumber
     * @return
     */

    def createActionBarRecordForAllUser(def gameStepId, def joinRoomNumber) {
        //def session = RequestContextHolder.currentRequestAttributes().getSession()
        def  servletContext=Holders.getServletContext()
        def keyword=joinRoomNumber+"_"+gameStepId
        def showActionList=[];
        GameRoomNumber gameRoomNumber = GameRoomNumber.findByRoomNumber(joinRoomNumber)
        if (gameRoomNumber) {
            GameRound gameRound = gameRoomNumber.gameRound
            if (gameRound) {

                gameRound.gameUser.each {
                    ShowActionBarCache showActionBarCache = new ShowActionBarCache()
                    showActionBarCache.showUserOpenId = it.springUser.openid
                    showActionBarCache.actionArrayString = ""
                    showActionBarCache.paiNumber = ""
                    showActionBarCache.roomNumber = joinRoomNumber
                    showActionBarCache.gameStepId = gameStepId
                    showActionBarCache.addTime = new Date()
                    showActionBarCache.gameActionSatau = ""
                    showActionList.add(showActionBarCache)
                    //showActionBarCache.save(flush: true, failOnError: true)
                }

            }
        }

        servletContext[keyword]=showActionList;


    }


    def updateActionBarForUser(def obj, def roomNumber) {

        def  servletContext=Holders.getServletContext()
        def keyWord=roomNumber+"_"+obj.gameStepId
        def showActionList=servletContext[keyWord]

       // ShowActionBarCache showActionBarCache = ShowActionBarCache.findByGameStepIdAndShowUserOpenId(obj.gameStepId, obj.fromUserOpenid)
        if(showActionList) {
            //ShowActionBarCache showActionBarCache=null
            showActionList.each{showActionBarCache ->
                if(showActionBarCache.showUserOpenId.toString().equals(obj.fromUserOpenid)){
                    if (showActionBarCache) {
                        //if(showActionBarCache.showUserOpenId.equals(obj.fromUserOpenid)){
                        showActionBarCache.actionArrayString = obj.actionArrayStr
                        if (obj.paiNumber) {
                            showActionBarCache.paiNumber = obj.paiNumber
                        }

                        if (obj.actionArrayStr) {
                            if (obj.actionArrayStr.toString().contains("hudone")) {
                                showActionBarCache.gameActionSatau = "done"
                                def showActionBarCacheList = ShowActionBarCache.findAllByGameStepId(obj.gameStepId);
                                if (showActionBarCacheList) {
                                    showActionBarCacheList.each {
                                        if (!it.gameActionSatau.equals("done")) {
                                            if (!it.gameActionSatau.equals("waithu")) {
                                                it.gameActionSatau = "done"
                                                //it.save(flush: true, failOnError: true)
                                            }
                                        }

                                    }
                                }

                            } else {
                                if (obj.actionArrayStr.toString().contains("hu")) {
                                    showActionBarCache.gameActionSatau = "waithu"
                                } else {
                                    showActionBarCache.gameActionSatau = "waitnohu"
                                }
                            }


                        } else {
                            showActionBarCache.gameActionSatau = "done"
                        }
                        // showActionBarCache.save(flush: true, failOnError: true)
                        // }


                        println "0####:" + showActionBarCache.id + ":" + showActionBarCache.gameActionSatau
                    }
                }
            }

            servletContext[keyWord]=showActionList

        }

    }


    def checkUpdateStatus(def obj, def roomNumber) {
        //def actionBarList = ShowActionBarCache.findAllByGameStepId(obj.gameStepId)

        def  servletContext=Holders.getServletContext()
        def keyWord=roomNumber+"_"+obj.gameStepId
        def actionBarList=servletContext[keyWord]

        def satauStr = ""
        if (actionBarList) {
            def actionCount = 0
            def alreadyCount = 0
            actionBarList.each { actionBar ->
                satauStr = satauStr + actionBar.gameActionSatau
                if (actionBar.gameActionSatau) {
                    alreadyCount++
                }
                println "1####:" + actionBar.id + ":" + actionBar.gameActionSatau
                actionCount++
                println "couunt####:" + actionCount + ":" + alreadyCount
            }
            println "actionCount:${actionCount}"
            println "alreadyCount:${alreadyCount}"
            if (satauStr) {
                if (alreadyCount >= actionCount - 1) {
                    //1,no action
                    if (satauStr.contains("waitnohu") && satauStr.contains("waithu")) {
                        actionBarList.each { actionBar ->
                            if (actionBar.gameActionSatau.equals("waithu")) {
                                sendActionBarToUser(actionBar, roomNumber,"");
                            }
                        }

                    } else if (satauStr.contains("waithu")) {
                        actionBarList.each { actionBar ->
                            if (actionBar.gameActionSatau.equals("waithu")) {
                                sendActionBarToUser(actionBar, roomNumber,"");
                            }
                        }


                    } else if (satauStr.contains("waitnohu")) {
                        actionBarList.each { actionBar ->
                            if (actionBar.gameActionSatau.equals("waitnohu")) {
                                sendActionBarToUser(actionBar, roomNumber,"");
                            }
                        }



                    } else if (!satauStr.contains("cancle")) {
                        MessageDomain newMessageObj = new MessageDomain()
                        newMessageObj.messageBelongsToPrivateChanleNumber = roomNumber
                        newMessageObj.messageAction = "serverSendMoPaiAction"
                        newMessageObj.messageBody = ""
                        newMessageObj.messageType = "gameAction"
                        def s2 = new JsonBuilder(newMessageObj).toPrettyString()

                        websokectService.privateUserChanelByRoomNumber(newMessageObj.messageBelongsToPrivateChanleNumber, s2)
                        servletContext.removeAttribute(keyWord);
                    }
                    //2,waitnohu
                    //3,waithu
                    //4,waitnohu and waithu
                }
            }

        }

    }
    // Simulator: huActionListCache:[{"userOpenId":"test0","actionArray":"cancle,peng,gang","paiNumber":"11"},{"userOpenId":"test1","actionArray":"cancle,peng,gang","paiNumber":"11"},{"userOpenId":"test2","actionArray":"cancle,peng,gang","paiNumber":"11"}]
    //allShowActionBar
    def handelShowAllActionBar(String huPaiActionString, String noHuPaiActionString, def joinRoomNumber) {
        def huActionList
        def noHuActionList
        if (huPaiActionString) {
            if (huPaiActionString.length() > 0) {
                huActionList = JSON.parse(huPaiActionString)
            }
        }

        if (noHuPaiActionString) {
            if (noHuPaiActionString.length() > 0) {
                noHuActionList = JSON.parse(noHuPaiActionString)
            }
        }

        if (huActionList) {

            for (int i = 0; i < huActionList.size(); i++) {
                def huObj = huActionList.get(i)
                //save to SQL db
                ShowActionBarCache showActionBarCache = new ShowActionBarCache()
                showActionBarCache.showUserOpenId = huObj.userOpenId
                showActionBarCache.actionArrayString = huObj.actionArray
                showActionBarCache.paiNumber = huObj.paiNumber
                showActionBarCache.roomNumber = joinRoomNumber
                showActionBarCache.addTime = new Date()
                showActionBarCache.save(flush: true, failOnError: true)
                println "huObj:" + huObj.userOpenId

                //we need send all hu action to all user.

                sendActionBarToUser(huObj, joinRoomNumber, "1");


            }


        }

        if (noHuActionList) {
            for (int i = 0; i < noHuActionList.size(); i++) {
                def huObj = noHuActionList.get(i)
                ShowActionBarCache showActionBarCache = new ShowActionBarCache()
                showActionBarCache.showUserOpenId = huObj.userOpenId
                showActionBarCache.actionArrayString = huObj.actionArray
                showActionBarCache.paiNumber = huObj.paiNumber
                showActionBarCache.addTime = new Date()
                showActionBarCache.roomNumber = joinRoomNumber
                showActionBarCache.save(flush: true, failOnError: true)
            }

        }


    }
}
