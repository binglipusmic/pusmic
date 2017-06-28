package com.pusmicgame.game

import com.pusmic.game.mahjong.LoingUserInfo
import com.pusmic.game.mahjong.OnlineUser
import com.pusmic.game.mahjong.SpringUser
import com.pusmicgame.domain.MessageDomain
import com.pusmicgame.domain.UserInfo
import grails.transaction.Transactional
import groovy.json.JsonBuilder

@Transactional
class GameRoundService {

    def websokectService

    def checkGameRoomExist(MessageDomain messageJsonObj) {
        def flag = false;
        def roomNumber = messageJsonObj.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound
        if (onlineRoomNumber) {
            gameRound = onlineRoomNumber.gameRound
        }
        println "checkGameRoomExist roomnuber 1:" + roomNumber
        // println "checkGameRoomExist gameRound 1:"+gameRound.id
        if (gameRound) {
            if (gameRound.gameSatatus == 1) {
                return flag
            } else {
                def openid = messageJsonObj.messageBody;
                println "checkGameRoomExist openid 1-29:" + openid
                gameRound.gameUser.each { gu ->
                    println "gu.springUser.openid 1-30:" + gu.springUser.openid
                    if (gu.springUser.openid.equals(openid)) {
                        flag = true;
                    }
                }
            }
        } else {
            return flag
        }

        //check gps

        //flag=checkGpsLimit(messageJsonObj)

        println "checkGameRoomExist :" + flag

        return flag
    }

    def saveHuPaiNumberIntoGameRound(MessageDomain messageJsonObj) {
        def huPaiCount = 0
        def roomNumber = messageJsonObj.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound
        if (onlineRoomNumber) {
            gameRound = onlineRoomNumber.gameRound
        }

        if (gameRound) {
            if (gameRound.huPaiPeopleNumberCount) {
                gameRound.huPaiPeopleNumberCount = gameRound.huPaiPeopleNumberCount + 1
            } else {
                gameRound.huPaiPeopleNumberCount = 1
            }
            gameRound.gameSatatus=3
            gameRound.save(flush: true, failOnError: true)
            huPaiCount = gameRound.huPaiPeopleNumberCount
        }

        return huPaiCount

    }

    def checkGameRoundEnd(MessageDomain messageJsonObj, huPaiCount) {
        def endGameFlag = false;
        def roomNumber = messageJsonObj.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound
        if (onlineRoomNumber) {
            gameRound = onlineRoomNumber.gameRound
        }

        if (gameRound) {
            GameMode gameMode = gameRound.gameMode
            def peopeleCount = 0
            if (gameMode) {
                peopeleCount = gameMode.gamePeopleNumber.toInteger()
                if (peopeleCount - 1 == huPaiCount) {
                    endGameFlag = true
                }
            }

            if (gameRound.restPaiList.size() == 0) {
                endGameFlag = true
            }

        }

        return endGameFlag

    }

    def checkGpsLimit(MessageDomain messageJsonObj) {
        //
        //0, no gps open for join user
        //1, no gps open for room ownser
        //2, gps open,  no gps limit
        //3, gps open,gps limit not pass
        //4, gps open ,gps limit pass
        //5, have gps limit

        //6.no gps open for join user ,but gps require
        //7.no gps open for room ownser,but gps require
        //8.no gps limit.
        def gpsStatus = -1;

        def roomNumber = messageJsonObj.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        GameRound gameRound
        if (onlineRoomNumber) {
            gameRound = onlineRoomNumber.gameRound
        }

        if (gameRound) {

            def gameLun = gameRound.gameRoundLun
            def gameMode = gameLun.gameMode
            def gpsLimitMeter
            if (gameMode) {
                gpsLimitMeter = gameMode.gpsLimit
                if (gpsLimitMeter) {
                    if (gpsLimitMeter.toInteger() > 0) {
                        gpsStatus = 5
                    } else {
                        gpsStatus = 8
                    }

                } else {
                    gpsStatus = 8
                }
            } else {
                gpsStatus = 8
            }

            if (gpsStatus == 5) {
                def openid = messageJsonObj.messageBody;
                def readyJoinUser = SpringUser.findByOpenid(openid)
                if (readyJoinUser) {
                    def readyUserInfo = LoingUserInfo.findAllByUserOpeid(readyJoinUser.openid, [sort: 'loginTime']).last()
                    def readyUserLong1 = readyUserInfo.longitude
                    def readyUserLat1 = readyUserInfo.latitude
                    if (readyUserLong1) {
                        if (gpsLimitMeter) {

                            gpsLimitMeter = gpsLimitMeter.toInteger()
                            gpsLimitMeter = gpsLimitMeter * 1000

                            def springUser = SpringUser.findByOpenid(openid)
                            if (springUser) {
                                gameRound.gameUser.each { gu ->
                                    def joinSpringUser = gu.springUser
                                    if (joinSpringUser) {
                                        def lastLoginInfo = LoingUserInfo.findAllByUserOpeid(joinSpringUser.openid, [sort: 'loginTime']).last()
                                        if (lastLoginInfo) {
                                            double long1 = lastLoginInfo.longitude
                                            double lat1 = lastLoginInfo.latitude
                                            if (long1) {
                                                if (lat1) {

                                                    def distance = distance(readyUserLat1, lat1, readyUserLong1, long1, 0.0, 0.0).toInteger()
                                                    def time = new Date()
                                                    println time.toString() + "----distance:" + distance
                                                    if (distance >= gpsLimitMeter) {
                                                        if (gpsStatus != 3 && gpsStatus != 7)
                                                            gpsStatus = 4
                                                    } else {
                                                        gpsStatus = 3
                                                        gpsStatus = distance

                                                    }

                                                } else {
                                                    gpsStatus = 7
                                                    // gpsStatus =distance
                                                }
                                            } else {
                                                gpsStatus = 7
                                                // gpsStatus =distance
                                            }

                                        }
                                    }

                                }

                            }

                        } else {
                            gpsStatus = 2
                        }
                    } else {
                        gpsStatus = 6
                    }

                }
            }
        }
        return gpsStatus

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

        def peopeleCount = 0
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        if (onlineRoomNumber) {
            GameRound gameRound = onlineRoomNumber.gameRound
            if (gameRound) {
                //check the user count if already full

                GameMode gameMode = gameRound.gameMode
                println "getJoinPopeleCount gameMode:" + gameMode.id
                peopeleCount = gameMode.gamePeopleNumber.toInteger()
            }
        }
        //println "getJoinPopeleCount gameRound:"+gameRound.id
        //println "getJoinPopeleCount:"+peopeleCount
        return peopeleCount
    }

