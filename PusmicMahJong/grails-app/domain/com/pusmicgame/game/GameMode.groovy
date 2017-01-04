package com.pusmicgame.game

class GameMode {
    String  ziMoJiaDi
    String ziMoJiaFan
    String ziMoHu
    String  dianPaoHu
    String  huanSanZhang
    String dianGangHua_dianPao
    String dianGangHua_ziMo
    String dai19JiangDui
    String mengQingZhongZhang
    String  tianDiHu
    String  fan2
    String  fan3
    String  fan4
    String fan6
    String roundCount4
    String  roundCount8
    String  gamePeopleNumber
    GameRoundLun gameRoundLun
    //1 open ,0 close
    String  publicIpLimit
    //1 open ,0 close
    String  gpsLimit
    //static belongsTo = [gameRoundLun:GameRoundLun]
    static constraints = {
        gameRoundLun nullable: true
    }
}
