var tableActionScript;
var tableUserInfoScript;
var tableMoPaiActionScript;
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

        tableNode: cc.Node,
        tableAction: cc.Node,
        moPaiPrefab: cc.Prefab,
        user3PaiListNode: cc.Node,
        tableUserInfo: cc.Node,
        tableMoPaiNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        tableActionScript = this.tableAction.getComponent("tablePaiAction");
        tableUserInfoScript = this.tableUserInfo.getComponent("tableUserInfo");
        tableMoPaiActionScript = this.tableMoPaiNode.getComponent("tableMoPaiAction");

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    testHuPai: function () {
        this.huPaiAction("19", "testUser2");
        this.huPaiAction("19", "testUser0");
        this.huPaiAction("19", "testUser1");
        this.huPaiAction("19", "testUser3");

    },

    huPaiAction: function (paiNumber, userOpenId) {
        var currentUser = tableActionScript.getCorrectUserByOpenId(userOpenId);
        var paiList = currentUser.paiListArray;
        var latstIndex = 0;
        if (paiList.length == 13) {
            latstIndex = 13
        } else {
            latstIndex = paiList.length;
        }
        var userPoint = currentUser.pointIndex;
        var paiPath = tableActionScript.getChuPaiNameByNodeName(paiNumber, userPoint);

        var paiNode = cc.instantiate(this.moPaiPrefab);
        var sprite = paiNode.getComponent(cc.Sprite);
        paiNode.name = "pai" + latstIndex + "_" + paiNumber;
        //paiNode.active = false;
        var sprite = paiNode.getComponent(cc.Sprite);
        cc.loader.loadRes(paiPath, function (err, sp) {
            cc.log("61:" + paiPath);
            if (err) {
                cc.log("Error:" + err);
                return;
            }
            cc.log("65:");
            sprite.spriteFrame = new cc.SpriteFrame(sp);
            paiNode.active = true;
        });
        paiNode = this.getCureentPostionFromUserPointAndPaiList(paiList, userPoint, paiNode);
        var userNodeName = "user" + userPoint + "PengPaiListNode";
        cc.log("userNodeName:" + userNodeName);
        var userNodePaiList = cc.find(userNodeName, this.tableNode);
        userNodePaiList.addChild(paiNode);
        //---data layer-----------------
        var userList = Global.userList;
        var user
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userOpenId) {
                user = userList[i];
                break;
            }
        }
        user.userMoPai = paiNumber;
        tableActionScript.insertMoPaiIntoPaiList(user);
        tableMoPaiActionScript.updateUserListInGobal(user);
        tableActionScript.disableAllSlefPai();

    },

    getCureentPostionFromUserPointAndPaiList: function (paiArray, point, paiNode) {
        var startX = 0;
        var startY = 0;
        var latestX = 0;
        var latestY = 0;
        var startPoint = -520;
        for (var i = 0; i < paiArray.length + 1; i++) {
            if (paiArray[i] != null && paiArray[i] != undefined) {
                //fix the user 1
                if (point == "1") {
                    startX = 380;
                    // latestX=startX - i * 55;
                    // latestY=0
                    paiNode.position = cc.p(startX - i * 55, 0);
                    //this.user1PaiListNode.addChild(paiNode);
                }

                if (point == "2") {
                    startX = 0;
                    startY = -400;
                    paiNode.position = cc.p(startX, startY + i * 28);
                    paiNode.zIndex = (paiArray.length - i);
                    paiNode.width = 40;
                    paiNode.height = 85;
                    //paiNode.setLocalZOrder(1000);
                    //paiNode.zIndex = 1000;
                    //parentNode

                }
                if (point == "3") {
                    if (i == 13) {
                        paiNode.position = cc.p(startPoint + i * 80, 0);
                    } else {
                        paiNode.position = cc.p(startPoint + i * 79, 0);
                    }


                }

                if (point == "4") {
                    startX = 0;
                    startY = -200;
                    paiNode.position = cc.p(startX, startY + i * 28);

                    paiNode.width = 40;
                    paiNode.height = 85;
                }
            }
        }
        if (point == "1") {
            paiNode.position = cc.p(paiNode.position.x + 85, paiNode.position.y);
        } else if (point == "2") {
            paiNode.position = cc.p(paiNode.position.x, paiNode.position.y - 25);
        } else if (point == "4") {
            paiNode.position = cc.p(paiNode.position.x, paiNode.position.y - 85);
            paiNode.setLocalZOrder(1000);
            paiNode.zIndex = 1000;
        } else if (point == "3") {
            paiNode.position = cc.p(paiNode.position.x - 90, paiNode.position.y + 10);

            paiNode.width = 75;
            paiNode.height = 110;
        }
        cc.log("paiNode position:" + paiNode.position)
        return paiNode;
    }
});
