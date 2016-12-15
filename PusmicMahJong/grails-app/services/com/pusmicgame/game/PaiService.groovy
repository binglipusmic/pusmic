package com.pusmicgame.game

import grails.transaction.Transactional

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

    def faPai(def userList,def paiList){

    }
}
