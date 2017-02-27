var timerUpate;
var timeCount;
var tableUserInfo;
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
        tableUserInfoNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

      tableUserInfo=this.tableUserInfoNode.getComponent("tableUserInfo");

        timeCount = 14;
        timerUpate = function () {

            var showTimerStr = "(" + timeCount + ")";
            var lable=this.huanPaiTimeLable.getComponent(cc.Label);
            lable.string=showTimerStr;
            timeCount--;

            if (timeCount == -1) {
                self.endTimer();
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
        Global.chuPaiActionType = ""

    },
    endTimer: function () {
        let self = this;
        self.unschedule(timerUpate);
        //auto select latest pai
        tableUserInfo.getMinLenPaiListFromPai()
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
