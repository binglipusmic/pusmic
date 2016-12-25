var client;
var privateClient;
var userInfo;
var serverUrl;
var socket;

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
    },

    // use this for initialization
    onLoad: function () {

           serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
           socket = new SockJS(serverUrl + "/stomp");
            console.log("conect to server");
            client = Stomp.over(socket);
           var csrfHeaderName = "JSESSIONID";
           var csrfToken = "C5FA6497FF3C9509025BBC42C0288261";
             var headers = {};
             headers[csrfHeaderName]=csrfToken;
                   client.connect(headers, function () {
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
                        cc.director.loadScene('table');
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


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
