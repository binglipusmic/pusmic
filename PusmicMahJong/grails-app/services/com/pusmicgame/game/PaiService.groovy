package com.pusmicgame.game

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
    def faPai(){
        MessageDomain m=new MessageDomain()
        m.messageBelongsToPrivateChanleNumber="481403"
        faPai(m)
    }

    def faPai(MessageDomain messageDomain){

        def roomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
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

                    def list=getUserPaiList(paiList,index)
                    def userPaiList=list[1]
                    paiList=list[0]

                    outputUser.paiList =userPaiList.toString()
                    gameU.paiList=userPaiList

                    gameU.save(flush: true, failOnError: true)
                    gameUserListArray.add(outputUser)
                    index++

                }
                //save the rest pai to game round
                gameRound.restPaiList=paiList
                gameRound.gameingRestPaiList=paiList
                gameRound.save(flush: true, failOnError: true)
                Collections.sort(gameUserListArray, new CustomComparatorForGameUserPlatObj());
                def s = JsonOutput.toJson(gameUserListArray);
            }
        }
    }


    def getUserPaiList( Integer[] paiList,def index){
        def returnList=[]
        def userPaiList=[]
        def count=0
        if(index==1){
            count=14
        }else{
            count=13
        }

        for(int i=0;i<count;i++){

            userPaiList.push(paiList.last())
            paiList=removeLastElement(paiList)

        }

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
