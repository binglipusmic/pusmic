var userInfo;
var userInfoLayer;
var gameModeLayer;
var topInfoLayer;
var mainListButtonLayer;
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
        audioMng: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        let self = this;

        serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        socket = new SockJS(serverUrl + "/stomp");

        //play bgm
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.audioMng.playMusic();
        //hide the game mode 
        gameModeLayer = cc.find("Canvas/GameModeSelect");
        gameModeLayer.active = false;

        topInfoLayer = cc.find("Canvas/topInfoUserLayer");
        mainListButtonLayer = cc.find("Canvas/ListButton");
        //inital user info in the gameMain sence
        if (Global.userInfo == undefined || Global.userInfo == null) {
            console.log("Error: no found correct user ,please check server or network.");
        } else {
            userInfo = Global.userInfo;
            //intal the user info text 
            //userInfoLayer = cc.find("Canvas/topInfoLayer/userInfoLayout/userInfoTxtLayout");
            self.initalPrivateChanleForUser(userInfo.roomNumber);

        }

        //
    },
    showGameModeNode: function () {
        gameModeLayer.active = true;
        topInfoLayer.active = false;
        mainListButtonLayer.active = false;
    },
    hideGameModeNode: function () {
        gameModeLayer.active = false;
        topInfoLayer.active = true;
        mainListButtonLayer.active = true;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    initalPrivateChanleForUser: function (roomNumber) {
        cc.log("roomNumber:" + roomNumber);
        var privateClient = Stomp.over(socket);

        privateClient.connect({}, function () {
            privateClient.subscribe("/queue/privateRoomChanle" + roomNumber, function (message) {
                var bodyStr = message.body;
                cc.log("get meesge from private chanle:privateRoomChanle" + roomNumber);
            });
        }, function () {
            cc.log("connect private chanle error !");
        });


    },


});
