package com.pusmicgame.game

import com.pusmic.game.mahjong.OnlineUser
import com.pusmicgame.domain.GameUserPlatObj
import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.utils.CustomComparatorForGameUserPlatObj
import grails.transaction.Transactional
import groovy.json.JsonOutput

@Transactional
class PaiService {

    //11-19   tong
    //21-29   tiao
    //31-39   wan

    def serviceMethod() {

    }

    /**
     * 初始化麻将数组
     */
    def initalPai(){
        def paiList=[]
        for(int j=0;j<4;j++){
            for(int i=11;i<40;i++){
                if(i!=20&&i!=30){
                    paiList.add(i)
                }
            }
        }
        return paiList

    }
    /**
     * 洗牌
     */
    def xiPai(){
        Integer[] paiList=initalPai()

        for(int i=paiList.size()-1;i>=0;i--){
            def randomIndex = Math.floor(Math.random()*(i+1)).toInteger()
            def itemAtIndex = paiList[randomIndex]

            paiList[randomIndex] = paiList[i];
            paiList[i] = itemAtIndex;
        }

        return paiList

    }


    def getHuanPaiOrder(def userSize){
        Integer[] paiList
        if(userSize==4){
            paiList=[0,1,2,3]
        }else{
            paiList=[1,2,3]
        }

        for(int i=paiList.size()-1;i>=0;i--){
            def randomIndex = Math.floor(Math.random()*(i+1)).toInteger()
            def itemAtIndex = paiList[randomIndex]

            paiList[randomIndex] = paiList[i];
            paiList[i] = itemAtIndex;
        }

        return paiList
    }

    /**
     * Only work on 4 user,if want it work on 3 user ,we need to do some improve.
     * @param messageDomain
     * @return
     */
    def huanSanZhangFaPai(MessageDomain messageDomain){



        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        def paiStr="";
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        if(gameRound) {
            def gameUserList=gameRound.gameUser
            if(gameUserList){
                def gameUserListArray = []
                //xipai
                //Integer[] paiList=xiPai()
                def index=1
                def orderList=getHuanPaiOrder(4);
                println "orderList:"+orderList.toString()

                for(int i=0;i<4;i=i+2){
                    def sourceHuanPaiStr=gameUserList[orderList[i]].huanSanZhang
                    def sourcePaiList=gameUserList[orderList[i]].paiList
                    def sourHuanList =sourceHuanPaiStr.split(",")
                    sourHuanList.eachWithIndex{ String entry, int j ->
                        sourHuanList[j]=entry.toInteger()
                    }
                    def targetHuanPaiStr=gameUserList[orderList[i+1]].huanSanZhang
                    def targetPaiList=gameUserList[orderList[i+1]].paiList
                    def targetHuanList=targetHuanPaiStr.split(",")
                    targetHuanList.eachWithIndex{ String entry, int j ->
                        targetHuanList[j]=entry.toInteger()
                    }
                    println "sourceHuanPaiStr:"+sourceHuanPaiStr.toString()
                    println "sourcePaiList:"+sourcePaiList.toString()
                    println "targetHuanPaiStr:"+targetHuanPaiStr.toString()
                    println "targetPaiList:"+targetPaiList.toString()
                    sourcePaiList=filterArray(sourcePaiList,sourHuanList)
                    targetPaiList=filterArray(targetPaiList,targetHuanList)
                    println "sourcePaiList1:"+sourcePaiList.toString()
                    println "targetPaiList1:"+targetPaiList.toString()

                    targetHuanList.each{t->
                        println "targetHuanList:"+t
                        sourcePaiList.add(t.toInteger())
                    }
                    sourHuanList.each{s->
                        targetPaiList.add(s.toInteger())
                    }
                    sourcePaiList.sort()
                    targetPaiList.sort()
                    println "sourcePaiList2:"+sourcePaiList.toString()
                    println "targetPaiList2:"+targetPaiList.toString()
                    gameUserList[orderList[i]].paiList=sourcePaiList
                    gameUserList[orderList[i+1]].paiList=targetPaiList



                }

                gameUserList.each { gameU ->

                    GameUserPlatObj outputUser = new GameUserPlatObj()

                    outputUser.openid = gameU.springUser.openid
                    outputUser.paiList =gameU.paiList.toString()
                    outputUser.zhuang = gameU.zhuang
                   // gameU.paiList=userPaiList

                    gameU.save(flush: true, failOnError: true)
                    gameUserListArray.add(outputUser)
                    index++

                }


                Collections.sort(gameUserListArray, new CustomComparatorForGameUserPlatObj());
                paiStr = JsonOutput.toJson(gameUserListArray);
            }


        }

        return paiStr

    }