    def currentGameRoundPeopeCount(MessageDomain messageDomain) {

        def peopeleCount = 0
        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        if (onlineRoomNumber) {
            GameRound gameRound = onlineRoomNumber.gameRound
            if (gameRound) {
                def userList = gameRound.gameUser
                if (userList) {
                    peopeleCount = userList.size()
                } else {
                    peopeleCount = 0
                }
            }
        }
        println "currentGameRoundPeopeCount:" + peopeleCount
        peopeleCount++
        return peopeleCount
    }

    def getPopeleCountForJoinRoom(MessageDomain messageDomain) {

        def p1 = getJoinPopeleCount(messageDomain)
        def p2 = currentGameRoundPeopeCount(messageDomain)
        if (p1 == 0 && p2 == 0) {
            return "!"
        } else {
            if (p2 < p1) {
                return "<"
            } else {
                if (p2 == p1) {
                    return "="
                } else {
                    return ">"
                }

            }
        }


    }

    def serviceMethod() {

    }


    def saveRoundScore(obj, roomNumber) {
        println "saveRoundScore "
        GameRoomNumber onlineRoomNumber = GameRoomNumber.findByRoomNumber(roomNumber)
        if (obj.groundId) {
            def groundId=Long.parseLong(obj.groundId)
            GameRound gameRound = GameRound.findById(groundId)
            if (gameRound) {
                //check the user count if already full
                println "saveRoundScore gameRound:" + gameRound.id
                println "saveRoundScore gameRound:" + gameRound.roomNumber.roomNumber
                def gameUsers = gameRound.gameUser;
                if (gameUsers) {
                    gameUsers.each { user ->
                        if (user.springUser.openid.equals(obj.fromUserOpenid)) {
                            println "saveRoundScore ser.springUser:" + user.springUser.nickname
                            println "saveRoundScore obj.fromUserOpenid:" + obj.fromUserOpenid
                            println "saveRoundScore obj.roundScoreCount:" + obj.roundScoreCount




                            GameUser gameUser=GameUser.findById(user.id)
                            gameUser.roundScoreCount = obj.roundScoreCount.toInteger()
                            gameUser.huPaiDetails = obj.huPaiDetails

                            //update total in spring user
                            if (gameUser.roundScoreCount) {

                                //  if(user.roundScoreCount>0) {
                                def springUser = user.springUser
                               // updateScoreAndWinCountAndPushToClient(gameUser.springUser.openid, roomNumber,  gameUser.roundScoreCount)

                                // }
                            }

                            gameUser.save(flush: true, failOnError: true)
                            println ("game user:"+gameUser.springUser.nickname+" save done")


                        }
                        //round end chage user online sutat to 1
                        //OnlineUser.refresh()
//                        if(user){
//                            def springUser = user.springUser
//                            if(springUser) {
//                                OnlineUser onlineUser = OnlineUser.findBySpringUser(springUser)
//                                if (onlineUser) {
//                                    // onlineUser.refresh()
//                                    println "onlineUser:" + onlineUser.id
//                                    onlineUser.onlineStau = 1
//                                    //onlineUser.save(flush: true, failOnError: true)
//                                }
//                            }
//                        }


                    }
                }


            }
        }

    }


    def updateScoreAndWinCountAndPushToClient(def  springOpenid, def roomNumber,def roundScoreCount) {
        def springUser=SpringUser.findByOpenid(springOpenid)


        if(springUser) {
            springUser=SpringUser.get(springUser.id)
            if(roundScoreCount>0){
                if (springUser.winCount) {
                    springUser.winCount = springUser.winCount + 1
                } else {
                    springUser.winCount = 1
                }
            }


            if (springUser.gameScroe) {
                //user.roundScoreCount.toInteger()
                springUser.gameScroe = springUser.gameScroe + roundScoreCount
            } else {
                springUser.gameScroe = roundScoreCount
            }

            springUser.save(flush: true, failOnError: true)

            UserInfo userInfo = new UserInfo()
            userInfo.openid = springUser.openid
            userInfo.gameScroe = springUser.gameScroe
            userInfo.winCount = springUser.winCount

            def s = new JsonBuilder(userInfo).toPrettyString()

            MessageDomain newMessageObj = new MessageDomain()
            newMessageObj.messageBelongsToPrivateChanleNumber = roomNumber
            newMessageObj.messageAction = "updateScoreAndWindCount"
            newMessageObj.messageBody = s
            newMessageObj.messageType = "gameAction"
            def s2 = new JsonBuilder(newMessageObj).toPrettyString()

            websokectService.privateUserChanelByRoomNumber(roomNumber, s2)



        }

    }
}
