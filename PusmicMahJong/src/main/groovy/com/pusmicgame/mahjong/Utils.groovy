package com.pusmicgame.mahjong

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



}
