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
        tongNode: cc.Node,
        tiaoNode: cc.Node,
        wanNode: cc.Node,
        thisSelectNode: cc.Node,
        waitOtherUserNode: cc.Node,
        quePaiNode: cc.Node,
        alertMessageNode: cc.Node,
        gameTableNetWorkNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.waitOtherUserNode.active = false;
        this.thisSelectNode.active = true;
        // this.quePaiNode.active =false;
        alerMessage = this.alertMessageNode.getComponent("alertMessagePanle");
        gameTableNetWork = this.gameTableNetWorkNode.getComponent("GameTableNetWork")

    },

    quePaiClick: function (event) {
        var node = event.target;
        var name = node.name;
        var que = "";
        if (name == "tong") {
            que = "1";
        }
        if (name == "tiao") {
            que = "2";
        }
        if (name == "wan") {
            que = "3";
        }

        var userList = Global.userList;
        var userInfo = Global.userInfo;

        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userInfo.openid) {
                userList[i].quePai = que;
                userInfo.quePai = que;
            }
        }
        Global.userInfo=userInfo
        //show other wait other user select pai  
        this.thisSelectNode.active = false;
        this.waitOtherUserNode.active = true;
        //set action typeof
        Global.chuPaiActionType = "normalChuPai";


    },

    showQuePaiNode: function () {
        this.quePaiNode.active = true;
    },

    sendQuePai: function () {
        if (Global.huanSanZhangPaiList.length < 3) {
            alerMessage.text = "你必须选择三张牌！";
            alerMessage.setTextOfPanel();
            alerMessage.alertPanelNode.active = true;

        } else {
            //Global.chuPaiActionType = ""
            this.waitPanleNode.active = true;
            gameTableNetWork.sendHuanSanZhang();
            tableUserInfo.disableAllPai();
            this.unschedule(timerUpate);
        }




    },





    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
