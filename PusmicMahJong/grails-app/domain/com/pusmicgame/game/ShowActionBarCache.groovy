package com.pusmicgame.game

class ShowActionBarCache {

    String showUserOpenId
    String actionArrayString
    String paiNumber
    String roomNumber
    String gameStepId
    String gameActionSatau
    Date  addTime

    static constraints = {
        actionArrayString nullable: true
        paiNumber nullable: true
        gameActionSatau nullable: true
        //paiNumber nullable: true
    }
}
