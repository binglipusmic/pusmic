package com.pusmicgame.game

import com.pusmic.game.mahjong.OnlineUser
import com.pusmic.game.mahjong.SpringUser
import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.domain.OnlinUserPlatObj
import grails.transaction.Transactional
import groovy.json.JsonBuilder

@Transactional
class OnlineUserService {

    def websokectService
    def serviceMethod() {

    }


    def removeGameUserFromGameRound(roomNumber,userOpendId){
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound
        if(onlineRoomNumber){
            gameRound = onlineRoomNumber.gameRound
        }

        if(gameRound) {
            def gu = gameRound.gameUser.find { it.springUser.openid == userOpendId }
            if(gu){
                gameRound.removeFromGameUser(gu)
                gameRound.save(flush: true, failOnError: true);
                println "gu:"+gu.springUser.openid+"----"+gu.springUser.nickname
            }


        }

    }


    def reJoinRoomFixOnlineUser(openid){
        SpringUser springUser=SpringUser.findByOpenid(openid)
        if(springUser) {
            OnlineUser onlineUser = OnlineUser.findBySpringUser(springUser)
            if (onlineUser) {
                onlineUser.onlineStau=2
                onlineUser.save(flush: true, failOnError: true);
            }
        }
    }

    def removeOfflineUser(openid){
        SpringUser springUser=SpringUser.findByOpenid(openid)
        if(springUser) {
            OnlineUser onlineUserList = OnlineUser.findAllBySpringUser(springUser)
            if (onlineUserList) {

                onlineUserList.each{onlineuser->
                    onlineuser.delete(flush: true, failOnError: true)
                }
            }
        }
    }

    def offlineUser(roomNUmber,openid){
        SpringUser springUser=SpringUser.findByOpenid(openid)
        if(springUser){
        OnlineUser onlineUser=OnlineUser.findBySpringUser(springUser)
        if(onlineUser) {
            println "found websokectService onlineUser:" + roomNUmber
            OnlinUserPlatObj onlinUserPlatObj = new OnlinUserPlatObj()
            onlinUserPlatObj.roomNumber = roomNUmber
            onlinUserPlatObj.onlineStau = onlineUser.onlineStau
            onlinUserPlatObj.springUserNickName = onlineUser.springUser.nickname
            onlinUserPlatObj.springUserOpenId = onlineUser.springUser.openid
            def s = new JsonBuilder(onlinUserPlatObj).toPrettyString()

            println "onlineUser.onlineStau:" + onlineUser.onlineStau
            if (onlineUser.onlineStau == 1) {
                //push message to client

                MessageDomain newMessageObj = new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber = roomNUmber
                newMessageObj.messageAction = "userOffline"
                newMessageObj.messageBody = s
                newMessageObj.messageType = "userOffline"
                def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(roomNUmber, s2)

                onlineUser.delete(flush: true, failOnError: true)
                println " onlineUser.springUser.openid:"+ onlineUser.springUser.openid
                removeGameUserFromGameRound(roomNUmber, onlineUser.springUser.openid)

            } else if (onlineUser.onlineStau == 2) {
                MessageDomain newMessageObj = new MessageDomain()
                newMessageObj.messageBelongsToPrivateChanleNumber = roomNUmber
                newMessageObj.messageAction = "userOffline"
                newMessageObj.messageBody = s
                newMessageObj.messageType = "userOffline"
                def s2 = new JsonBuilder(newMessageObj).toPrettyString()
                websokectService.privateUserChanelByRoomNumber(roomNUmber, s2)

                onlineUser.onlineStau=3;
                onlineUser.save(flush: true, failOnError: true);

            } else if (onlineUser.onlineStau == 0) {

                onlineUser.delete(flush: true, failOnError: true)


            }else if (onlineUser.onlineStau == 3) {

                onlineUser.delete(flush: true, failOnError: true)


            }
        }



            //if the online statu is 0 just remove this ,other status still need remove it


        }

    }
}
