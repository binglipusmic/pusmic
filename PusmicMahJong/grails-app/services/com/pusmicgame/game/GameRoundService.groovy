package com.pusmicgame.game

import com.pusmic.game.mahjong.SpringUser
import com.pusmicgame.domain.MessageDomain
import grails.transaction.Transactional

@Transactional
class GameRoundService {

    def checkGameRoomExist(MessageDomain messageJsonObj){
        def flag=false;
        def roomNumber = messageJsonObj.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound
        if(onlineRoomNumber){
            gameRound = onlineRoomNumber.gameRound
        }

        if(gameRound) {
            def openid = messageJsonObj.messageBody;
            println "checkGameRoomExist openid:"+openid
            gameRound.gameUser.each{gu->
                println "gu.springUser.openid :"+gu.springUser.openid
                 if(gu.springUser.openid.equals(openid)){
                    flag=true;
                 }
            }
        }else{
            return flag
        }

        return flag
    }


    def checkGpsLimit(MessageDomain messageJsonObj){
        def flag=false;

        def roomNumber = messageJsonObj.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound
        if(onlineRoomNumber){
            gameRound = onlineRoomNumber.gameRound
        }

        if(gameRound) {
            def openid = messageJsonObj.messageBody;
            def gameLun=gameRound.gameRoundLun
            def gameMode=gameLun.gameMode
            if(gameMode) {
                def gpsLimitMeter = gameMode.gpsLimit

                if (gpsLimitMeter) {
                    def springUser=SpringUser.findByOpenid(openid)
                    if(springUser){
                        gameRound.gameUser.each { gu ->
                            def joinSpringUser=gu.springUser
                        }

                    }

                }
            }
        }

    }


    /**
     * Calculate distance between two points in latitude and longitude taking
     * into account height difference. If you are not interested in height
     * difference pass 0.0. Uses Haversine method as its base.
     *
     * lat1, lon1 Start point lat2, lon2 End point el1 Start altitude in meters
     * el2 End altitude in meters
     * @returns Distance in Meters
     */
    public static double distance(double lat1, double lat2, double lon1,
                                  double lon2, double el1, double el2) {

        final int R = 6371; // Radius of the earth

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c * 1000; // convert to meters

        double height = el1 - el2;

        distance = Math.pow(distance, 2) + Math.pow(height, 2);

        return Math.sqrt(distance);
    }

    def getJoinPopeleCount(MessageDomain messageDomain) {

        def peopeleCount=0
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        if (onlineRoomNumber) {
            GameRound gameRound = onlineRoomNumber.gameRound
            if (gameRound) {
                //check the user count if already full

                GameMode gameMode=gameRound.gameMode
                println "getJoinPopeleCount gameMode:"+gameMode.id
                peopeleCount=gameMode.gamePeopleNumber.toInteger()
            }
        }
        //println "getJoinPopeleCount gameRound:"+gameRound.id
        //println "getJoinPopeleCount:"+peopeleCount
       return peopeleCount
    }

    def currentGameRoundPeopeCount(MessageDomain messageDomain){

        def peopeleCount=0
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        if (onlineRoomNumber) {
            GameRound gameRound = onlineRoomNumber.gameRound
            if (gameRound) {
                def  userList=gameRound.gameUser
                if(userList){
                    peopeleCount=userList.size()
                }else{
                    peopeleCount=0
                }
            }
        }
        println "currentGameRoundPeopeCount:"+peopeleCount
        return peopeleCount
    }

    def getPopeleCountForJoinRoom(MessageDomain messageDomain){

        def p1=getJoinPopeleCount(messageDomain)
        def p2=currentGameRoundPeopeCount(messageDomain)
        if(p1==0 && p2==0){
            return "!"
        }else{
            if(p2<p1){
                return "<"
            }else{
                if(p2==p1){
                    return "="
                }else{
                    return ">"
                }

            }
        }


    }

    def serviceMethod() {

    }


    def saveRoundScore(obj,roomNumber){

        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        if (onlineRoomNumber) {
            GameRound gameRound = onlineRoomNumber.gameRound
            if (gameRound) {
                //check the user count if already full

                def gameUsers=gameRound.gameUser;
                if(gameUsers){
                    gameUsers.each{user->
                        if(user.springUser.openid.equals(obj.fromUserOpenid)){
                            user.roundScoreCount=obj.roundScoreCount
                            user.huPaiDetails=obj.huPaiDetails
                            user.save(flush: true, failOnError: true)
                            //update total in spring user
                            if(user.roundScoreCount) {

                                if(user.roundScoreCount>0) {
                                    var springUser = user.springUser
                                    if (springUser.winCount) {
                                        springUser.winCount = springUser.winCount + 1
                                    } else {
                                        springUser.winCount = 1
                                    }
                                    springUser.save(flush: true, failOnError: true)
                                }
                            }

                        }


                    }
                }


            }
        }

    }
}
