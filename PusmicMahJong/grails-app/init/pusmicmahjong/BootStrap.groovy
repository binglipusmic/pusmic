package pusmicmahjong


class BootStrap {

    def init = { servletContext ->
        println "BootStrap init:"
       /* def userCount=User.count()
        if(userCount==0){
            //new 4 user for test
            for(int i=1;i<5;i++){
                def userName="testUser"+i
                //String username,String password
                *//**
                 * String city
                 String country
                 String language
                 String nickname
                 String openid
                 String province
                 String headimgurl
                 String unionid
                 *//*

                //new User(username:userName,password:userName+"123",city:"Mianyang",country:"CN",language:"chinese",
                 //       nickname:userName,openid:userName,province:"SC",headimgurl:"testurl",unionid:"test").save()

                println "username:"+userName
            }
        }*/
    }
    def destroy = {
    }
}
