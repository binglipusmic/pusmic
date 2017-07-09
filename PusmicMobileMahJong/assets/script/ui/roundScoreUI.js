var userInfoScript;
var gameConfigButtonScript;
var tableNetWorkScript;
var tableCenterScript;
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
        userRoundScoreNode: cc.Node,
        userAllRoundScireNode: cc.Node,
        userInfoNode: cc.Node,
        gameConfigButtonListNode: cc.Node,
        tableNetWorkNode: cc.Node,
        endLunFlag: "0",
        tableCenterNode: cc.Node,
        huanPaiNode: cc.Node,
        pullNode:cc.Node,

    },

    // use this for initialization
    onLoad: function () {
        userInfoScript = this.userInfoNode.getComponent("tableUserInfo");
        gameConfigButtonScript = this.gameConfigButtonListNode.getComponent("gameConfigButtonListAction");
        tableNetWorkScript = this.tableNetWorkNode.getComponent("GameTableNetWork");
        tableCenterScript = this.tableCenterNode.getComponent("tableCenterPoint");

    },

    initalRoundScore: function () {
        var userList = Global.userList;
        this.userRoundScoreNode.active = true;
        userInfoScript.cleanOtherLiPai();
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];

            userInfoScript.initalOtherPaiListTangPai(user, user.pointIndex + "", "");

            var nodeName = "user" + (i + 1) + "ScoreNode";
            var userNode = cc.find(nodeName, this.userRoundScoreNode);
            var bgNode = cc.find("bgSprite", userNode);
            var userNameNode = cc.find("userNameLabel", bgNode);
            var userNameNodeLable = userNameNode.getComponent(cc.Label);
            userNameNodeLable.string = user.nickName;
            var userDetailsNode = cc.find("user1DetailsRichText", bgNode);
            var detailsRichText = userDetailsNode.getComponent(cc.RichText);
            detailsRichText.string = user.huPaiDetails;
            var userCountNode = cc.find("totalCountAllNode", bgNode);
            var userCountAllLable = userCountNode.getComponent(cc.Label);
            userCountAllLable.string = user.roundScoreCount

            var serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
            console.log("headImageFileName round ui:" + user.headImageFileName);
            var headImageurl = serverUrl + "/webchatImage/" + user.headImageFileName;
            console.log(" round ui headImageurl:" + headImageurl);


            // var spritFrame=headNode.getComponent(cc.Sprite);

            this.initalUserImage(headImageurl, nodeName);



        }







    },

    initalUserImage: function (testImageUrl, nodeName) {
        cc.loader.load(testImageUrl, function (err, texture) {
            var frame = new cc.SpriteFrame(texture);
            var tableNode = cc.find("Canvas/tableNode");
            var userRoundScoreNode1 = cc.find("userRoundScorceNode", tableNode);
            var userNode = cc.find(nodeName, userRoundScoreNode1);
            var bgNode = cc.find("bgSprite", userNode);
            var headNode = cc.find("headNode", bgNode);
            headNode.getComponent(cc.Sprite).spriteFrame = frame;
            console.log("userNode ui :1214");
        });
    },
    pullAndPushPanel: function () {
        var action = null;
        var buttonLableNode = cc.find("Label", this.pullNode);
        var label=buttonLableNode.getComponent(cc.Label);
        if (this.userRoundScoreNode.y == 0) {
            action = cc.moveTo(1, cc.p(0, 680));
            label.string="下  推";

        } else {
            action = cc.moveTo(1, cc.p(0, 0));
             label.string="上  拉";
        }


         this.userRoundScoreNode.runAction(action);

    },
    initalUserImageAll: function (testImageUrl, nodeName) {
        cc.loader.load(testImageUrl, function (err, texture) {
            var frame = new cc.SpriteFrame(texture);
            var tableNode = cc.find("Canvas/tableNode");
            var userRoundScoreNode1 = cc.find("userScorceNode", tableNode);
            var userNode = cc.find(nodeName, userRoundScoreNode1);
            var bgNode = cc.find("bgSprite", userNode);
            var headNode = cc.find("headNode", bgNode);
            headNode.getComponent(cc.Sprite).spriteFrame = frame;
            console.log("userNode ui :1214");
        });
    },

    /*
    [{"openid":"oCG9Xwo2BF--ukJXk9uCTLqhz8f8","roundScoreCount":6,"roundDetails":"\u7b2c2\u5c40:6\n\u7b2c3\u5c40:0\n"},
    {"openid":"oCG9XwmeaOXLFlJGvu3FEJ4Leq6g","roundScoreCount":4,"roundDetails":"\u7b2c2\u5c40:4\n\u7b2c3\u5c40:0\n"},
    {"openid":"oCG9XwnO2XlKgsslrMjtf3rRTWmY","roundScoreCount":-10,"roundDetails":"\u7b2c2\u5c40:-10\n\u7b2c3\u5c40:0\n"}]
    */

    initalAllRoundScore: function (userObjList) {
        console.log("initalAllRoundScore 103");

        var userList = Global.userList;
        this.userAllRoundScireNode.active = true;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            var nodeName = "user" + (i + 1) + "ScoreNode";
            var userNode = cc.find(nodeName, this.userAllRoundScireNode);
            var bgNode = cc.find("bgSprite", userNode);
            var userNameNode = cc.find("userNameLabel", bgNode);
            var userIdNode = cc.find("userIDNode", bgNode);
            var userNameNodeLable = userNameNode.getComponent(cc.Label);
            userNameNodeLable.string = user.nickName;

            var serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
            console.log("headImageFileName round ui:" + user.headImageFileName);
            var headImageurl = serverUrl + "/webchatImage/" + user.headImageFileName;
            console.log(" round ui headImageurl:" + headImageurl);

            this.initalUserImageAll(headImageurl, nodeName);
            var roundScoreCount = 0;
            var roundDetails = "";

            for (var j = 0; j < userObjList.length; j++) {
                var userObj = userObjList[j];
                if (userObj.openid == user.openid) {
                    roundScoreCount = userObj.roundScoreCount;
                    roundDetails = userObj.roundDetails;
                }
            }

            var userIdTextLable = userIdNode.getComponent(cc.Label);
            userIdTextLable.string = user.userCode;
            var userDetailsNode = cc.find("huPaiDetailsNode", bgNode);
            var detailsRichText = userDetailsNode.getComponent(cc.Label);
            detailsRichText.string = roundDetails;
            var userCountNode = cc.find("totalCountNode", bgNode);
            var userCountAllLable = userCountNode.getComponent(cc.Label);
            userCountAllLable.string = "总成绩：" + roundScoreCount
        }
    },

    closeAllRoundScore: function () {
        var userList = Global.userList;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            var nodeName = "user" + (i + 1) + "ScoreNode";
            var userNode = cc.find(nodeName, this.userAllRoundScireNode);
            var bgNode = cc.find("bgSprite", userNode);
            var userDetailsNode = cc.find("huPaiDetailsNode", bgNode);
            var detailsRichText = userDetailsNode.getComponent(cc.Label);
            detailsRichText.string = "";
            var userCountNode = cc.find("totalCountNode", bgNode);
            var userCountAllLable = userCountNode.getComponent(cc.Label);
            userCountAllLable.string = "总成绩: 0";
            user.zhuang = "";
            user.roundTotalScore=0;
        }

        this.userAllRoundScireNode.active = false;
        this.huanPaiNode.active = false;


        userInfoScript.cleanUserList();
        userInfoScript.cleanTable();
        userInfoScript.initalUserOnRound();

        //gameConfigButtonScript.endGameRoundLun();
        tableNetWorkScript.forceInitaClient();
        gameConfigButtonScript.enterMainEntry("1");
        Global.zhuangOpenId = null;
        Global.gameRoundCount = 1;
        Global.userList = [];
    },
    closeRoundScore: function () {
        //tableNetWorkScript.sendGetGameRoundlunScoreCount();
        this.userRoundScoreNode.active = false;
        //go to a new game ground
        //1.clean the data layer
        userInfoScript.cleanUserList();
        userInfoScript.cleanTable();
        this.huanPaiNode.active = false;
        //
        var gameMode = Global.gameMode;
        console.log("178 gameMode.huanSanZhang:" + gameMode.huanSanZhang);
        //2.GUI
        //gameConfigButtonScript.showGameTalbe("");
        if (this.endLunFlag == "0") {
            userInfoScript.initalUserOnRound();

            //3 send 

            //tableNetWorkScript.sendStartNewRound();

            //tableCenterScript.endTimer();
        } else {
            userInfoScript.initalUserOnRound();
            tableNetWorkScript.sendGetGameRoundlunScoreCount();
        }


    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
