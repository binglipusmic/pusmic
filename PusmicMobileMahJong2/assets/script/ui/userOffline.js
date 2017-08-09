var alertMessageUI;
var timerUpate;
var timeCount;
var networkSprit;
var offlineNumber = 0;
var agreeDeleUserCount = 0;
var offlineUserOpenId = "";
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

        alertMessageNodeScirpt: cc.Node,
        waitTimLableNode: cc.Node,
        continueWaitBtn: cc.Node,
        deleteRoomBtn: cc.Node,
        offlineLable: cc.Node,
        userSelectLableNode: cc.Node,
        offlinePanel: cc.Node,
        netWorkScriptNode: cc.Node,
        reJoinRoomNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        reJoinRoomScript = this.reJoinRoomNode.getComponent("reJoinRoomUI");
      
        networkSprit = this.netWorkScriptNode.getComponent("GameTableNetWork");
        alertMessageUI = this.alertMessageNodeScirpt.getComponent("alertMessagePanle");
        timeCount = 30;
        offlineNumber = 0;
        agreeDeleUserCount = 0;
        offlineUserOpenId = "";
        let self = this;
        timerUpate = function () {

            timeCount--;

            if (timeCount == -1) {
                self.stopTimer();
            }

            var timerLable = self.waitTimLableNode.getComponent(cc.Label);
            timerLable.string = "等待【" + timeCount + "】秒......";

        };

        self.waitTimLableNode.active = false;
    },
    setUserSelectLabe: function () {

    },
    showOfflinePanel: function (nikeName, openid) {
       // this.offlinePanel.active = true;
        var userOfflineLabble = this.offlineLable.getComponent(cc.RichText);
        userOfflineLabble.string = userOfflineLabble.string + " " + nikeName + " 已离线！请选择等待或解散房间。\n";
        offlineNumber++;
        //only record the first offfline user
        if (offlineUserOpenId == "") {
            offlineUserOpenId = openid;
        }
    },

    hideOfflinePanel: function () {
        this.offlinePanel.active = false;
        var userOfflineLabble = this.offlineLable.getComponent(cc.RichText);
        userOfflineLabble.string = "";
        //userSelectLableNode

        var userSelectLable = this.userSelectLableNode.getComponent(cc.RichText);
        userSelectLable.string = "";

    },

    stratTimer: function () {
        timeCount = 30;

        let self = this;
        var timerLable = self.waitTimLableNode.getComponent(cc.Label);
        timerLable.string = "";
        self.waitTimLableNode.active = true;
        self.continueWaitBtn.active = false;
        self.deleteRoomBtn.active = false;
        self.schedule(timerUpate, 1);

        var userInfo = Global.userInfo;
        var o = new Object();
        o.openid = userInfo.openid;
        o.message = userInfo.nickName + " 已选择继续等待。";
        networkSprit.sendUserOfflineSatauSelect(JSON.stringify(o));

    },

    showOptionIntoUserSlect: function (message) {
        var o = JSON.parse(message);
        var userSelctOption = this.userSelectLableNode.getComponent(cc.RichText);
        userSelctOption.string = userSelctOption.string + o.message + "\n";
        if (o.message.indexOf("解散") >= 0) {
            agreeDeleUserCount++;
        }

    },
    stopTimer: function () {
        let self = this;
        self.unschedule(timerUpate);
        self.waitTimLableNode.active = false;
        self.continueWaitBtn.active = true;
        self.deleteRoomBtn.active = true;
    },

    checkIfDeleteRoom: function () {

        var roomNumber = Global.joinRoomNumber;

        var gameMode = Global.gameMode;
        if (gameMode == null) {
            gameMode = require("gameMode").gameMode;
        }
        var gamePeopleNumber = gameMode.gamePeopleNumber;
        var maxFan = 0;
        if (gameMode.fan2 == 1) {
            maxFan = 4;
        }
        if (gameMode.fan3 == 1) {
            maxFan = 8;
        }
        if (gameMode.fan4 == 1) {
            maxFan = 16;
        }
        if (gameMode.fan6 == 1) {
            maxFan = 64;
        }
        if (gamePeopleNumber != null && gamePeopleNumber != undefined) {
            if (agreeDeleUserCount == gamePeopleNumber - offlineNumber) {

                var userSelctOption = this.userSelectLableNode.getComponent(cc.RichText);
                userSelctOption.string = userSelctOption.string + "所有用户已同意解散房间" + "\n";

                console.log("all user agree delete room");
                //send the user to koufen
                networkSprit.sendOffLineUserKouFen(offlineUserOpenId, maxFan);
                networkSprit.closeGameRoundLunByRoomNumber(roomNumber);
                //closeGameRoundLun
            }
        }
    },

    deleteRoomByUserSelf: function () {
        var gameMode = Global.gameMode;
        var roomNumber = Global.joinRoomNumber;
        if (gameMode == null) {
            gameMode = require("gameMode").gameMode;
        }
        var gamePeopleNumber = gameMode.gamePeopleNumber;
        var maxFan = 0;
        if (gameMode.fan2 == 1) {
            maxFan = 4;
        }
        if (gameMode.fan3 == 1) {
            maxFan = 8;
        }
        if (gameMode.fan4 == 1) {
            maxFan = 16;
        }
        if (gameMode.fan6 == 1) {
            maxFan = 64;
        }
        var userInfo = Global.userInfo;


        networkSprit.sendOffLineUserKouFen(offlineUserOpenId, maxFan);
        networkSprit.closeGameRoundLunByRoomNumber(roomNumber);

        var userInfo = Global.userInfo;
        Global.joinRoomNumber = userInfo.roomNumber;

        reJoinRoomScript.hideReJoinGUI();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    showHelpPanleMessage: function () {

        alertMessageUI.text = "  如果你选择继续等待，那么程序会继续等待30秒，然后重新选择； ";
        alertMessageUI.text = alertMessageUI.text + "  如果你选择解散房间,需要剩下房间内所有用户同意，才能解散房间，任何一人不同意，将继续等待。";
        alertMessageUI.text = alertMessageUI.text + "  意外断线的用户，在解散房间后，将会根据房间选择的最高番数，扣除最高分。";
        //如果你选择解散房间,需要剩下房间
        alertMessageUI.setTextOfPanel();

    },
    testShowMessage:function(){

        var userSelctOption = this.userSelectLableNode.getComponent(cc.RichText);
        userSelctOption.string = userSelctOption.string + "test ddddd" + "\n";
        if (o.message.indexOf("解散") >= 0) {
            agreeDeleUserCount++;
        }

    },
    testDele: function () {
        this.deleteRoom("user 1 选择了解散房间");
    },

    deleteRoom: function (message) {
        let self = this;
        self.continueWaitBtn.active = false;
        self.deleteRoomBtn.active = false;


        var userInfo = Global.userInfo;
        var o = new Object();
        o.openid = userInfo.openid;
        o.message = userInfo.nickName + " 已选择解散房间。";
        networkSprit.sendUserOfflineSatauSelect(JSON.stringify(o));
        //networkSprit.sendUserOfflineSatauSelect(userInfo.nikeName + " 已选择解散房间。");

        //      var richText = self.userSelectLableNode.getComponent(cc.RichText);
        //      richText.string = richText.string + message + "\n";
    }

});
