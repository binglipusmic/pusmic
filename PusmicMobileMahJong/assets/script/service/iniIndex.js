var client;
var privateClient;
var userInfo;
var serverUrl;
var socket;
var gameActionListGet;
var onlineCheckUser;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        gameActionList: cc.Node,
        checkOnlineUser: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

        //webchat head img test-------------------------------
        var url = "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
              console.log("xhr readyState:" + xhr.readyState);
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
            
                console.log("xhr:" + response);
                console.log("xhr responseType:" + xhr.responseType);
                
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
        //----------------------------------------------------
        gameActionListGet = this.gameActionList.getComponent("gameConfigButtonListAction");
        onlineCheckUser = this.checkOnlineUser.getComponent("onlineUserCheck");
        userInfo = require("userInfoDomain").userInfoDomain;
        serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        socket = new SockJS(serverUrl + "/stomp");
        console.log("conect to server");
        client = Stomp.over(socket);
        var csrfHeaderName = "Set-Cookie";
        var csrfToken = "session=B227654DB13B28329F96DB2959FAE26B";
        var headers = {};
        headers[csrfHeaderName] = csrfToken;
        client.connect(headers, function () {
            client.subscribe("/queue/pusmicGamePushLoginUserInfoChanle", function (message) {
                var bodyStr = message.body;
                cc.log("######################");
                cc.log(bodyStr);
                var obj = JSON.parse(bodyStr);
                if (obj != undefined && obj != null) {
                    for (var p in obj) {
                        userInfo[p] = obj[p]
                    }
                    console.log("userInfo.nickname:" + userInfo.nickName);
                    console.log("userInfo.headImageFileName:" + userInfo.headImageFileName);
                    Global.userInfo = userInfo;
                    //update the user public ip from url call
                    //self.updateUserIP(userInfo.id);
                    //
                    //self.initalPrivateChanleForUser(userInfo.roomNumber);

                    //user login success ,go to game main sence
                    //cc.director.loadScene('table');
                    client.disconnect();
                    client = null;
                    gameActionListGet.enterMainEntry("1");
                    gameActionListGet.showUserNickNameAndCode();
                    gameActionListGet.closeLoadingIcon();
                } else {

                    console.log("No found correct user info return from server ,please check .");
                }

                //self.testLabel.string = message.body;
                //$("#helloDiv").append(message.body);

                //cc.director.loadScene('gameMain2');
            }, function () {
                cc.log("websocket connect subscribe Error:233");
                //client.disconnect();
            });
        }, function () {
            cc.log("websocket connect  Error:234");
            //client.disconnect();
        });

        //onlineCheckUser.client = client;
        onlineCheckUser.checkonlineUser(client);

        cc.game.onStop = function () {
            cc.log("stopApp$$$$$$$$$$$$$$$$$");
            // client.disconnect();

        }


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onDestroy: function () {
        //colse the websokect
        client.disconnect();
        cc.log("onDestroy");
    },
    //----------------------inital private chanle----------------------------------
    // initalPrivateChanleForUser: function (roomNumber) {
    //     cc.log("roomNumber:"+roomNumber);
    //     privateClient = Stomp.over(socket);

    //         privateClient.connect({}, function () {
    //             privateClient.subscribe("/queue/privateRoomChanle" + roomNumber, function (message) {
    //                 var bodyStr = message.body;
    //                 cc.log("get meesge from private chanle:privateRoomChanle"+roomNumber);
    //             });
    //         },function(){
    //              cc.log("connect private chanle error !");
    //         });

    // privateClientChanle
    // },
    //----------------------game stop-----------------------------------------------
    gameStop: function () {

    },
    sendUserCode: function () {
        //client.send("/app/usercode_resive_message", {}, JSON.stringify("test"));
        gameActionListGet.showLoadingIcon();
        client.send("/app/usercode_resive_message", {}, "test");
    }
});
