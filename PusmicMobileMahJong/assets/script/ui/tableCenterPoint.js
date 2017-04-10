var timerUpate;
var timeCount;
var pointUpdate;
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
        user1Point: cc.Node,
        user2Point: cc.Node,
        user3Point: cc.Node,
        user4Point: cc.Node,
        user1Quepai: cc.Node,
        user2Quepai: cc.Node,
        user3Quepai: cc.Node,
        user4Quepai: cc.Node,
        index: String,
        tenPoint: cc.Node,
        numPoint: cc.Node,
        numberSprite: [cc.SpriteFrame],
        centerPointNode: cc.Node,
        paiType: [cc.SpriteFrame],
        quePaiNode: cc.Node,
    },

    // use self for initialization
    onLoad: function () {

        let self = this;
        self.hideAllPoint();
        timeCount = 30;
        this.initalCenterNum();
        this.hideAllQuePai();
        timerUpate = function () {


            // cc.log("timeCount:" + timeCount + "----" + timeCount.length);

            this.initalCenterNum();
            timeCount--;

            if (timeCount == -1) {
                self.endTimer();
            }

        };

        pointUpdate = function () {
            var point;
            if (self.index == "1") {
                point = self.user1Point;
            }
            if (self.index == "2") {
                point = self.user2Point;
            }
            if (self.index == "3") {
                point = self.user3Point;
            }
            if (self.index == "4") {
                point = self.user4Point;
            }

            if (point.active == false) {
                point.active = true;
            } else {
                point.active = false;
            }

        };

        self.index = "1";
        //self.stratTimer();

    },
    initalCenterNum: function () {
        let self = this;
        var ten = -1;
        var num = -1;
        if ((timeCount + "").length < 2) {
            ten = "0"
            num = timeCount + "";
        } else {
            ten = (timeCount + "").substring(0, 1);
            num = (timeCount + "").substring(1);
        }

        if (ten != -1) {
            ten = parseInt(ten)
        }
        if (num != -1) {
            num = parseInt(num)
        }

        var tenScript = self.tenPoint.getComponent(cc.Sprite);
        var numScript = self.numPoint.getComponent(cc.Sprite);

        tenScript.spriteFrame = self.numberSprite[ten];
        numScript.spriteFrame = self.numberSprite[num];
    },
    setNumerToZero: function () {
        let self = this;
        var tenScript = self.tenPoint.getComponent(cc.Sprite);
        var numScript = self.numPoint.getComponent(cc.Sprite);

        tenScript.spriteFrame = self.numberSprite[0];
        numScript.spriteFrame = self.numberSprite[0];

    },

    hideAllQuePai: function () {
        this.user1Quepai.active = false;
        this.user2Quepai.active = false;
        this.user3Quepai.active = false;
        this.user4Quepai.active = false;
    },

    hideAllPoint: function () {
        let self = this;
        self.user1Point.active = false;
        self.user2Point.active = false;
        self.user3Point.active = false;
        self.user4Point.active = false;
    },

    stratTimer: function () {
        //timeCount = 10;
        let self = this;
        self.schedule(timerUpate, 1);
        self.schedule(pointUpdate, 0.5);
    },
    endTimer: function () {
        let self = this;
        self.unschedule(timerUpate);
        self.unschedule(pointUpdate);
        self.hideAllPoint();
    },

    showCenterPoint: function () {
        let self = this;
        self.hideAllQuePai();
        self.hideAllPoint();
        timeCount = 30;
        this.initalCenterNum();
        this.centerPointNode.active = true;
        //this.centerPointNode.zIndex = 0;
        this.stratTimer();
        this.showQuePai();
        //intail user step for chupai

        Global.chuPaiActionType = "";
    },
    showQuePai: function () {
        var userList2 = Global.userList;
        this.quePaiNode.active = true;

        for (var i = 0; i < userList2.length; i++) {

            var quepai = (userList2[i].quePai);
            // cc.log("quepai0:" + userList2[i].quePai + "---" + userList2[i].openid);
            if (quepai != null && quepai != undefined) {
                quepai = parseInt(userList2[i].quePai);
                //  cc.log("quepai1:" + quepai.toString());
                var queScript = this.paiType[quepai - 1];
                var index = userList2[i].pointIndex;
                this.setQuePaiSpritFame(index, queScript);

            }
        }

    },
    setQuePaiSpritFame: function (index, scpritFame) {
        // cc.log("setQuePaiSpritFame index:" + index);
        index = index + "";
        var sprit;
        if (index == "1") {
            sprit = this.user1Quepai.getComponent(cc.Sprite);
            this.user1Quepai.active = true;
            //  cc.log(" this.user1Quepai.active :" + this.user1Quepai.active);
        }
        if (index == "2") {
            sprit = this.user2Quepai.getComponent(cc.Sprite);
            this.user2Quepai.active = true;
            //cc.log(" this.user2Quepai.active :" + this.user2Quepai.active);

        }
        if (index == "3") {
            sprit = this.user3Quepai.getComponent(cc.Sprite);
            this.user3Quepai.active = true;
            //  cc.log(" this.user3Quepai.active :" + this.user3Quepai.active);

        }
        if (index == "4") {
            sprit = this.user4Quepai.getComponent(cc.Sprite);
            this.user4Quepai.active = true;
            //  cc.log(" this.user4Quepai.active :" + this.user4Quepai.active);

        }
        sprit.spriteFrame = scpritFame;

    },

    // called every frame, uncomment self function to activate update callback
    // update: function (dt) {

    // },
});
