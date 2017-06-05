package com.pusmicgame.game

import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.domain.ShowActionBarObj
import grails.converters.JSON
import grails.transaction.Transactional
import groovy.json.JsonBuilder

@Transactional
class ShowActionBarService {
    def websokectService

    def serviceMethod() {

    }

    def sendActionBar(MessageDomain messageJsonObj){
        def obj = JSON.parse(messageJsonObj.messageBody);
        //First check the SQL db if already have other action bar ,if
    }
    def handelCancleAcion(def obj,def roomNumber){

    }

    def handelHuAcion(def obj,def roomNumber){
        def allActionDoneFlag=false;

        def huUserOpenId=obj.fromUserOpenid
        def reocrd=ShowActionBarCache.findByShowUserOpenIdAndRoomNumber(huUserOpenId,roomNumber)
        if(reocrd){
            reocrd.delete(flush: true, failOnError: true)
        }

        def otherRecord=ShowActionBarCache.findAllByRoomNumber(roomNumber)
        if(!otherRecord){
            allActionDoneFlag=true
        }else{
            //it stil exist other action ,check if it is noHU action
            boolean  existHuFlag=false;
            otherRecord.each {
                if(it.actionArrayString.toString().contains("hu")){
                    //
                    existHuFlag=true;
                }
            }
            //it only contain other action user ,no hu action ,it need send no hu action  to  user

            if(!existHuFlag){
                def huObj=otherRecord.get(0)
                if(huObj) {
                    //it must need to be remove from SQL
                    sendActionBarToUser(huObj,roomNumber,"1");
                }

            }

        }

        return allActionDoneFlag

    }

    //-----------------------send show action bar object to user by roomnumber----------------------------------------------
    def sendActionBarToUser(huObj,roomNumber,needWait){
        ShowActionBarObj showActionBarObj = new ShowActionBarObj()
        showActionBarObj.fromUserOpenid = huObj.userOpenId
        showActionBarObj.actionName = "showActionBar"
        showActionBarObj.actionArrayStr = huObj.actionArray.toString()
        showActionBarObj.paiNumber = huObj.paiNumber
        if(needWait=="1"){
            showActionBarObj.otherActionStr = "needWaitOther";
        }else{
            showActionBarObj.otherActionStr = "";
        }

        def s = new JsonBuilder(showActionBarObj).toPrettyString()

        MessageDomain newMessageObj = new MessageDomain()
        newMessageObj.messageBelongsToPrivateChanleNumber = roomNumber
        newMessageObj.messageAction = "gameAction"
        newMessageObj.messageBody = s
        newMessageObj.messageType = "gameAction"
        def s2 = new JsonBuilder(newMessageObj).toPrettyString()

        websokectService.privateUserChanelByRoomNumber(newMessageObj.messageBelongsToPrivateChanleNumber, s2)

    }
   // Simulator: huActionListCache:[{"userOpenId":"test0","actionArray":"cancle,peng,gang","paiNumber":"11"},{"userOpenId":"test1","actionArray":"cancle,peng,gang","paiNumber":"11"},{"userOpenId":"test2","actionArray":"cancle,peng,gang","paiNumber":"11"}]
    //allShowActionBar
    def handelShowAllActionBar(String huPaiActionString,String noHuPaiActionString,def joinRoomNumber){
        def huActionList
        def noHuActionList
        if(huPaiActionString){
            if(huPaiActionString.length()>0){
                huActionList =JSON.parse(huPaiActionString)
            }
        }

        if(noHuPaiActionString){
            if(noHuPaiActionString.length()>0){
                noHuActionList =JSON.parse(noHuPaiActionString)
            }
        }

        if(huActionList){

            for(int i=0;i<huActionList.size();i++){
                def huObj=huActionList.get(i)
                //save to SQL db
                ShowActionBarCache showActionBarCache=new ShowActionBarCache()
                showActionBarCache.showUserOpenId=huObj.userOpenId
                showActionBarCache.actionArrayString=huObj.actionArray
                showActionBarCache.paiNumber=huObj.paiNumber
                showActionBarCache.roomNumber=joinRoomNumber
                showActionBarCache.addTime=new Date()
                showActionBarCache.save(flush: true, failOnError: true)
                println  "huObj:"+huObj.userOpenId

                //we need send all hu action to all user.

                sendActionBarToUser(huObj,joinRoomNumber,"1");



            }




        }

        if(noHuActionList){
            for(int i=0;i<noHuActionList.size();i++) {
                def huObj = noHuActionList.get(i)
                ShowActionBarCache showActionBarCache=new ShowActionBarCache()
                showActionBarCache.showUserOpenId=huObj.userOpenId
                showActionBarCache.actionArrayString=huObj.actionArray
                showActionBarCache.paiNumber=huObj.paiNumber
                showActionBarCache.addTime=new Date()
                showActionBarCache.roomNumber=joinRoomNumber
                showActionBarCache.save(flush: true, failOnError: true)
            }

        }




    }
}
