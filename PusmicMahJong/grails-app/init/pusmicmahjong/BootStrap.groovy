package pusmicmahjong

import com.pusmic.game.mahjong.SpringUser
import com.pusmic.game.mahjong.SpringUserRole
import com.pusmic.game.mahjong.Role
import com.pusmic.game.mahjong.OnlineUser
import grails.plugin.springsecurity.SecurityFilterPosition
import grails.plugin.springsecurity.SpringSecurityUtils

import static grails.plugin.springsecurity.SpringSecurityUtils.clientRegisterFilter

class BootStrap {

    def init = { servletContext ->
        println "BootStrap init:"
//         def userCount=SpringUser.count()
//        try {
//            if(userCount==0){
//                //new 4 user for test
//                for(int i=1;i<5;i++){
//                    def userName="testUser"+i
//                    def userCode="userCode"+i
//
//                    def adminRole = new Role(authority: 'ROLE_ADMIN').save()
//                    def userRole = new Role(authority: 'ROLE_USER').save()
//
//                    def u= new SpringUser(username:userName,password:'password',city:"Mianyang",country:"CN",language:"chinese",
//                            nickname:userName,openid:userName,province:"SC",headimgurl:"testurl",unionid:"test",access_token:"test",
//                            refresh_token:"refreshToken",userCode:userCode,webChatUserCode:"")
//                    u.save(flush: true, failOnError: true)
//
//
//
//                    SpringUserRole.create u, userRole
//
//                    SpringUserRole.withSession {
//                        it.flush()
//                        it.clear()
//                    }
//
//
//                    println "username:"+userName
//                }
//            }
//            userCount=SpringUser.count()
//            println "userCount:"+userCount
//            def onlineCount=OnlineUser.count()
//            if(onlineCount==0){
//                def uList=SpringUser.list()
//                uList.each {
//                    def onlineUser=new OnlineUser(loginTime:new Date(),gameRoomNumber:"1000",springUser:it)
//                    onlineUser.save();
//                }
//            }
//
//
//
//
//        } catch (ex) {
//          print ex.toString()
//        }

        //oCG9Xwo2BF--ukJXk9uCTLqhz8f8

//
//        try {
//           // def adminRole = new Role(authority: 'ROLE_ADMIN').save()
//            //def userRole = new Role(authority: 'ROLE_USER').save()
//           def  adminRole = Role.findOrSaveByAuthority('ROLE_ADMIN')
//            def adminUser = SpringUser.findByOpenid("oCG9Xwo2BF--ukJXk9uCTLqhz8f8")
//            if (adminUser) {
//                // SpringUserRole.create adminUser, userRole
//                println "authorities:" + adminUser.authorities
//                if (!adminUser.authorities.contains(adminRole)) {
//
//                    SpringUserRole.create adminUser, adminRole
//
//                    SpringUserRole.withSession {
//                        it.flush()
//                        it.clear()
//                    }
//                    println "NOT Found admin on bootstrap on user:testUser2"
//                } else {
//
//                    println "Found admin on bootstrap on user:testUser2"
//
//                }
//            }
//        } catch (ex) {
//            print ex.toString()
//        }


    }
    def destroy = {
    }
}
