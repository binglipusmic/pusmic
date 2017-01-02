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



}
