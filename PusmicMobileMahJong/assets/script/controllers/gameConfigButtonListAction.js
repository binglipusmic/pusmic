
var boyBtn = null;
var grilBtn = null;
var tableNetWork = null;
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

        gameTable: cc.Node,
        gameTableHead: cc.Node,
        gameTableModeBarNode: cc.Node,

        userNickNameNode: cc.Node,
        userCodeNode: cc.Node,

        tableNetWorkNode: cc.Node,

    },

    // use this for initialization
    onLoad: function () {

        grilBtn = this.mainMenuGrailBtn.getComponent(cc.Button);
        boyBtn = this.mainMenuBoyBtn.getComponent(cc.Button);
        tableNetWork = this.tableNetWorkNode.getComponent("GameTableNetWork");


    },
    showUserNickNameAndCode: function () {
        var userInfo = Global.userInfo;
        if (userInfo != null && userInfo != undefined) {
            var userNickname = this.userNickNameNode.getComponent(cc.Label);
            var userCode = this.userCodeNode.getComponent(cc.Label);

            userNickname.string = userInfo.nickName;
            userCode.string = userInfo.userCode;

        }
    },

    enterMainEntry: function () {
        tableNetWork.initalClient();
        this.indexNode.active = false;
        this.mainMenuNode.active = true;
        grilBtn.enabled = true;
        boyBtn.enabled = true;
    },
    showGameConfig: function () {
        this.gameConfigNode.active = true;

        boyBtn.enabled = false;
        grilBtn.enabled = false;
    },
    closeGameConfig: function () {
        this.gameConfigNode.active = false;
        boyBtn.enabled = true;
        grilBtn.enabled = true;

    },
    showGameModePanel: function () {
        this.gameModeNode.active = true;
        boyBtn.enabled = false;
        grilBtn.enabled = false;

    },
    closeGameModePanel: function () {
        this.gameModeNode.active = false;
        boyBtn.enabled = true;
        grilBtn.enabled = true;
    },

    existGame: function () {
        cc.game.end()
    },

    showGameTalbe: function () {
        this.gameTable.active = true;
        this.joinRoomNumberUINode.active = false;
        this.gameModeNode.active = false;
        this.indexNode.active = false;
        this.mainMenuNode.active = false;

        this.gameTableHead.active = false;
        this.gameTableModeBarNode.active = true;
    },
    closeGameTable: function () {
        this.gameTable.active = false;
        //this.mainMenuNode.active = true;
        tableNetWork.closeGameRoundLun();
        this.enterMainEntry();

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
