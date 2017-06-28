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
        huPaiScriptFrame: cc.SpriteFrame,
        user1HuNode: cc.Node,
        user2HuNode: cc.Node,
        user3HuNode: cc.Node,
        user4HuNode: cc.Node,
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

    testHuLoginc: function () {
        var paiStr = "22,23,24,27,27,31,31,32,32,34,35,36,36,36";
        var paiList = paiStr.split(",");
        var huFlagDetails = this.startDecideHu(paiList);
        console.log("huFlagDetails:" + huFlagDetails);
        //12,14,14,16,18,18,18,35,35,35,37,39,39
        paiStr = "12,14,14,16,18,18,18,35,35,35,37,39,39";
        paiList = paiStr.split(",");
        huFlagDetails = this.startDecideHu(paiList);
        console.log("huFlagDetails1:" + huFlagDetails);
        for (var i = 0; i < 18; i++) {
            paiStr = "22,22,22,26,26,26,27,28,33,33,33,36,36,36";
            paiList = paiStr.split(",");
            huFlagDetails = this.startDecideHu(paiList);
            console.log("huFlagDetails2:" + i + "--" + huFlagDetails);
        }
    },

    huPaiAction: function (paiNumber, userOpenId, preStep) {
        console.log("huPaiAction starting :" + userOpenId);
        console.log("huPaiAction paiNumber :" + paiNumber);
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
        paiNode.name = "hupai" + latstIndex + "_" + paiNumber;
        //paiNode.active = false;
        var sprite = paiNode.getComponent(cc.Sprite);
        console.log("93:" + paiPath);
        // paiNode.active = true;
        cc.loader.loadRes(paiPath, cc.SpriteFrame, function (err, sp) {
            console.log("61:" + paiPath);
            if (err) {
                console.log("Error:" + err);
                return;
            }
            console.log("65:");
            sprite.spriteFrame = sp;
            paiNode.active = true;
        });
        paiNode = this.getCureentPostionFromUserPointAndPaiList(paiList, userPoint, paiNode);
        var userNodeName = "user" + userPoint + "PengPaiListNode";
        console.log("userNodeName:" + userNodeName);
        //var userNodePaiList = cc.find(userNodeName, this.tableNode);
        //userNodePaiList.addChild(paiNode);
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
        user.huPai = paiNumber;
        // if (preStep == "zigang") {
        //     user.huPaiType = "gangshanghua"
        // } else if (preStep == "gang") {
        //     user.huPaiType = "gangshangpao"
        // } else {
        //     user.huPaiType = ""
        // }

        // tableActionScript.insertMoPaiIntoPaiList(user);
        tableMoPaiActionScript.updateUserListInGobal(user);
        tableActionScript.disableAllSlefPai();

        //show HU pai on the current user 

        userPoint = userPoint + "";


        // var huPaiNode = cc.instantiate(this.moPaiPrefab);
        // var huSprite = huPaiNode.getComponent(cc.Sprite);
        // huSprite.spriteFrame = this.huPaiScriptFrame;
        if (userPoint == "1") {
            this.user1HuNode.active = true;
            this.user1HuNode.addChild(paiNode);
        } else if (userPoint == "2") {
            this.user2HuNode.active = true;
            this.user2HuNode.zIndex = 400;
            this.user2HuNode.addChild(paiNode);
        } else if (userPoint == "3") {
            this.user3HuNode.active = true;
            this.user3HuNode.addChild(paiNode);
        } else {
            this.user4HuNode.active = true;
            this.user4HuNode.zIndex = 400;
            this.user4HuNode.children[0].zIndex = 40;
            this.user4HuNode.addChild(paiNode);

        }

        //  userNodePaiList.addChild(huPaiNode);


    },
    hupaiLogicNoInsert: function (paiList) {
        var huFlagDetails = false;
        if (this.checkQiaoQiDui(paiList)) {
            return true;
        } else {
            huFlagDetails = this.startDecideHu(paiList);
            console.log("huFlagDetails:" + huFlagDetails);
            return huFlagDetails;

        }
    },
    //decide the painumber if hu or not hu .
    hupaiLogic: function (paiNumber, userOpenId, paiList, type) {
        jiangFlag = false;
        huFlag = false;
        sourcePaiCount = 0;
        var tempList = [];

        if (paiList.length == 1) {
            if(paiNumber+""==paiList[0]+""){
                huFlag=true;
            }
            if(paiNumber+""==paiList.toString()+""){
                huFlag=true;
            }

        } else {
            for (var i = 0; i < paiList.length; i++) {
                tempList.push(paiList[i]);
            }
            //var currentUser = tableActionScript.getCorrectUserByOpenId(userOpenId);
            var huFlagDetails = false;
            //var paiList = tableActionScript.insertPaiIntoPaiListByPaiAndOpenId(paiNumber, userOpenId)
            //if pai from other user ,it need insert into pai list 
            //if it from self it noe need insert the pai again.
            if (type != "mopai") {
                console.log("No is mopai insert the paiNumber");
                tempList = tableActionScript.insertPaiIntoPaiListByPaiAndPaiList(paiNumber, tempList);
            }
            if (this.checkQiaoQiDui(tempList)) {
                return true;
            } else {
                huFlagDetails = this.startDecideHu(tempList);
                console.log("huFlagDetails:" + huFlagDetails);
                return huFlagDetails;

            }
        }
    },

    analyze: function (paiList) {
        if (paiList.length == 0) {
            return true;
        };
        var ahuflag = false;
        for (var i = 0; i < paiList.length; i++) {

            var pai = paiList[i];
            //check pai is  san zhang 
            var count = this.countElementAccount(pai, paiList);
            console.log("pai:" + pai);
            console.log("paiList:" + paiList);
            if (count >= 3) {
                var oldPaiList = [];
                oldPaiList = this.deepCopyArray(paiList, oldPaiList);
                oldPaiList = tableActionScript.removeElementByNumberByPaiListFromUser(oldPaiList, pai, 3)
                //  console.log("oldPaiList:" + oldPaiList.toString())
                ahuflag = this.analyze(oldPaiList);
                return ahuflag
            }
            //check pai is san lian zhang 
            // console.log("count:" + count);
            var oldPaiList2 = [];
            oldPaiList2 = this.deepCopyArray(paiList, oldPaiList2);
            // console.log("oldPaiList2-0:" + oldPaiList2.toString());
            oldPaiList2 = this.checkLianSanZhan(pai, oldPaiList2);
            // console.log("oldPaiList2-1:" + oldPaiList2.toString());
            //  console.log("oldPaiList2-paiList:" + paiList.length);
            if (oldPaiList2.length != paiList.length) {
                //    console.log("oldPaiList2:" + oldPaiList2.toString())
                ahuflag = this.analyze(oldPaiList2);
                return ahuflag
            }



            //all not is ,return false 
            return false;

        }

    },
    startDecideHu: function (paiList) {
        console.log("106 paiList:" + paiList.toString());
        var caChepailist = [];
        for (var i = 0; i < paiList.length; i++) {
            var paiArrayCache = []
            var pai = paiList[i] + "";
            pai = pai.trim();
            var count = this.countElementAccount(pai, paiList);
            paiArrayCache.push(pai)
            paiArrayCache.push(count)
            // console.log("paiArrayCache:" + paiArrayCache.toString());

            caChepailist.push(paiArrayCache);
        }
        var noJiangpaiList = [];
        for (var i = 0; i < caChepailist.length; i++) {
            var arr = caChepailist[i];
            //console.log("arr:" + arr.toString());
            //  console.log("arr`:" + arr[1]);
            if (arr[1] >= 2) {
                var oldPaiList = [];
                oldPaiList = this.deepCopyArray(paiList, oldPaiList);
                oldPaiList = tableActionScript.removeElementByNumberByPaiListFromUser(oldPaiList, arr[0], 2)

                if (noJiangpaiList.indexOf(oldPaiList) < 0) {
                    //  console.log("oldPaiList:" + oldPaiList.toString());
                    noJiangpaiList.push(oldPaiList);
                }

            }
        }

        if (noJiangpaiList.length == 0) {
            return false
        } else {
            for (var i = 0; i < noJiangpaiList.length; i++) {
                var p = noJiangpaiList[i];
                // console.log("no jiang p:" + p.toString())
                var phuflag = this.analyze(p);
                //console.log("no jiang phuflag:" + phuflag)
                if (phuflag == true) {
                    return true;
                }
            }
        }



        // jiangFlag = false;

        return false

    },
    checkLianSanZhan: function (pai, paiList) {
        pai = parseInt(pai);
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
            console.log("prePai:" + prePai + "--" + "nextPai:" + nextPai);
            if (this.contains(paiList, prePai) && this.contains(paiList, nextPai)) {
                executeFlag = true;
            } else {
                prePai = pai - 1;
                nextPai = pai - 2;
                if (this.contains(paiList, prePai) && this.contains(paiList, nextPai)) {
                    executeFlag = true;

                } else {
                    executeFlag = false;
                }

            }

        }
        console.log("executeFlag:" + executeFlag);
        console.log("prePai2:" + prePai + "--" + "nextPai:" + nextPai);
        if (executeFlag == true) {
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, prePai, 1)
            console.log("paiList0:" + paiList.toString());
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, nextPai, 1)
            console.log("paiList1:" + paiList.toString());
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
        console.log("checkQiaoQiDui pailist:" + paiList.toString());
        var tempList = [];
        var flag = false;
        if (paiList.length >= 13) {
            tempList = this.deepCopyArray(paiList, tempList)
            for (var i = 0; i < tempList.length; i++) {
                var sourceLen = tempList.length;
                tempList = this.liangZhang(tempList[i], tempList);
                console.log("paiList:" + tempList);
                var oldLen = tempList.length;
                if (sourceLen != oldLen) {
                    i = 0
                }
            }

            if (tempList.length == 0) {
                flag = true
            } else {
                flag = false
            }
        }



        console.log("paiList:" + tempList.toString())
        return flag;


    },

    testQiaoQiDui: function () {

        var paiList = [15, 15, 18, 18, 22, 22, 25, 25, 25, 25, 29, 29, 38, 38];

        var f = this.checkQiaoQiDui(paiList);
        console.log("check qiaoqidui:" + f);


    },
    testHu: function () {
        var paiList = [15, 15, 16, 16, 17, 17, 18, 18, 18, 36, 36];
        sourcePaiCount = 0;
        huFlag = false;
        jiangFlag = false;

        console.log("testHU 1:" + this.startDecideHu(paiList));
        huFlag = false;
        jiangFlag = false;
        paiList = [15, 16, 17, 19, 19, 19, 23, 23, 35, 36, 37];
        console.log("testHU 2:" + this.startDecideHu(paiList));
        huFlag = false;
        jiangFlag = false;
        paiList = [11, 11, 17, 17, 17, 18, 19, 20, 35, 36, 37];
        console.log("testHU 3:" + this.startDecideHu(paiList));
        huFlag = false;
        jiangFlag = false;
        paiList = [15, 16, 17, 17, 17, 18, 19, 20, 21, 36, 36];
        console.log("testHU 4:" + this.startDecideHu(paiList));

    },
    //------------------------------------Untils----------------------------------------------------
    deepCopyArray: function (soureArray, descArray) {
        if (soureArray != null && soureArray.length > 0) {
            for (var i = 0; i < soureArray.length + 1; i++) {
                if (soureArray[i] != null && soureArray[i] != undefined)
                    //soureArray[i] = soureArray[i] + ""
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
    //currentUser
    getCurrentPostinbyCurrentUser: function (currentUser) {

    },
    getCureentPostionFromUserPointAndPaiList: function (paiArray, point, paiNode) {
        var startX = 0;
        var startY = 0;
        var latestX = 0;
        var latestY = 0;
        var startPoint = -520;
        var userNodeName = "user" + point + "PaiList";
        var userNodePaiList = cc.find(userNodeName, this.tableNode);
        var chilrenList = userNodePaiList.children;
        //getCorrectUserByOpenId

        if (point == "1") {
            paiNode.position = cc.p(0, -70);
        } else if (point == "2") {
            paiNode.position = cc.p(70, 0);
        } else if (point == "4") {
            //paiNode.position = cc.p(chilrenList[0].x, chilrenList[chilrenList.length-1].y );
            paiNode.position = cc.p(-70, 0);
            paiNode.setLocalZOrder(30);
            paiNode.zIndex = 30;
        } else if (point == "3") {
            paiNode.position = cc.p(0, 80);

            paiNode.width = 75;
            paiNode.height = 110;
        }
        console.log("paiNode position:" + paiNode.position)
        return paiNode;
    }
});
