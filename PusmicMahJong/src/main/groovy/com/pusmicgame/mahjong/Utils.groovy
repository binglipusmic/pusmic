package com.pusmicgame.mahjong

import com.pusmicgame.domain.GameModeJson
import com.pusmicgame.game.GameMode

/**
 * Created by prominic2 on 16/12/26.
 */
class Utils {
    def fixTheWebsokectRemoteIp(String ip){
        if(ip.startsWith("/")){
            ip=ip.substring(1)
        }
        if(ip.contains(":")){
            def n=ip.split(":")
            ip=n[0]
        }
        return ip
    }

    def copyProperties(Object source, target) {
        println "copyProperties............"

        /*source.properties.each { key, value ->
            println "copyProperties0:${key}-----${value}"

            *//*if (target.hasProperty(key) && !(key in ['class', 'metaClass']))

                target[key] = value

            println "copyProperties:${key}-----${target[key]}"*//*
        }*/

        Iterator<?> keys = source.keys();

        while( keys.hasNext() ) {
            String key = (String)keys.next();
            def v=source.get(key)
            target[key] = v

        }
    }
    def gameModeToJsonObject(GameMode gameMode, GameModeJson gameModeJson){

        gameModeJson.ziMoJiaDi=gameMode.ziMoJiaDi
        gameModeJson.ziMoJiaFan=gameMode.ziMoJiaFan
        gameModeJson.ziMoHu=gameMode.ziMoHu
        gameModeJson.dianPaoHu=gameMode.dianPaoHu
        gameModeJson.huanSanZhang=gameMode.huanSanZhang
        gameModeJson.dianGangHua_dianPao=gameMode.dianGangHua_dianPao
        gameModeJson.dianGangHua_ziMo=gameMode.dianGangHua_ziMo
        gameModeJson.dai19JiangDui=gameMode.dai19JiangDui
        gameModeJson.mengQingZhongZhang=gameMode.mengQingZhongZhang
        gameModeJson.tianDiHu=gameMode.tianDiHu
        gameModeJson.fan2=gameMode.fan2
        gameModeJson.fan3=gameMode.fan3
        gameModeJson.fan4=gameMode.fan4
        gameModeJson.fan6=gameMode.fan6
        gameModeJson.roundCount4=gameMode.roundCount4
        gameModeJson.roundCount8=gameMode.roundCount8
        gameModeJson.gamePeopleNumber=gameMode.gamePeopleNumber

        gameModeJson.publicIpLimit=gameMode.publicIpLimit

        gameModeJson.gpsLimit=gameMode.gpsLimit

        return gameModeJson

    }

    def copyObjectProperties(source, target) {
        target.properties.each { key, value ->
            if (source.metaClass.hasProperty(source, key) ) {
                if(!key.toString().toLowerCase().equals("class")){
                    if(!key.toString().toLowerCase().equals("metaclass")){
                        target.setProperty(key, source.metaClass.getProperty(source, key))
                    }

                }

            }
        }
    }

    def fixJsonStr(s){
        s=s.replaceAll("\"","!")
        s=s.replaceAll("\\{","(")
        s=s.replaceAll("\\}",")")
        return s
    }



}
