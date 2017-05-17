var alerMessage;
var gameTableNetWork;
var timerUpate;
var timeCount;
var tableUserInfoScript;
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
        quePaiTimeLable: cc.Node,
        tableUserInfoNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.waitOtherUserNode.active = false;
        //tableUserInfoScript = this.tableUserInfoNode.getComponent("tableUserInfo");
        //this.thisSelectNode.active = true;
        // this.quePaiNode.active =false;
        //alerMessage = this.alertMessageNode.getComponent("alertMessagePanle");
        gameTableNetWork = this.gameTableNetWorkNode.getComponent("GameTableNetWork")
        timeCount = 14;
        timerUpate = function () {

            var showTimerStr = "(" + timeCount + ")";
            var lable = this.quePaiTimeLable.getComponent(cc.Label);
            lable.string = showTimerStr;
            timeCount--;

            if (timeCount == -1) {
                this.endTimer();
            }

        };
    },


    endTimer: function () {
        Global.chuPaiActionType = ""
        let self = this;
        self.unschedule(timerUpate);
        // Global.chuPaiActionType = ""
        //auto select latest pai
        //tableUserInfo.forceFillHuanSanZhangList();
        //this.sendHuanSanZhang();

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

         var quePaiCount=this.setUePaiInUser(que);
        //show other wait other user select pai  
        this.quePaiNode.active = false;
        this.waitOtherUserNode.active = true;
        //set action typeof
        Global.chuPaiActionType = "normalChuPai";
        //send to server
        var userList = Global.userList;
        var userInfo = Global.userInfo;
        gameTableNetWork.sendQuePai(quePaiCount, userList.length);
        

    },
    setUePaiInUser: function (quePai) {
        var userList = Global.userList;
        var userInfo = Global.userInfo;
        var quePaiCount = 0;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userInfo.openid) {
                userList[i].quePai = quePai;
                userInfo.quePai = quePai;
                cc.log("setUePaiInUser :"+quePai);
                 cc.log("setUePaiInUser openid:"+userInfo.openid);
            }


            if (userList[i].quePai != null && userList[i].quePai != undefined&& userList[i].quePai != "") {
                quePaiCount++
            }
        }
        Global.userInfo = userInfo;
        Global.userList=userList;
        return quePaiCount
    },

    showQuePaiNode: function () {
        this.quePaiNode.active = true;
    },
    closeWaitPanel: function () {
        this.waitOtherUserNode.active = false;
    },

    sendQuePai: function () {

        var userList = Global.userList;
        var userInfo = Global.userInfo;
        var quePaiCount = 0;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].quePai != null && userList[i].quePai != undefined) {
                quePaiCount++
            }
        }
        if (quePaiCount < userList.length) {
            //show wait panl 
            this.waitPanleNode.active = true;

        } else {
            //Global.chuPaiActionType = ""
        }
    },


    stratTimer: function () {
        //timeCount = 10;
        let self = this;
        self.schedule(timerUpate, 1);
        //

    },


    showQuePaiNodeAll: function () {
        this.showQuePaiNode();
        this.stratTimer();
        // var typeCount = tableUserInfoScript.getTypeCount();
        // if (typeCount[0] + '' == "3") {
        //     this.showQuePaiNode();
        //     this.stratTimer();
        // } else if (typeCount[0] + '' == "1") {
        //     this.showQuePaiNode();
        //     this.stratTimer();


        // } else {
        //     this.waitOtherUserNode.active = true;
        //     //default que 
        //     var typeAll = "123"
        //     for (var i = 0; i < typeCount[1].length; i++) {
        //         typeAll = typeAll.replace(typeCount[1][i], "")
        //     }
        //     this.setUePaiInUser(typeAll);
        // }

    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
