var client;
var privateClient;
var userInfo;
var serverUrl;
var socket;
var gameActionListGet;
var onlineCheckUser;
var messageScript;
var roomNumber;
var base64 = require('base64');
var reJoinRoomScript;
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
        messageNode: cc.Node,
        loadingNode: cc.Node,
        logBtnNode: cc.Node,
        reJoinRoomNode: cc.Node,


    },

    // use this for initialization
    onLoad: function () {
        reJoinRoomScript = this.reJoinRoomNode.getComponent("reJoinRoomUI");
        //------------
        var loginBtn = this.logBtnNode.getComponent(cc.Button);

        if (cc.sys.os == cc.sys.OS_IOS) {
            console.log("ios platam:");
            jsb.reflection.callStaticMethod('LocationFunc', 'initalLocation');

        }

        console.log("ini index onload ");
        console.log("ini index onload:");
        console.log("ini index onload ");

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            console.log("OS_ANDROID platam GPS:");
            jsb.reflection.callStaticMethod("com/pusmicgame/mahjong/AppActivity", "getLocation", "()V");
        }


        messageScript = this.messageNode.getComponent("alertMessagePanle");
        //window.iniIndex = require("iniIndex");
        //webchat head img test-------------------------------
        /*
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
        xhr.send();*/
        //----------------------------------------------------
        gameActionListGet = this.gameActionList.getComponent("gameConfigButtonListAction");
        onlineCheckUser = this.checkOnlineUser.getComponent("onlineUserCheck");
        userInfo = require("userInfoDomain").userInfoDomain;
        serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        socket = new SockJS(serverUrl + "/stomp");
        console.log("conect to server");
        client = Stomp.over(socket);
        // var csrfHeaderName = "Set-Cookie";
        // var csrfToken = "session=B227654DB13B28329F96DB2959FAE26B";
        var headers = {};
        // headers["user-agent"] = "test";
        client.connect(headers, function () {
            roomNumber = this.getRandom();
            cc.sys.localStorage.setItem("loginRoomNumber", roomNumber);
            client.subscribe("/queue/pusmicGamePushLoginUserInfoChanle" + roomNumber, function (message) {
                console.log("######################");
               
                var bodyStr = "";
                if (message == null || message == undefined) {
                } else {
                    if (message.body == null || message.body == undefined) {
                    } else {
                        bodyStr = message.body;
                    }
                }
                console.log(bodyStr);

                if ( bodyStr.length == 0 ) {
                    this.reforceLogin();
                } else {
                    console.log("decode1:" + bodyStr);
                    bodyStr = base64.decode(bodyStr);
                    // bodyStr = this.b64DecodeUnicode(bodyStr)
                    console.log("decode2:" + bodyStr);
                    var obj = JSON.parse(bodyStr);
                    if (obj != undefined && obj != null) {
                        for (var p in obj) {
                            userInfo[p] = obj[p]
                        }

                        //************we must check user in here*******************************
                        //NEED TO DO ********************

                        if (Global.userInfo == null || Global.userInfo == undefined) {


                            console.log("userInfo.nickname:" + userInfo.nickName);
                            console.log("userInfo.headImageFileName:" + userInfo.headImageFileName);
                            cc.sys.localStorage.setItem('userOpenId', userInfo.openid);
                            Global.userInfo = userInfo;
                            //update the user public ip from url call
                            //self.updateUserIP(userInfo.id);
                            //
                            //self.initalPrivateChanleForUser(userInfo.roomNumber);

                            //user login success ,go to game main sence
                            //cc.director.loadScene('table');

                            //
                            var userCode = cc.sys.localStorage.getItem('webChatCode');
                            console.log("user code equ:" + userCode);
                            console.log("obj user code equ:" + obj.webChatUserCode);
                            if (userCode == obj.webChatUserCode) {
                                client.disconnect();
                                client = null;
                                gameActionListGet.enterMainEntry("1");
                                gameActionListGet.showUserNickNameAndCode();
                                gameActionListGet.closeLoadingIcon();
                                gameActionListGet.updatePuclicMessage();
                                console.log("hotupdate test updatePuclicMessage:");
                                loginBtn.interactable = false;
                                //get location 

                                if (cc.sys.os == cc.sys.OS_IOS) {
                                    console.log("ios platam:");
                                    jsb.reflection.callStaticMethod('LocationFunc', 'getCurrentLocation');

                                }
                                console.log("obj.onlineStatus:" + obj.onlineStatus);
                               
                                if (obj.onlineStatus + "" == "3") {
                                    reJoinRoomScript.showReJoinGUI();
                                    Global.joinRoomNumber = obj.onlineRoomNumber;
                                }
                            }
                        }
                    } else {

                        console.log("No found correct user info return from server ,please check .");
                    }
                }

                //self.testLabel.string = message.body;
                //$("#helloDiv").append(message.body);

                //cc.director.loadScene('gameMain2');
            }.bind(this), function () {
                console.log("websocket connect subscribe Error:233");
                //client.disconnect();
            });
        }.bind(this), function () {
            console.log("websocket connect  Error:234");
            //client.disconnect();
        });


        //onlineCheckUser.client = client;
       // onlineCheckUser.checkonlineUser(client);

        cc.game.onStop = function () {
            console.log("stopApp$$$$$$$$$$$$$$$$$");
            // client.disconnect();

        }


        //----------------------------

        var nowTime = new Date("2017", "4", "12");
        //nowTime=this.dateFormat(nowTime);
        var oldTiem = new Date("2017", "3", "12");
        var cha = (nowTime - oldTiem) / 3600 / 1000 / 24;
        console.log("nowTime:" + cha);


    },
    b64EncodeUnicode: function (str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    },
    b64DecodeUnicode: function (str) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },

    dateFormat: function (date) {
        var year = date.getFullYear();
        var Month = date.getMonth() + 1;
        var Day = date.getDate();
        return year + "-" + Month + "-" + Day
    },

    compareDayWithNow: function (oldTime) {
        var now = new Date();
        var year = now.getFullYear();
        var Month = now.getMonth() + 1;
        var Day = now.getDate();

        var nowTime = new Date(year, Month, Day);

        var cache = oldTime.split("-");
        var oldTime = new Date(cache[0], cache[1], cache[2]);
        var cha = (nowTime - oldTime) / 3600 / 1000 / 24;
        return cha;

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onDestroy: function () {
        //colse the websokect
        client.disconnect();
        console.log("onDestroy");
    },


    getRandom: function () {
        var n = 1000000
        var m = 9999999
        var c = m - n + 1;
        return Math.floor(Math.random() * c + n);
    },
    //----------------------inital private chanle----------------------------------
    // initalPrivateChanleForUser: function (roomNumber) {
    //     console.log("roomNumber:"+roomNumber);
    //     privateClient = Stomp.over(socket);

    //         privateClient.connect({}, function () {
    //             privateClient.subscribe("/queue/privateRoomChanle" + roomNumber, function (message) {
    //                 var bodyStr = message.body;
    //                 console.log("get meesge from private chanle:privateRoomChanle"+roomNumber);
    //             });
    //         },function(){
    //              console.log("connect private chanle error !");
    //         });

    // privateClientChanle
    // },
    //----------------------game stop-----------------------------------------------
    gameStop: function () {

    },
    testSaveToken: function () {
        this.sendUserAuthTokenAndRefreshTokenToServer("testAuth", "refreshToken", "test5")
    },
    buildSendMessage: function (messageBody, roomNum, action) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNum;
        messageDomain.messageAction = action;
        messageDomain.messageBody = messageBody;

        return messageDomain


    },
    sendUserAuthTokenAndRefreshTokenToServer: function (authToken, refreshToken, openid) {
        var o = new Object();
        o.authToken = authToken;
        o.refreshToken = refreshToken;
        o.openid = openid;
        var messageObj = this.buildSendMessage(JSON.stringify(o), "", "saveAuthToken");

        client.send("/app/usercode_resive_message", {}, JSON.stringify(messageObj));
    },
    sendUserCodetest: function () {
        var messageObj = this.buildSendMessage("2233", "", "refreshToken");
        client.send("/app/usercode_resive_message", {}, JSON.stringify(messageObj));
    },

    reinstalClient: function () {
        var serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        socket = new SockJS(serverUrl + "/stomp");
        console.log("conect to server");
        client = Stomp.over(socket);
        var headers = {};
        client.connect(headers, function () { });
        //return client
    },

    reforceLogin: function () {
        var nowTime = new Date();
        console.log("nowTime 218:" + nowTime);
        var isinstall = false;
        if (cc.sys.os == cc.sys.OS_IOS) {
            isinstall = jsb.reflection.callStaticMethod('WXApiManager', 'isWXInstalled');
        }

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            isinstall = jsb.reflection.callStaticMethod("com/pusmicgame/mahjong/AppActivity", "isWXInstalled", "()Z");

        }

        if (isinstall) {
            //check openid if in the client
            var authLoginTime = cc.sys.localStorage.getItem("authLoginTime");
            var reLoginFlag = false;

            console.log("reLoginFlag:" + reLoginFlag);


            //open webchat to auth user
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('WXApiManager', 'sendAuthRequestWX');
            }

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("com/pusmicgame/mahjong/AppActivity", "sendReq", "()V");
            }

        }
        else {
            specialModule._loginfun = null;
            messageScript.text = "未安装微信!";
            messageScript.setTextOfPanel();
            console.log('未安装微信!');
        }
    },

    sendUserCode: function () {
        //client.send("/app/usercode_resive_message", {}, JSON.stringify("test"));
        //gameActionListGet.showLoadingIcon();
        //client.send("/app/usercode_resive_message", {}, "test");


        //  cc.sys.localStorage.setItem('gameConfig', JSON.stringify(Global.gameConfigSetting));

        var nowTime = new Date();
        console.log("nowTime 218:" + nowTime);
        var isinstall = false;
        if (cc.sys.os == cc.sys.OS_IOS) {
            console.log("This is ios");
            isinstall = jsb.reflection.callStaticMethod('WXApiManager', 'isWXInstalled');
            //-----only for app store-------------------------------
            // isinstall=true;
            // var nowDate=new Date();
            // nowDate=this.dateFormat(nowDate);
            // cc.sys.localStorage.setItem('authLoginTime', nowDate);
            // cc.sys.localStorage.setItem('webChatCode', "081GRpGh1LGlhz0c9aDh1AnlGh1GRpGV");
            // cc.sys.localStorage.setItem('userOpenId', "oCG9Xwo2BF--ukJXk9uCTLqhz8f8");

        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            isinstall = jsb.reflection.callStaticMethod("com/pusmicgame/mahjong/AppActivity", "isWXInstalled", "()Z");

        }
        console.log("isinstall:" + isinstall);
        if (isinstall) {
            //check openid if in the client
            var authLoginTime = cc.sys.localStorage.getItem("authLoginTime");
            var reLoginFlag = false;
            console.log("authLoginTime:"+authLoginTime);
            if (authLoginTime == null || authLoginTime == undefined || authLoginTime == "") {
                reLoginFlag = true;
            } else {
                var cha = this.compareDayWithNow(authLoginTime);
                if (cha >= 29) {
                    //only for ios test,if test done ,we should remove this
                    reLoginFlag = true;
                }

            }
            console.log("reLoginFlag:" + reLoginFlag);

            if (reLoginFlag) {
                //open webchat to auth user
                if (cc.sys.os == cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod('WXApiManager', 'sendAuthRequestWX');
                }
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("com/pusmicgame/mahjong/AppActivity", "sendReq", "()V");
                }
            } else {
                //refresh auth token again.
                var openid = cc.sys.localStorage.getItem('userOpenId');
                if (roomNumber == null || roomNumber == undefined) {
                    roomNumber = cc.sys.localStorage.getItem("loginRoomNumber");
                }
                var o = new Object();
                o.openid = openid;
                o.roomNumber = roomNumber;
                var messageObj = this.buildSendMessage(JSON.stringify(o), "", "refreshToken");
                if (client == null || client == undefined) {
                    this.reinstalClient();
                }
                client.send("/app/usercode_resive_message", {}, JSON.stringify(messageObj));

            }
        }
        else {
            // specialModule._loginfun = null;
            messageScript.text = "未安装微信!";
            messageScript.setTextOfPanel();
            console.log('未安装微信!');
        }

    },
    //refresh token
    //https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
    //get token by code from native call
    getRequstTokenByCode: function (code) {
        console.log("getRequstTokenByCode:" + code);
        //console.log("errorCode:" + errorCode);
        var appid = "";
        var appSecrect = "";
        var grant_type = "authorization_code";
        var nowDate = new Date();
        nowDate = this.dateFormat(nowDate);
        console.log("getRequstTokenByCode:" + code);
        console.log("getRequstTokenByCode nowDate:" + nowDate);
        //if (errorCode + "" == "0") {
        cc.sys.localStorage.setItem('authLoginTime', nowDate);
        cc.sys.localStorage.setItem('webChatCode', code);

        var o = new Object();
        if (roomNumber == null || roomNumber == undefined) {
            roomNumber = cc.sys.localStorage.getItem("loginRoomNumber");
        }

        o.roomNumber = roomNumber;
        o.code = code;

        var messageObj = this.buildSendMessage(JSON.stringify(o), "", "getTokenByCode");
        if (client == null || client == undefined) {
            this.reinstalClient();
        }
        client.send("/app/usercode_resive_message", {}, JSON.stringify(messageObj));


    },

    getRequstTokenByCodeOnError: function () {
        messageScript.text = "你必须要同意微信授权才能登陆游戏!";
        messageScript.setTextOfPanel();

    },


    //https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID

});