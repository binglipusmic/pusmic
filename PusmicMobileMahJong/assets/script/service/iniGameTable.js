


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
        audioMng: cc.Node,
        tableNode: cc.Node,
        gameModeNode: cc.Node,
        gameMainMenu: cc.Node,
        userNickNameLableNode: cc.Node,
        userCodeLable: cc.Node,
        userDemondNumberLable: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        
        let self = this;

        //serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        //socket = new SockJS(serverUrl + "/stomp");

        var messageUser = require("messageDomain").messageDomain;
        //var messageUser;
        //-----------music :play bgm-------------------------------------------------------------------------------
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.audioMng.playMusic();
        //hide the game mode 
        self.gameModeNode.active = false;
        self.tableNode.active = false;
        self.gameMainMenu.active = true;
        self.gameMainMenu.opacity = 255;
        //----------------------------------------------------------------------------------------------------------

        //inital user info in the gameMain sence
        if (Global.userInfo == undefined || Global.userInfo == null) {
            console.log("Error: no found correct user ,please check server or network.");
        } else {
            var userInfo = Global.userInfo;

            //intal user Text
            self.intalUserInfoOnGameMainLayer();
            //self.initalUserInfoLayer(userInfo);
            //inital the user message
            messageUser.messageBelongsToPrivateChanleNumber = userInfo.roomNumber;
            //messageAction
            messageUser.messageAction = "sendToOther";
            messageUser.messageType = "user";
            messageUser.messageBody = JSON.stringify(userInfo);
            //self.sendWebSokectMessageToServer(messageUser)


        };

        // cc.game.onStop = function () {
        //     cc.log("stopApp");
        // }

    },
  
    //----------------------------------Create room button event---------------------------------------------------------
    
    


    joinRoom_initalUserInfo: function () {
        this.initalUserInfoLayer();
    },
 


    //----------------------------------inital user info layer-----------------------------------------------------------
    intalUserInfoOnGameMainLayer: function () {
        // var topUserLayer = this.gameMainMenu.getChildByName("topInfoUserLayer");
        // var topUserInfoLayer = topUserLayer.getChildByName("userInfoLayer");
        // var topUserLayout = topUserInfoLayer.getChildByName("userInfoLayout");
        // var topUserLayout2 = topUserLayout.getChildByName("userInfoTextLayout");

        // var userNameLableNode = topUserLayout2.getChildByName("userNickNameLable");
        // var userCodeLableNode = topUserLayout2.getChildByName("userCodeLable");
        // var userDemondLableNode = topUserLayout2.getChildByName("userDemondNumber");

        var userNameLable = this.userNickNameLableNode.getComponent(cc.Label);
        var userCodeLable = this.userCodeLable.getComponent(cc.Label);
        var userDemondLable = this.userDemondNumberLable.getComponent(cc.Label);

        userNameLable.string = Global.userInfo.nickName;
        userDemondLable.string = Global.userInfo.diamondsNumber;
        userCodeLable.string = Global.userInfo.userCode;
    },

    //----------------------------------web sokec connect and subscribe and handle resive message------------------------
 

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    //------------------------------- when tha table sence end ,it will need remove online user and close websokect---------
 

    //open user ip login url

    //--------------------------------update user ip---------------------------
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
});
