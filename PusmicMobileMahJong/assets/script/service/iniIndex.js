var client;
var privateClient;
var userInfo;
var serverUrl;
var socket;
var gameActionListGet;
var onlineCheckUser;
var messageScript;
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

    },

    // use this for initialization
    onLoad: function () {
        messageScript = this.messageNode.getComponent("alertMessagePanle");

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
                    //************we must check user in here*******************************
                    //NEED TO DO ********************

                    if (Global.userInfo == null || Global.userInfo == undefined) {


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
                    }
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

    sendUserCode: function () {
        //client.send("/app/usercode_resive_message", {}, JSON.stringify("test"));
        //gameActionListGet.showLoadingIcon();
        //client.send("/app/usercode_resive_message", {}, "test");


        //  cc.sys.localStorage.setItem('gameConfig', JSON.stringify(Global.gameConfigSetting));


        var isinstall = jsb.reflection.callStaticMethod('WXApiManager', 'isWXInstalled');
        if (isinstall) {
            //check openid if in the client
            var openid = cc.sys.localStorage.getItem("openid");

            if (openid == null || openid == undefined || openid == "") {
                //open webchat to auth user
                jsb.reflection.callStaticMethod('WXApiManager', 'sendAuthRequestWX', 'snsapi_userinfo', 'pusmic_game_majhong');
            } else {
                //refresh auth token again.
                var messageObj = this.buildSendMessage(openid, "", "refreshToken");
                client.send("/app/usercode_resive_message", {}, JSON.stringify(messageObj));

            }
        }
        else {
            specialModule._loginfun = null;
            messageScript.text = "未安装微信!";
            messageScript.setTextOfPanel();
            cc.log('未安装微信!');
        }

    },
    refreshToken: function (refresh_token) {
        var appid = "wxc759dfd81a4af8da";
        var appSecrect = "a8864c0ae4a3422e78561be99c46cb5e";
        var xhr = new XMLHttpRequest();
        //https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN

        var url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=" + appid + "&grant_type=refresh_token&refresh_token=" + refresh_token;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                if (response.length > 0) {
                    if (response.indexOf("errcode") >= 0) {
                        messageScript.text = response;
                        messageScript.setTextOfPanel();
                    } else {
                        var userObj = JSON.parse(response);
                        var access_token = userObj.access_token;
                        var openid = userObj.openid;
                        var refresh_token_new = userObj.refresh_token;
                        if (refresh_token_new != refresh_token) {
                            cc.sys.localStorage.setItem('refresh_token', refresh_token_new);
                            this.sendUserAuthTokenAndRefreshTokenToServer(access_token, refresh_token, openid);
                        }
                        //store the token into server
                    }


                }
            }
        }.bind(this);
        xhr.open("GET", url, true);
        xhr.send();
    },
    //refresh token
    //https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
    //get token by code from native call
    getRequstTokenByCode: function (code) {
        var appid = "wxc759dfd81a4af8da";
        var appSecrect = "a8864c0ae4a3422e78561be99c46cb5e";
        var grant_type = "authorization_code";


        var xhr = new XMLHttpRequest();
        var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appSecrect + "&code=" + code + "&grant_type=" + grant_type;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                if (response.length > 0) {
                    if (response.indexOf("errcode") >= 0) {
                        messageScript.text = response;
                        messageScript.setTextOfPanel();
                    } else {
                        var userObj = JSON.parse(response);
                        var access_token = userObj.access_token;
                        var openid = userObj.openid;
                        var refresh_token = userObj.refresh_token;
                        cc.sys.localStorage.setItem('openid', openid);
                        //cc.sys.localStorage.setItem('access_token', access_token);
                        this.sendUserAuthTokenAndRefreshTokenToServer(access_token, refresh_token, openid);
                        //store the token into server
                    }


                }
            }
        }.bind(this);
        xhr.open("GET", url, true);
        xhr.send();

    },

    getUserInfoAndStoreIntoServer: function (access_token, openid) {

        var xhr = new XMLHttpRequest();
        var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                if (response.length > 0) {
                    if (response.indexOf("errcode") >= 0) {
                        messageScript.text = response;
                        messageScript.setTextOfPanel();
                    } else {
                        var userObj = JSON.parse(response);
                        cc.sys.localStorage.setItem('authUserObject', JSON.stringify(userObj));
                        //userObj.action = "saveUserInfo";
                        //store the token into server
                        var messageObj = this.buildSendMessage(JSON.stringify(o), "", "saveUserInfo");
                        client.send("/app/usercode_resive_message", {}, JSON.stringify(messageObj));
                        // client.send("/app/usercode_resive_message", {}, JSON.stringify(userObj));
                    }


                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();

    },

    //https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID

});