    def filterArray(sourcetArray,filterChildArray){
        def sourcePaiListTemp=[]

       /* sourcetArray.eachWithIndex{def v,int index->
            filterChildArray.each{ t->

                if(v+""==t+""){
                    v.remove()
                }

            }

        }
        sourcePaiListTemp=sourcetArray*/
        /*filterChildArray.each{
            if(it){
                if(!it.toString().equals(",")){
                    sourcetArray=sourcetArray-it.toInteger()
                }
            }

        }*/
        println "sourcetArray:"+sourcetArray.getClass().getName()
        println "sourcetArray:"+sourcetArray.toString()
        filterChildArray.each{
            println "filterChildArray:${it}"
        }
       // sourcetArray=sourcetArray-filterChildArray
       // sourcetArray=sourcetArray.replaceAll(filterChildArray)
        List<Integer> temp=[]
        sourcetArray.each{
            temp.add(it)
        }
        for(int i=0;i<filterChildArray.size();i++){
            for(int j=0;j<temp.size();j++){
                def sf=temp[j]+""
                def tf=filterChildArray[i]+""
                //println "sourcetArray sf=${sf},tf=${tf} :" +temp[j]
                    if(sf.toString().equals(tf)){
                        println "sourcetArray found :"+temp[j]
                        temp.removeAt(j)
                        continue;
                    }
            }

        }

        println "sourcetArray=${temp.toString()}"
        //temp[i]=(sourcetArray[i].toString()+"")

        //temp.removeAll(filterChildArray)
        println "temp:"+temp.toString()
        return temp
    }

    def faPai(){
        MessageDomain m=new MessageDomain()
        m.messageBelongsToPrivateChanleNumber="481403"
        faPai(m)
    }


    def faPai(MessageDomain messageDomain){

        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        def paiStr="";
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        if(gameRound) {
            def gameUserList=gameRound.gameUser
            if(gameUserList){
                def gameUserListArray = []
                //xipai
                Integer[] paiList=xiPai()
                def index=1
                gameUserList.each { gameU ->

                    GameUserPlatObj outputUser = new GameUserPlatObj()

                    outputUser.openid = gameU.springUser.openid
                    outputUser.zhuang = gameU.zhuang
                    def list=getUserPaiList(paiList,gameU.zhuang)
                    def userPaiList=list[1]
                    paiList=list[0]

                    outputUser.paiList =userPaiList.toString()
                    gameU.paiList=userPaiList

                    gameU.save(flush: true, failOnError: true)
                    gameUserListArray.add(outputUser)
                    index++

                    //update online user for each user
                    OnlineUser onlineUser=OnlineUser.findBySpringUser(gameU.springUser)
                    if(onlineUser){
                        onlineUser.onlineStau=2
                        onlineUser.save(flush: true, failOnError: true)
                    }


                }
                //save the rest pai to game round
                gameRound.restPaiList=paiList
                gameRound.gameingRestPaiList=paiList
                gameRound.save(flush: true, failOnError: true)
                Collections.sort(gameUserListArray, new CustomComparatorForGameUserPlatObj());
                paiStr = JsonOutput.toJson(gameUserListArray);

            }


        }

        return paiStr
    }

    def getRestPaiNumber(MessageDomain messageDomain){
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        def paiStr="";
        def paiSize=0;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        if(gameRound) {
            paiSize=gameRound.restPaiList.size();
        }
        return paiSize;

    }
    def testmoPai(String userOpenId,roomNumber){
//        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
//        GameRound gameRound = onlineRoomNumber.gameRound
//        def lastPai
//        if(gameRound) {
//            def paiList=gameRound.restPaiList
//            if(paiList){
//                lastPai =paiList.last()
//                paiList=(List)paiList
//                paiList.removeAt(paiList.size()-1)
//                //   paiList=list
//                gameRound.restPaiList=paiList
//                gameRound.save(flush: true, failOnError: true)
//
//            }
//
//
//        }

        return "13"

    }

    def moPai(String userOpenId,roomNumber){
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound = onlineRoomNumber.gameRound
        def lastPai
        if(gameRound) {
            def paiList=gameRound.restPaiList
            if(paiList){
                lastPai =paiList.last()
                paiList=(List)paiList
                paiList.removeAt(paiList.size()-1)
                //   paiList=list
                gameRound.restPaiList=paiList
                gameRound.save(flush: true, failOnError: true)

            }


        }

        return lastPai

    }

    def getUserPaiList( Integer[] paiList,def index){
        def returnList=[]
        def userPaiList=[]
        def count=0
        if(index){
            if(index.toString().equals("1")){
                count=14
            }else{
                count=13
            }

        }else{
            count=13
        }


        for(int i=0;i<count;i++){

            userPaiList.push(paiList.last())
            paiList=removeLastElement(paiList)

        }

        userPaiList=userPaiList.sort()

        returnList.add(paiList)
        returnList.add(userPaiList)

        return returnList

    }


    private removeLastElement(Integer[] paiList){
        def rList=[]

        for(int i=0;i<paiList.length-1;i++){
            rList.add(paiList[i])
        }

        return rList

    }
}
