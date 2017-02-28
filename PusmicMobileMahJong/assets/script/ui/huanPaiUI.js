var timerUpate;
var timeCount;
var tableUserInfo;
var alerMessage;
var gameTableNetWork;
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
        huanPaiNode: cc.Node,
        huanPaiTimeLable: cc.Node,
        tableUserInfoNode: cc.Node,
        alertMessageNode: cc.Node,
        gameTableNetWorkNode: cc.Node,
        waitPanleNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

        tableUserInfo = this.tableUserInfoNode.getComponent("tableUserInfo");
        alerMessage = this.alertMessageNode.getComponent("alertMessagePanle");
        gameTableNetWork = this.gameTableNetWorkNode.getComponent("GameTableNetWork")

        timeCount = 14;
        timerUpate = function () {

            var showTimerStr = "(" + timeCount + ")";
            var lable = this.huanPaiTimeLable.getComponent(cc.Label);
            lable.string = showTimerStr;
            timeCount--;

            if (timeCount == -1) {
                this.endTimer();
            }

        };

    },

    showHuanPaiNode: function () {
        this.huanPaiNode.active = true;
        this.stratTimer();
        tableUserInfo.disabledHuanSanZhangPai();
        Global.chuPaiActionType = "huanSanZhang"
    },

    stratTimer: function () {
        //timeCount = 10;
        let self = this;
        self.schedule(timerUpate, 1);
        //

    },
    endTimer: function () {
        let self = this;
        self.unschedule(timerUpate);
        // Global.chuPaiActionType = ""
        //auto select latest pai
        if (Global.huanSanZhangPaiList.length < 3) {
            //tableUserInfo.forceFillHuanSanZhangList()
        }
        //

    },

    sendHuanSanZhang: function () {
        if (Global.huanSanZhangPaiList.length < 3) {
            alerMessage.text = "你必须选择三张牌！";
            alerMessage.setTextOfPanel();
            alerMessage.alertPanelNode.active = true;

        } else {
            //Global.chuPaiActionType = ""
            this.waitPanleNode.active = true;
            gameTableNetWork.sendHuanSanZhang();
            tableUserInfo.disableAllPai();
        }




    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
