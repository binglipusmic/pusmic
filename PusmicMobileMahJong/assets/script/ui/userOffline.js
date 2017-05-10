var alertMessageUI;
var timerUpate;
var timeCount;
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
    },

    // use this for initialization
    onLoad: function () {
        alertMessageUI = this.alertMessageNodeScirpt.getComponent("alertMessagePanle");
        timeCount = 30;

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
    showOfflinePanel: function (nikeName) {
        this.offlinePanel.active = true;
        var userOfflineLabble = this.offlineLable.getComponent(cc.RichText);
        userOfflineLabble.string = userOfflineLabble.string + " " + nikeName + " 已离线！请选择等待或解散房间。\n";
    },

    hideOfflinePanel: function () {
        this.offlinePanel.active = false;
        var userOfflineLabble = this.offlineLable.getComponent(cc.RichText);
        userOfflineLabble.string = "";
        //userSelectLableNode

         var userSelectLable = this.userSelectLableNode.getComponent(cc.RichText);
         userSelectLable.string="";

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

    },
    stopTimer: function () {
        let self = this;
        self.unschedule(timerUpate);
        self.waitTimLableNode.active = false;
        self.continueWaitBtn.active = true;
        self.deleteRoomBtn.active = true;
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
    testDele: function () {
        this.deleteRoom("user 1 选择了解散房间");
    },

    deleteRoom: function (message) {
        let self = this;
        self.continueWaitBtn.active = false;
        self.deleteRoomBtn.active = false;
        var richText = self.userSelectLableNode.getComponent(cc.RichText);
        richText.string = richText.string + message + "\n";



    }

});
