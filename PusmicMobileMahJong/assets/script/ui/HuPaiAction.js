var tableActionScript;
var tableUserInfoScript;
var tableMoPaiActionScript;
var sourcePaiList;
var sourcePaiCount;
var huFlag = false;
var jiangFlag = false;
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
    //decide the painumber if hu or not hu .
    hupaiLogic: function (paiNumber, userOpenId) {
        //var currentUser = tableActionScript.getCorrectUserByOpenId(userOpenId);
        var huFlagDetails = false;
        var paiList = tableActionScript.insertPaiIntoPaiListByPaiAndOpenId(paiNumber, userOpenId)
        if (this.checkQiaoQiDui(paiList)) {
            return true;
        } else {

            for (var i = 0; i < paiList.length; i++) {
                paiList.splice(i, 1);
                i = 0;
                cc.log("hupaiLogic paiList:" + paiList);
                huFlagDetails = this.startDecideHu(paiList);

            }

        }
    },
    startDecideHu: function (paiList) {
        cc.log("106 paiList:" + paiList.toString());
        if (sourcePaiCount == 0) {
            sourcePaiList = []
            sourcePaiList = this.deepCopyArray(paiList, sourcePaiList);
        }


        sourcePaiCount++;
        for (var i = 0; i < paiList.length; i++) {
            var pai = paiList[i];
            var count = this.countElementAccount(pai, paiList);
            var oldLen = paiList.length;
            var oldPaiList = [];
            oldPaiList = this.deepCopyArray(paiList, oldPaiList);


            paiList = this.checkLianSanZhan(pai, paiList);
            var newLen = paiList.length;
            cc.log("116:" + paiList.toString());
            if (oldLen != newLen) {
                huFlag = this.startDecideHu(paiList);
            }


            if (count >= 2) {
                var oldPaiList2 = [];
                oldPaiList2 = this.deepCopyArray(oldPaiList, oldPaiList2);
                oldLen = oldPaiList.length;
                oldPaiList = this.liangZhang(pai, oldPaiList);
                newLen = oldPaiList.length;
                if (oldLen != newLen) {
                    jiangFlag = true;
                    huFlag = this.startDecideHu(oldPaiList);
                }
            }

            if (count >= 3) {
                oldLen = oldPaiList.length;
                oldPaiList = this.checkSanZhang(pai, oldPaiList);
                newLen = oldPaiList.length;
                if (oldLen != newLen) {

                    huFlag = this.startDecideHu(oldPaiList);
                }
            }


        }
        cc.log("paiList:" + paiList.toString());

        //cc.log("oldPaiList:" + oldPaiList.toString());

        if ((paiList.length == 2 && (paiList[0] == paiList[1]))) {
            huFlag = true
        } else if (jiangFlag == true && paiList.length == 0) {
            huFlag = true
            // var list = [];
            // list = this.deepCopyArray(sourcePaiList, list);
            // list.splice(0, 1);
            // sourcePaiCount = 0;
            // huFlag = this.startDecideHu(list);
        }

        return huFlag

    },
    checkLianSanZhan: function (pai, paiList) {

        var paiNumber = pai[1];
        var prePai = -1;
        var nextPai = -1;
        var executeFlag = false;
        if (paiNumber + "" == "1") {
            prePai = pai + 1;
            nextPai = pai + 2;
        } else if (paiNumber + "" == "9") {
            prePai = pai - 1;
            nextPai = pai - 2;
        } else {
            prePai = pai - 1;
            nextPai = pai + 1;
        }
        if (this.contains(paiList, prePai) && this.contains(paiList, nextPai)) {
            executeFlag = true;

        } else {
            prePai = pai + 1;
            nextPai = pai + 2;
            cc.log("prePai:" + prePai + "--" + "nextPai:" + nextPai);
            if (this.contains(paiList, prePai) && this.contains(paiList, nextPai)) {
                executeFlag = true;

            } else {
                prePai = pai - 1;
                nextPai = pai - 2;
                if (this.contains(paiList, prePai) && this.contains(paiList, nextPai)) {
                    executeFlag = true;

                } else {
                    executeFlag = false;;
                }

            }

        }

        if (executeFlag) {
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, prePai, 1)
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, nextPai, 1)
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, pai, 1)
        }

        return paiList
    },
    removeLianSanZhang: function (pai, paiList) {






    },
    liangZhang: function (pai, paiList) {
        var count = this.countElementAccount(pai, paiList);
        if (count == 2 || count == 4) {
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, pai, 2)
        }
        return paiList
    },
    checkSanZhang: function (pai, paiList) {
        var count = this.countElementAccount(pai, paiList);
        if (count >= 3) {
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, pai, 3)
        }

        return paiList

    },
    checkQiaoQiDui: function (paiList) {

        for (var i = 0; i < paiList.length; i++) {
            var sourceLen = paiList.length;
            paiList = this.liangZhang(paiList[i], paiList);
            cc.log("paiList:" + paiList);
            var oldLen = paiList.length;
            if (sourceLen != oldLen) {
                i = 0
            }
        }

        cc.log("paiList:" + paiList.toString())

        if (paiList.length == 0) {
            return true
        } else {
            return false
        }
    },

    testQiaoQiDui: function () {

        var paiList = [15, 15, 18, 18, 22, 22, 25, 25, 25, 25, 29, 29, 38, 38];

        var f = this.checkQiaoQiDui(paiList);
        cc.log("check qiaoqidui:" + f);


    },
    testHu: function () {
        var paiList = [15, 15, 16, 16, 17, 17, 18, 18, 18, 36, 36];
        sourcePaiCount = 0;
        huFlag = false;
        jiangFlag = false;

        cc.log("testHU 1:" + this.startDecideHu(paiList));
          huFlag = false;
        jiangFlag = false;
        paiList = [15, 16, 17, 19, 19, 19, 23, 23, 35, 36, 37];
        cc.log("testHU 2:" + this.startDecideHu(paiList));
          huFlag = false;
        jiangFlag = false;
        paiList = [11, 11, 17, 17, 17, 18, 19, 20, 35, 36, 37];
        cc.log("testHU 3:" + this.startDecideHu(paiList));
          huFlag = false;
        jiangFlag = false;
        paiList = [15, 16, 17, 17, 17, 18, 19, 20, 21, 36, 36];
        cc.log("testHU 4:" + this.startDecideHu(paiList));

    },
    //------------------------------------Untils----------------------------------------------------
    deepCopyArray: function (soureArray, descArray) {
        if (soureArray != null && soureArray.length > 0) {
            for (var i = 0; i < soureArray.length + 1; i++) {
                if (soureArray[i] != null && soureArray[i] != undefined)
                    descArray.push(soureArray[i]);
            }
        }

        return descArray;

    },

    countElementAccount: function (pai, paiList) {
        var count = 0;
        for (var i = 0; i < paiList.length + 1; i++) {
            if (paiList[i] == pai) {
                count++
            }
        }

        return count

    },
    contains: function (array, obj) {
        var i = array.length;
        while (i--) {
            if (array[i] + "" === obj + "") {
                return true;
            }
        }
        return false;
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
