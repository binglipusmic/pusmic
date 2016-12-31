var client;
var roomNumber;
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

        var userInfo = require("userInfoDomain").userInfoDomain;

        roomNumber = userInfo.roomNumber;
        serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        socket = new SockJS(serverUrl + "/stomp");
        console.log("conect to server");
        client = Stomp.over(socket);

    },
    subscribeToPrivateChanel: function () {
        client.connect({}, function () {
            client.subscribe("/queue/privateUserChanel" + roomNumber, function (message) {
                var bodyStr = message.body;
                cc.log("######################");
                cc.log(bodyStr);
                var obj = JSON.parse(bodyStr);
                if (obj != undefined && obj != null) {
                    for (var p in obj) {
                        messageDomain[p] = obj[p]
                    }

                } else {

                    console.log("No found correct user info return from server ,please check .");
                }

            }, function () {
                cc.log("websocket connect subscribe Error:233");
                //client.disconnect();
            });
        }, function () {
            cc.log("websocket connect  Error:234");
            //client.disconnect();
        });

    },
    buildNewGameRound: function () {
        var gameMode = Global.gameMode;
        if (gameMode != null) {
            var messageObj = this.buildSendMessage(JSON.stringify(gameMode), roomNumber, "buildNewRound");
            this.sendMessageToServer(messageObj);
        }

    },
    getFaPai: function () {
        var messageObj = this.buildSendMessage("", roomNumber, "faPai");
        this.sendMessageToServer(messageObj);
    },

    sendMessageToServer: function (messageObj) {

        client.send("/app/userResiveMessage", {}, JSON.stringify(messageObj));

    },


    buildSendMessage: function (messageBody, roomNum, action) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNum;
        messageDomain.messageAction = action;
        messageDomain.messageBody = messageBody;

        return messageDomain


    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
