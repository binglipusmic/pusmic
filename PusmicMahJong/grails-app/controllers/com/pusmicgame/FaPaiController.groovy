package com.pusmicgame

import com.pusmic.game.mahjong.Role
import com.pusmic.game.mahjong.SpringUser
import com.pusmicgame.domain.GameUserPlatObj
import com.pusmicgame.game.GameUser
import com.pusmicgame.utils.CustomComparatorForGameUserPlatObj
import grails.plugin.springsecurity.annotation.Secured
import groovy.json.JsonOutput

//@Secured("ROLE_USER")
class FaPaiController {
    def paiService
    def gameRoomNumberService
    def index() {

        if (isLoggedIn()) {
            String username = getAuthenticatedUser().username
           // getAuthenticatedUser().
            println ("print login:"+username);
           // if(getAuthenticatedUser().)
            def adminRole = Role.findOrSaveByAuthority('ROLE_ADMIN')
            if (getAuthenticatedUser().authorities.contains(adminRole)) {
                println ("foudn admin user :"+username);
            }else{
                println ("not foudn admin user :"+username);
            }
        }else{

        }
        def pai=paiService.xiPai()
        render pai.toString()

    }

    def getRoomNumber(){
        def room=gameRoomNumberService.getRandomRoomNumber()
        render room

    }


    def testHuanSanZhang(){
        def orderList=paiService.getHuanPaiOrder(4);
        println "orderList:"+orderList.toString();
        def gameUserList=[]
        def allPaiList=[[13, 16, 18, 21, 22, 22, 23, 27, 29, 33, 34, 36, 36, 38],
        [15, 16, 18, 22, 24, 24, 28, 29, 32, 33, 33, 34, 35],
        [11, 17, 17, 17, 21, 26, 27, 28, 32, 32, 34, 38, 39],
        [11, 11, 14, 18, 19, 21, 24, 25, 25, 28, 35, 37, 39]]
        def huaPaiStr=['21,22,23','15,16,18','11,17,17','11,11,14']
        for(int i=0;i<4;i++){
            GameUser user=new GameUser()
            user.paiList=allPaiList[i]
            user.huanSanZhang=huaPaiStr[i]
           // user.springUser.openid="testUser"+(i+1)
            gameUserList.add(user)
        }


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
            sourcePaiList=paiService.filterArray(sourcePaiList,sourHuanList)
            targetPaiList=paiService.filterArray(targetPaiList,targetHuanList)
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
        def gameUserListArray = []
        gameUserList.each { gameU ->

            GameUserPlatObj outputUser = new GameUserPlatObj()

            outputUser.openid = "testUser1"

            outputUser.paiList =gameU.paiList.toString()
            // gameU.paiList=userPaiList

            //gameU.save(flush: true, failOnError: true)
            gameUserListArray.add(outputUser)
           // index++

        }


        Collections.sort(gameUserListArray, new CustomComparatorForGameUserPlatObj());
        def paiStr = JsonOutput.toJson(gameUserListArray);

         render paiStr

    }
}
