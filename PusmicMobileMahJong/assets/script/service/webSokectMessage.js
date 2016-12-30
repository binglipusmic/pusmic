//var stomp=require('stomp');
var client;
var privateClient;
var userInfo;
var serverUrl;
var socket;
//Websokect only work on the sence ,when the switch sence ,the websokect will be lost,we should keep the websokect on one sence
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
        // ...http://cn.bing.com/
        testLabel: cc.Label,
        scriptNode: cc.Node,
        mainMenu:cc.Node ,
        index:cc.Node

    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        self.gameStop();
        //cc.game.addPersistRootNode(self.scriptNode);

        serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        if (Global.userInfo == null || Global.userInfo == undefined) {
            var userInfo = require("userInfoDomain").userInfoDomain;
            //window.io = SocketIO.connect;
            //var p2psocket =  window.io.connect("");
            //var p2p = new P2P(p2psocket);
            // console.log("io instals");
            //var shaObj = new jsSHA("SHA-1", "TEXT");
            //shaObj.update("This is a test");
            // var hash = shaObj.getHash("HEX");
            // console.log("hash sha1:"+hash);
            //if (cc.sys.isNative) {
                socket = new SockJS(serverUrl + "/stomp");
            //} else {
              //  socket = new SockWebJS(serverUrl + "/stomp");
            //}
            //io.connect
            //var socket=window.io('http://localhost:8080/stomp');
            //var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
            //var path = '/stomp';
            // var socket = window.io.connect('http://localhost:8080/stomp');
            console.log("conect to server");
            client = Stomp.over(socket);
            //open a chanle to list login message from server 
            client.connect({}, function () {
                client.subscribe("/queue/pusmicGamePushLoginUserInfoChanle", function (message) {
                    var bodyStr = message.body;
                    var obj = JSON.parse(bodyStr);
                    if (obj != undefined && obj != null) {
                        for (var p in obj) {
                            userInfo[p] = obj[p]
                        }
                        console.log("userInfo.nickname:" + userInfo.nickName);
                        Global.userInfo = userInfo;
                        //update the user public ip from url call
                        self.updateUserIP(userInfo.id);
                        //
                        //self.initalPrivateChanleForUser(userInfo.roomNumber);

                        //user login success ,go to game main sence
                        //cc.director.loadScene('table');
                        this.index.active=false;
                        this.mainMenu.active=true;
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




            //----------------

        } else {
            //Gobal userInfo already get the value ,drictly to to gameMain2
            cc.director.loadScene('table');

        }


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    sendWebSokectMessageToServer: function () {
        var o = new Object();
        o.token = "test word"
        client.send("/app/resiveAllUserChanle", {}, JSON.stringify(o));
    },
    //send webchat opnunid to server to login user
    loginUserToServerByToken: function () {
        var o = new Object();
        o.token = "test word"
        client.send("/app/pusmicGameLoginUserChanle", {}, JSON.stringify(o));

    },
    //open user ip login url
    updateUserIP: function (id) {
        var xhr = new XMLHttpRequest();
        var url = serverUrl + "/user/getLoginUserIP?userId=" + id;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                Global.userInfo.publicIPAddress = response
                cc.director.loadScene('table');
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },

    //-----------------------------------------------------------------------------
    onDestroy: function () {
        //colse the websokect
        client.disconnect();
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
        cc.game.onStop = function () {
            cc.log("stopApp");
        }
    },
    //-----------------------websokect error callback--------------------------------
    error_callback: function (error) {
        // display the error's message header:
        cc.log("Self Error:" + error);
    },

});
