
var boyBtn = null;
var grilBtn = null;
var tableNetWork = null;
var showGameMode = null;
var gameConfigScript = null;
var tableUserInfo = null;
var reJoinRoomUI = null;
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

        indexNode: cc.Node,
        mainMenuNode: cc.Node,
        mainMenuGrailBtn: cc.Node,
        mainMenuBoyBtn: cc.Node,
        gameModeNode: cc.Node,
        joinRoomNumberUINode: cc.Node,
        gameConfigNode: cc.Node,
        alertMessageNode: cc.Node,

        tableNode: cc.Node,

        gameTable: cc.Node,
        gameTableHead: cc.Node,
        gameTableModeBarNode: cc.Node,

        userNickNameNode: cc.Node,
        userCodeNode: cc.Node,
        userImageNode: cc.Node,

        tableNetWorkNode: cc.Node,

        loadingNode: cc.Node,
        loadIconNode: cc.Node,
        showGameModeScript: cc.Node,

        //table room
        closeRoomBtn: cc.Node,
        //mainMenu 
        backRoomBtn: cc.Node,
        newRoomBtn: cc.Node,

        gameConfigSettingScript: cc.Node,
        tableUserInfoScript: cc.Node,

        userScoreNode: cc.Node,
        userDemonNode: cc.Node,
        publicMessageNode: cc.Node,

    },

    // use this for initialization
    onLoad: function () {

        grilBtn = this.mainMenuGrailBtn.getComponent(cc.Button);
        boyBtn = this.mainMenuBoyBtn.getComponent(cc.Button);
        tableNetWork = this.tableNetWorkNode.getComponent("GameTableNetWork");
        this.loadingNode.active = false;
        this.backRoomBtn.active = false;
        this.newRoomBtn.active = true;

        showGameMode = this.showGameModeScript.getComponent("showGameMode");
        gameConfigScript = this.gameConfigSettingScript.getComponent("gameConfigController");
        tableUserInfo = this.tableUserInfoScript.getComponent("tableUserInfo");

    },
    //----------Join room--------------------------------------------------------------------
    showJoinRoomNode: function () {
        this.joinRoomNumberUINode.active = true;
        boyBtn.enabled = false;
        grilBtn.enabled = false;

    },
    closeJoenRoomNode: function () {
        this.joinRoomNumberUINode.active = false;
        boyBtn.enabled = true;
        grilBtn.enabled = true;
    },
    updateScoreAndDemand: function () {
        var userInfo = Global.userInfo;
        if (userInfo != null && userInfo != undefined) {
            var userScore = this.userScoreNode.getComponent(cc.Label);
            userScore.string = userInfo.gameScroe;
            var demonNum = this.userDemonNode.getComponent(cc.Label);
            demonNum.string = userInfo.diamondsNumber;
        }

    },

    updateDemand:function(){
        var userInfo = Global.userInfo;
        console.log("updateDemand:"+userInfo.diamondsNumber);
        if (userInfo != null && userInfo != undefined) {
             var demonNum = this.userDemonNode.getComponent(cc.Label);
            demonNum.string = userInfo.diamondsNumber;
        }
    },
    //update public message
    updatePuclicMessage: function () {
        var userInfo = Global.userInfo;
        console.log("updatePuclicMessage start");
        if (userInfo.publicMessage != null && userInfo.publicMessage != undefined) {
            var messageLable = this.publicMessageNode.getComponent(cc.Label);
            messageLable.string = userInfo.publicMessage;
        }
    },
    showUserNickNameAndCode: function () {
        var userInfo = Global.userInfo;
        if (userInfo != null && userInfo != undefined) {
            var userNickname = this.userNickNameNode.getComponent(cc.Label);
            var userCode = this.userCodeNode.getComponent(cc.Label);


            userNickname.string = userInfo.nickName;
            userCode.string = userInfo.userCode;
            this.updateScoreAndDemand();

        }
        var serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;

        var testHeaImageurl = serverUrl + "/webchatImage/" + userInfo.headImageFileName;
        cc.log("testHeaImageurl:" + testHeaImageurl);
        var userImage = this.userImageNode.getComponent(cc.Sprite);
        cc.loader.load(testHeaImageurl, function (err, texture) {
            var frame = new cc.SpriteFrame(texture);
            userImage.spriteFrame = frame;
        });
    },

    // action 1,build a  new room ,0, back to room
    enterMainEntry: function (action) {
        console.log("enterMainEntry");
        tableNetWork.initalClient();
        this.indexNode.active = false;
        this.mainMenuNode.active = true;
        this.tableNode.active = false;
        grilBtn.enabled = true;
        boyBtn.enabled = true;
        if (action == "1") {
            this.backRoomBtn.active = false;
            this.newRoomBtn.active = true;
            //hide all user node for table
            tableUserInfo.hideAllUserNode();
        } else {
            this.backRoomBtn.active = true;
            this.newRoomBtn.active = false;
        }

    },
    showGameConfig: function () {
        this.gameConfigNode.active = true;
        gameConfigScript.initalGameConfig();
        boyBtn.enabled = false;
        grilBtn.enabled = false;
    },
    closeGameConfig: function () {
        if (Global.gameConfigSetting != null && Global.gameConfigSetting != undefined && Global.gameConfigSetting != "") {
            cc.sys.localStorage.setItem('gameConfig', JSON.stringify(Global.gameConfigSetting));
        }


        this.gameConfigNode.active = false;
        boyBtn.enabled = true;
        grilBtn.enabled = true;

        cc.log("closeGameConfig:" + (Global.gameConfigSetting));

    },
    showGameModePanel: function () {
        if (this.backRoomBtn.active == true) {
            this.backTableAction();
        } else {
            this.gameModeNode.active = true;
            boyBtn.enabled = false;
            grilBtn.enabled = false;

        }

    },
    closeGameModePanel: function () {
        this.gameModeNode.active = false;
        boyBtn.enabled = true;
        grilBtn.enabled = true;
    },

    existGame: function () {
        cc.game.end()
    },

    //read the game user from Gobal user list and inital the user 
    showGameTalbeRound: function () {
        this.gameTable.active = true;
        this.joinRoomNumberUINode.active = false;
        this.gameModeNode.active = false;
        this.indexNode.active = false;
        this.mainMenuNode.active = false;

        this.gameTableHead.active = false;
        this.gameTableModeBarNode.active = true;
        this.closeRoomBtn.active = false;
        showGameMode.showGameMode();
    },

    showGameTalbe: function (roomOwner) {
        this.gameTable.active = true;
        this.joinRoomNumberUINode.active = false;
        this.gameModeNode.active = false;
        this.indexNode.active = false;
        this.mainMenuNode.active = false;

        this.gameTableHead.active = false;
        this.gameTableModeBarNode.active = true;

        if (roomOwner == "1") {
            this.closeRoomBtn.active = true;
        } else {
            this.closeRoomBtn.active = false;
        }

        showGameMode.showGameMode();
        //now we need instal the user info for each user
        tableUserInfo.initalUserInfoFromGobalList();
    },
    closeGameTable: function () {
        //this.gameTable.active = false;
        //this.mainMenuNode.active = true;
        tableNetWork.closeGameRoundLun();
        // Global.joinRoomNumber = "";
        // this.enterMainEntry("1");

    },
    onlyCloseGameTable: function () {
        this.gameTable.active = false;
        Global.joinRoomNumber = "";
        this.enterMainEntry("1");
        tableNetWork.forceInitaClient();
    },

    endGameRoundLun: function () {
        this.gameTable.active = false;
        //this.mainMenuNode.active = true;
        //tableNetWork.closeGameRoundLun();
        Global.joinRoomNumber = "";
        this.enterMainEntry("1");
    },

    showLoadingIcon: function () {
        this.loadingNode.active = true;
        var seq = cc.repeatForever(
            cc.rotateBy(3, 360)
        );
        this.loadIconNode.runAction(seq);
        cc.log("showLoadingIcon");

    },
    closeLoadingIcon: function () {
        this.loadIconNode.stopAllActions();
        this.loadingNode.active = false;

    },

    backRoomAction: function () {
        this.gameTable.active = false;
        this.enterMainEntry("0");
    },

    backTableAction: function () {
        var userInfo = Global.userInfo;
        var roomNumber = userInfo.roomNumber;
        if (Global.joinRoomNumber == roomNumber) {
            this.showGameTalbe("1");
        } else {
            this.showGameTalbe("0");
        }

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
