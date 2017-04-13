var huanPaiScript;
var tablePaiActionScript;
var iniMainScript;
var tableNetworkScript;
var iniIndexScript;
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

        userInfo1: cc.Node,
        userInfo2: cc.Node,
        userInfo3: cc.Node,
        userInfo4: cc.Node,
        tableActionNode: cc.Node,
        tableNode: cc.Node,
        userReadyIconOk: cc.SpriteFrame,
        userReadyIconNotOk: cc.SpriteFrame,
        tableGameMode: cc.Node,
        tableHead: cc.Node,

        user1ReadNode: cc.Node,
        user2ReadNode: cc.Node,
        user3ReadNode: cc.Node,
        user4ReadNode: cc.Node,
        tableTitleNode: cc.Node,

        user1PaiListNode: cc.Node,
        user2PaiListNode: cc.Node,
        user4PaiListNode: cc.Node,
        user3PaiListNode: cc.Node,
        liPaiPrefab: cc.Prefab,
        backNode: cc.Prefab,

        liPaiZiMian: [cc.SpriteFrame],
        cePai: cc.SpriteFrame,
        cePaiLeft: cc.SpriteFrame,
        backPai: cc.SpriteFrame,

        quepaiNode: cc.Node,
        tableCenterPoint: cc.Node,
        huanPaiScriptNode: cc.Node,
        tablePaiActionNode: cc.Node,
        user1HuNode: cc.Node,
        user2HuNode: cc.Node,
        user3HuNode: cc.Node,
        user4HuNode: cc.Node,

        userScoreNode: cc.Node,
        userRoundScoreNode: cc.Node,
        iniMainNode: cc.Node,
        tableNetworkNode: cc.Node,
        indexNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        // this.userInfo1.active = false;
        // this.userInfo2.active = false;
        // this.userInfo3.active = false;
        // this.userInfo4.active = false;

        // this.initalUserPai("inital", "");
        this.userScoreNode.zIndex = 500;
        this.userRoundScoreNode.zIndex = 500;
        // this.disabledHuanSanZhangPai();
        huanPaiScript = this.huanPaiScriptNode.getComponent("huanPaiUI");
        tableNetworkScript = this.tableNetworkNode.getComponent("GameTableNetWork");
        iniIndexScript = this.indexNode.getComponent("iniIndex");
        //tablePaiActionScript =this.tablePaiActionNode.getComponent("tablePaiAction");

    },
    //this function only inital a gaobal user list for test 
    /**
     * chuPaiCount
     * user 1 chupai list point :x -210,y -45 
     * user 2 chupai list point :x -210,y -45
     * 
     */
    testInitalUserList: function (initalType) {
        var paiList = ["11, 11, 13, 14, 14, 15, 16, 16, 17, 18, 19, 19, 19",
            "15, 15, 17, 18, 19, 22, 23, 24, 25, 26, 29, 29, 29",
            "15, 16, 17, 18, 19, 22, 23, 24, 26, 26, 26, 29, 29",
            "11, 12, 13, 24, 24, 24, 35, 35, 35, 36, 36, 36, 38",
        ];
        this.tableNode.active = true;
        var userList = [];
        var userInfo = require("userInfoDomain").userInfoDomain;

        // iniMainScript=this.iniMainNode.getComponent("");
        for (var i = 1; i < 5; i++) {
            var o = new Object();
            o.id = i;
            o.nickName = "testUser" + i;
            o.headImageFileName = "testUser" + i + ".jpg";
            o.diamondsNumber = "30";
            o.country = "CN";
            o.openid = "testUser" + i;
            o.unionid = "testUser" + i;
            o.userCode = "testUser" + i;
            if (i != 1) {
                o.quePai = "3";
            }

            o.publicIp = "127.0.0.1";
            o.paiList = paiList[i - 1];
            o.gameReadyStatu = "1";
            o.gameScoreCount = "1";
            if (initalType == "test3") {
                o.pointIndex = i;
                o.userMoPai = "37";
                userInfo.openid = "testUser" + 3;
                userInfo.nickName = "testUser" + 3;
            } else if (initalType == "test2") {
                userInfo.openid = "testUser" + 2;
                userInfo.nickName = "testUser" + 2;
                if (i < 4) {
                    o.pointIndex = i + 1;
                } else {
                    o.pointIndex = 1
                }
            } else if (initalType == "test1") {
                userInfo.nickName = "testUser" + 1;
                userInfo.openid = "testUser" + 1;
                if (i < 3) {
                    o.pointIndex = i + 2;
                } else if (i == 3) {
                    o.pointIndex = 1;
                } else if (i == 4) {
                    o.pointIndex = 2;
                }
            } else if (initalType == "test4") {
                userInfo.nickName = "testUser" + 4;
                userInfo.openid = "testUser" + 4;
                if (i == 1) {
                    o.pointIndex = 4;
                } else {
                    o.pointIndex = i - 1
                }
            }
            //o.pointIndex = i;


            o.headImageFileName = "1";

            if (i == 0) {
                o.zhuang = "1";
            } else {
                o.zhuang = "0";
                if (i == 2) {
                    o.userMoPai = "22";
                }
            }

            userList.push(o);

        }
        var gameMode = require("gameMode").gameMode;

        gameMode.huanSanZhang = "1";
        Global.gameMode = gameMode;
        Global.userList = userList;
        Global.userInfo = userInfo;
        Global.chuPaiActionType = "normalChuPai";
        cc.log(" Global.userInfo:" + userInfo.toString());
        cc.log(" Global.userList:" + Global.userList.length);
        Global.joinRoomNumber = "585930";
        var roomNumber = Global.joinRoomNumber;
        cc.log("roomNumber:" + roomNumber);
        tableNetworkScript.connectByPrivateChanel();
        //tableNetworkScript.testJoinRoom(roomNumber);


    },
    cleanUserList: function () {
        var userList = Global.userList;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            user.gameReadyStatu = "";
            user.gameRoundScore = "";
            user.gameScoreCount = "";
            user.paiList = "";
            user.paiListArray = [];
            user.huanSanZhangPaiList = [];
            user.pengPaiList = [];
            user.gangExistUser = [];
            user.gangExistUserCache = [];
            user.gangFromUserListOpenId = [];
            user.gangPaiList = [];
            user.gangTypeList = [];
            user.pengGangPaiPoint = 0;
            user.quePai = "";
            user.chuPaiPointX = 0;
            user.chupaiListY = 0;
            user.chuPaiCount = 0;
            user.chuPaiPointX = 0;
            user.userMoPai = "";
            user.huPai = "";
            user.huPaiType = "";
            user.huPaiDetails = "";
            user.roundScoreCount = "";
            user.existUserString = "";
            user.huGangPai = "";
            user.huPaiFromUser = "";
            user.huChuPaiType = "";
            user.huPaiFanShu = 0;
            user.huGangShangHuaChuPaiUserOpenId = "";
            user.huGangPaiInOtherUserFromOpenId = "";
            user.tingJiao = "";
            user.maxFanShu = 0;
        }

        Global.userList = userList;

        //Add the round count

        //Global.gameRoundCount = Global.gameRoundCount + 1;
    },
    /**
     * Clean the table all node 
     */
    cleanTable: function () {
        //tablePaiActionScript.removeAllNodeFromSelfPaiList();
        //tablePaiActionScript.removeAllNodeFromOtherPaiList();
        for (var i = 0; i < 4; i++) {
            var paiNode = cc.find("user" + (i + 1) + "PaiList", this.tableNode);
            paiNode.removeAllChildren();
            paiNode = cc.find("user" + (i + 1) + "PengPaiListNode", this.tableNode);
            paiNode.removeAllChildren();
            paiNode = cc.find("user" + (i + 1) + "ChuaPaiListNode", this.tableNode);
            paiNode.removeAllChildren();

            var huNode = cc.find("user" + (i + 1) + "HuPai", this.tableNode);
            var chilren = huNode.children;
            var moPaiNode = null;
            for (var j = 0; j < chilren.length; j++) {
                var node = chilren[j];
                if (node.name.indexOf("hupai") >= 0) {
                    moPaiNode = node;
                }
            }

            if (moPaiNode != null) {
                moPaiNode.removeFromParent();
            }
            huNode.active = false;

        }

    },

    testConnectRoom: function () {
        tableNetworkScript.testJoinRoom("585930")
    },

    inistalTestUser1: function () {
        this.initalUserPai("test1", "");
        Global.chuPaiActionType = "normalChuPai"
    },
    inistalTestUser2: function () {
        this.initalUserPai("test2", "");
        Global.chuPaiActionType = "normalChuPai"
    },
    inistalTestUser3: function () {
        this.initalUserPai("test3", "");
        Global.chuPaiActionType = "normalChuPai"
    },
    inistalTestUser4: function () {
        this.initalUserPai("test4", "");
        Global.chuPaiActionType = "normalChuPai"
    },
    //type:inital 
    initalUserPai: function (initalType, type) {
        //inital the test data
        //**********Test */
        if (initalType != "inital") {
            this.testInitalUserList(initalType);
        }

        //iniIndexScript.sendUserCode();
        //*********Test End */
        //  cc.log("Global.chuPaiActionType initalUserPai:" + Global.chuPaiActionType);
        //hide game mode
        this.tableGameMode.active = false;
        this.tableHead.active = true;

        //hide user ready icon
        this.user1ReadNode.active = false;
        this.user2ReadNode.active = false;
        this.user3ReadNode.active = false;
        this.user4ReadNode.active = false;
        //hide title
        this.tableTitleNode.active = false;
        //fix user point
        var userList = Global.userList;
        //show table action list
        this.tableActionNode.active = true;
        //hide hu node 
        this.user1HuNode.active = false;
        this.user2HuNode.active = false;
        this.user3HuNode.active = false;
        this.user4HuNode.active = false;

        //cc.log("userList.length:"+userList.length);
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            cc.log("inital user zhuang:" + user.zhuang);
            cc.log("inital user openid:" + user.openid);
            //show current user node
            if (user.pointIndex != null && user.pointIndex != undefined) {
                cc.log(user.pointIndex);
                //fix user point
                if (user.pointIndex != "3") {
                    eval("this.userInfo" + user.pointIndex + ".active = true");
                    this.fixUserPointByIndex(user.pointIndex);

                } else {
                    eval("this.userInfo" + user.pointIndex + ".active = false");
                }

                var paiList = user.paiList;
                cc.log(user.pointIndex + ":" + paiList.toString());
                if (paiList != null && paiList != undefined) {
                    if ((user.pointIndex + "") == "3") {
                        //inital self pai
                        cc.log("self user pai");
                        Global.chuPaiActionType = "huanSanZhang";
                        Global.huanSanZhangPaiList = [];
                        user.paiListArray = this.intalSelfPaiList(paiList);
                        user.chupaiListX = -210;
                        user.chupaiListY = -45;
                        user.chuPaiCount = 0;
                    } else {
                        user.paiListArray = this.initalOtherPaiList(paiList, user.pointIndex, initalType, "");
                        user = this.initalOtherUserChuPaiPoint(user, user.pointIndex + "");
                        //intal other user pai
                    }

                }



            }
        }

        //put back the user list to gobal

        Global.userList = userList;
        if (type != "joinExist") {
            //show huanPaiScript
            //huanPaiScript.showHuanPaiNode();
        }



    },

    //inital other user chupai start point
    initalOtherUserChuPaiPoint: function (user, point) {

        if (point == "1") {
            user.chupaiListX = 210;
            user.chupaiListY = -45;

        } else if (point == "2") {
            user.chupaiListX = 130;
            user.chupaiListY = 120;

        } else if (point == "4") {
            user.chupaiListX = -130;
            user.chupaiListY = -120;

        }
        user.chuPaiCount = 0;
        return user

    },

    /**
     * 
     */
    getMinLenPaiListFromPai: function (paiList) {
        cc.log("getMinLenPaiListFromPai:" + paiList.toString());
        var v1 = [];
        var v2 = [];
        var v3 = [];

        for (var i = 0; i < paiList.length; ++i) {
            var pai = paiList[i];
            var sType = pai + ""
            var sType = sType.substring(0, 1);
            if (sType == "1") {
                v1.push(pai);

            }
            if (sType == "2") {
                v2.push(pai);

            }
            if (sType == "3") {
                v3.push(pai);

            }

        }

        var resultArray = [v1.length, v2.length, v3.length]
        var resultArray2 = [v1, v2, v3]
        resultArray.sort()
        var l = 0
        for (var i = 0; i < 3; i++) {
            if (resultArray[i] >= 3) {
                l = resultArray[i];
                break;
            }
        }
        var returnArray;
        for (var i = 0; i < 3; i++) {
            if (resultArray2[i].length == l) {
                returnArray = resultArray2[i];
                break;
            }
        }


        cc.log("getMinLenPaiListFromPai returnArray:" + returnArray.toString());


        for (var i = 0; i < 3; i++) {
            //    var paiName = "pai" + (i) + "_" + returnArray[i].trim();
            //     cc.log("getMinLenPaiListFromPai paiName:"+paiName);
            //    var paiNode=cc.find(paiName, this.user3PaiListNode);
            //    paiNode.y=20;
            Global.huanSanZhangPaiList.push(returnArray[i]);
        }




        return returnArray;
    },

    getTypeCount: function () {
        var children = this.user3PaiListNode.children;
        var v1 = 0;
        var v2 = 0;
        var v3 = 0;
        var typecount = 0;
        var ownType = "";
        var returnArray = []
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var temp = childredName.split("_")
            var sType = temp[1];
            var sType = sType.substring(0, 1);
            if (sType == "1") {
                v1++
            }
            if (sType == "2") {
                v2++
            }
            if (sType == "3") {
                v3++
            }

        }

        if (v1 > 0) {
            typecount++;
            ownType = ownType + "1";
        }
        if (v2 > 0) {
            typecount++;
            ownType = ownType + "2";
        }
        if (v3 > 0) {
            typecount++;
            ownType = ownType + "3";
        }

        returnArray.push(typecount);
        returnArray.push(ownType);
        return returnArray

    },
    /**
     * Get 
     */
    getLess3NumberType: function (parentNode) {
        var v1 = 0;
        var v2 = 0;
        var v3 = 0;
        var children = parentNode.children;
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var temp = childredName.split("_")
            var sType = temp[1];
            var sType = sType.substring(0, 1);
            if (sType == "1") {
                v1++
            }
            if (sType == "2") {
                v2++
            }
            if (sType == "3") {
                v3++
            }

        }

        var v = [];
        if (v1 < 3) {
            v.push("1")
        }
        if (v2 < 3) {
            v.push("2")
        }
        if (v3 < 3) {
            v.push("3")
        }
        return v;
    },
    disableAllPai: function () {
        var children = this.user3PaiListNode.children;
        for (var i = 0; i < children.length; ++i) {
            var btn = children[i].getComponent(cc.Button);
            btn.interactable = false;
        }
    },
    disabledQuePai: function () {
        var userList = Global.userList;
        var userInfo = Global.userInfo;
        var quePai = "";
        var paiList;
        var existFlag = false;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userInfo.openid) {
                quePai = userList[i].quePai;
                paiList = userList[i].paiListArray;
            }
        }

        if (paiList != null) {
            if (quePai != null && quePai.length > 0) {
                for (var i = 0; i < paiList.length; ++i) {
                    var sType = paiList[i].trim() + "";
                    sType = sType.substring(0, 1)
                    if (sType == quePai) {
                        existFlag = true;
                    }

                }
            }

        }

        if (existFlag) {
            var children = this.user3PaiListNode.children;
            for (var i = 0; i < children.length; ++i) {
                var childredName = children[i].name;
                var temp = childredName.split("_")
                var sType = temp[1];
                sType = sType.substring(0, 1);
                if (sType != quePai) {
                    var btn = children[i].getComponent(cc.Button);
                    btn.interactable = false;
                }
            }
        }

    },

    getSlefUser: function () {
        var gobalUser = Global.userInfo
        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == gobalUser.openid) {
                user = userList[i];
            }
        }

        return user;

    },
    //Force select san zhang pai after the timer end 

    forceFillHuanSanZhangList: function () {
        var paiList = this.getSlefUser().paiListArray;
        this.getMinLenPaiListFromPai(paiList);

    },

    //when huan san zhang work, this will disabled less 3 number pai
    disabledHuanSanZhangPai: function () {

        var children = this.user3PaiListNode.children;
        var v = this.getLess3NumberType(this.user3PaiListNode);
        var vstr = v.toString();
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var temp = childredName.split("_")
            var sType = temp[1];
            sType = sType.substring(0, 1);
            if (vstr.indexOf(sType) >= 0) {
                var btn = children[i].getComponent(cc.Button);
                btn.interactable = false;
            }
        }

    },
    getCorrectUserByPoint: function (pointIndex) {

        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].pointIndex == pointIndex) {
                user = userList[i];
            }
        }

        return user;

    },
    testAddOne: function () {
        var paiList = [
            15, 17, 18, 22, 22, 23, 29, 29, 29, 33, 36, 37, 39

        ];
        this.initalOtherPaiListOnePai("11", paiList, "1", "");
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user2PaiList", tableNode);
        // var chuPaiListNode = cc.find("user" + index + "ChuaPaiListNode",this.tableNode);
        var children = userChuPaiListNode.children;
        cc.log("testAddOne:" + children.length);

    },
    /**
     * Only add one pai into last position.
     */
    initalOtherPaiListOnePai: function (paiNumber, paiArray, point, iniType) {
        // var paiArray = paiList.split(",");
        var startX = 0;
        var startY = 0;
        cc.log("********initalOtherPaiListOnePai:" + paiArray.toString() + "----" + point);
        var currentUser = this.getCorrectUserByPoint(point);
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + point + "PaiList", tableNode);

        var chirenLen = userChuPaiListNode.children.length;
        cc.log("********initalOtherPaiListOnePai 1:" + chirenLen + "----" + point);


        var firstNode = userChuPaiListNode.children[0];
        var lastNode = userChuPaiListNode.children[chirenLen - 1];
        cc.log("firstNode x:" + firstNode.x + "-" + firstNode.y);
        var pengList = currentUser.pengPaiList;
        var gangList = currentUser.gangPaiList;
        var pengLength = 0;
        if (pengList == null || pengList == undefined) {

        } else {
            pengLength = pengList.length;
        }
        var gangLength = 0;
        if (gangList == null || gangList == undefined) {

        } else {
            gangLength = gangLength.length;
        }
        var i = paiArray.length;
        cc.log("i:" + i);
        // for (var i = 0; i < paiArray.length; i++) {
        if (paiNumber != null && paiNumber != undefined) {
            if (paiNumber != "") {
                paiNumber = paiNumber + "";
                var paiNode;
                var sprite;
                paiNode = cc.instantiate(this.backNode);
                paiNode.name = "pai" + (chirenLen + 1) + "_" + paiNumber.trim();
                sprite = paiNode.getComponent(cc.Sprite);
                if (point == "1") {
                    sprite.spriteFrame = this.backPai;
                } else {
                    if (point == "2") {
                        sprite.spriteFrame = this.cePaiLeft;
                    } else {
                        sprite.spriteFrame = this.cePai;
                    }

                }

                userChuPaiListNode.addChild(paiNode);
                //eval("this.user" + point + "PaiListNode.addChild(paiNode)");
                //fix the user 1
                if (point == "1") {
                    startX = 380;
                    paiNode.rotation = 180;
                    paiNode.position = cc.p(lastNode.x - 55, 0);
                    //this.user1PaiListNode.addChild(paiNode);
                }

                if (point == "2") {

                    paiNode.position = cc.p(firstNode.x, firstNode.y + 28);
                    paiNode.zIndex = paiArray.length - chirenLen;
                    paiNode.width = 40;
                    paiNode.height = 85;
                    //parentNode

                }

                if (point == "4") {


                    paiNode.position = cc.p(firstNode.x, firstNode.y + 28);
                    paiNode.zIndex = paiArray.length - chirenLen - 1;
                    paiNode.width = 40;
                    paiNode.height = 85;
                }

                paiNode.name = "autoMoPai"

                cc.log("add one:" + paiNode.active + "----" + paiNode.x + ":" + paiNode.y) + "---z:" + paiNode.zIndex;

            }
        }
        //}
        chirenLen = userChuPaiListNode.children.length;
        cc.log("********initalOtherPaiListOnePai 2:" + chirenLen + "----" + point);

        return paiArray

    },
    initalOtherPaiList: function (paiList, point, iniType, endPoint) {
        var paiArray = paiList.split(",");
        var startX = 0;
        var startY = 0;
        cc.log("********initalOtherPaiList:" + paiList + "----" + point);
        //eval("this.user" + point + "PaiListNode.removeAllChildren()");
        var currentUser = this.getCorrectUserByPoint(point);
        var pengList = currentUser.pengPaiList;
        var gangList = currentUser.gangPaiList;
        var pengLength = 0;
        if (pengList == null || pengList == undefined) {

        } else {
            pengLength = pengList.length;
        }
        var gangLength = 0;
        if (gangList == null || gangList == undefined) {

        } else {
            gangLength = gangLength.length;
        }
        for (var i = 0; i < paiArray.length; i++) {
            if (paiArray[i] != null && paiArray[i] != undefined) {
                if (paiArray[i] != "") {
                    var paiNode;
                    var sprite;
                    paiNode = cc.instantiate(this.backNode);
                    paiNode.name = "pai" + (i) + "_" + paiArray[i].trim();
                    sprite = paiNode.getComponent(cc.Sprite);
                    if (point == "1") {

                        sprite.spriteFrame = this.backPai;
                        //this.user1PaiListNode.addChild(paiNode);

                    } else {

                        if (point == "2") {
                            sprite.spriteFrame = this.cePaiLeft;
                            //this.user2PaiListNode.addChild(paiNode);
                        } else {
                            sprite.spriteFrame = this.cePai;
                            // this.user4PaiListNode.addChild(paiNode);
                        }

                    }


                    eval("this.user" + point + "PaiListNode.addChild(paiNode)");
                    //fix the user 1
                    cc.log("info endPoint:" + endPoint + ":" + point);
                    if (point == "1") {
                        //startX = 380;
                        if (endPoint != null && endPoint != undefined && endPoint + "" != "") {
                            startX = endPoint + paiArray.length * 55 - 110;
                        } else {
                            startX = 380;
                        }
                        paiNode.rotation = 180;
                        paiNode.position = cc.p(startX - i * 55, 0);
                        //this.user1PaiListNode.addChild(paiNode);
                    }

                    if (point == "2") {
                        startX = 0;

                        if (endPoint != null && endPoint != undefined && endPoint + "" != "") {
                            startY = endPoint + paiArray.length * 28 + 28;
                        } else {
                            startY = 180;
                        }
                        // if (pengLength > 0 || gangLength > 0) {
                        //     startY = -180 + (pengLength * 115 + gangLength * 115);
                        //     //if (startY >= 240) {
                        //         startY = 260
                        //     //}
                        // } else {
                        //     startY = 180;
                        // }
                        //fix the start point the pai length
                        //if()

                        paiNode.position = cc.p(startX, startY - i * 28);
                        //paiNode.zIndex = paiArray.length - i;
                        paiNode.zIndex = paiArray.length + i;
                        paiNode.width = 40;
                        paiNode.height = 85;
                        //parentNode

                    }

                    if (point == "4") {
                        startX = 0;
                        // if (pengLength > 0 || gangLength > 0) {
                        //     startY = -210;
                        // } else {
                        //     startY = -180;
                        // }
                        if (endPoint != null && endPoint != undefined && endPoint + "" != "") {
                            startY = endPoint - paiArray.length * 28 + 84;
                        } else {
                            startY = -180;
                        }

                        paiNode.position = cc.p(startX, startY + i * 28);
                        paiNode.zIndex = paiArray.length - i;
                        //paiNode.setLocalZOrder(1000 - i);
                        // paiNode.siblingIndex = 1000 - i;
                        paiNode.width = 40;
                        paiNode.height = 85;
                    }

                    cc.log(point + ":" + paiNode.x + "-" + paiNode.y);

                }
            }
        }

        if (point == "4") {
            eval("this.user" + point + "PaiListNode.zIndex=140");
            eval("this.user" + point + "PaiListNode.setLocalZOrder(140)");
            //  cc.log("4 inital zindex:" + paiNode.zIndex);
            //  cc.log("4 inital setLocalZOrder:" + paiNode.getLocalZOrder());

        }
        if (point == "2") {
            eval("this.user" + point + "PaiListNode.zIndex=120");
            eval("this.user" + point + "PaiListNode.setLocalZOrder(120)");
            // cc.log("4 inital zindex:" + paiNode.zIndex);
            // cc.log("4 inital setLocalZOrder:" + paiNode.getLocalZOrder());

        }


        return paiArray
    },
    intalSelfPaiList: function (paiList) {

        var startPoint = -520;
        // we need fix the startPoint By pai number 
        var paiArray = paiList.split(",");
        if (paiArray.length <= 10) {
            startPoint = parseInt(-520 + (10 - paiArray.length) * 79 / 2)
        }
        for (var i = 0; i < paiArray.length; i++) {
            if (paiArray[i] != null && paiArray[i] != undefined) {
                var paiNode = cc.instantiate(this.liPaiPrefab);
                var btn = paiNode.getComponent(cc.Button);

                var sprite = paiNode.getComponent(cc.Sprite);
                paiNode.name = "pai" + (i) + "_" + paiArray[i].trim();
                //var imageUrl = "/img/9t";
                //var imageUrl = this.getCorrectNameOnSelfPai(paiArray[i]);
                //cc.log("img3:" + imageUrl);
                /*
                cc.loader.load(imageUrl, function (err, texture) {
                    if (err) {
                        cc.error(err.message || err);
                        return;
                    }
                    var frame = new cc.SpriteFrame(texture);
                    sprite.spriteFrame = frame;
                });*/
                var index = this.getCurrectIndeOnSeflPai(paiArray[i]);
                sprite.spriteFrame = this.liPaiZiMian[index]
                this.user3PaiListNode.addChild(paiNode);
                if (i == 13) {
                    paiNode.position = cc.p(startPoint + i * 80, 0);
                    paiNode.name = "mopai_" + paiArray[i].trim();
                } else {
                    paiNode.position = cc.p(startPoint + i * 79, 0);
                }

                paiNode.setLocalZOrder(200);
                paiNode.zIndex = 200;

            }
        }

        if (this.user3PaiListNode.active == false) {
            this.user3PaiListNode.active = true;
            this.user3PaiListNode.setLocalZOrder(200);
            this.user3PaiListNode.zIndex = 200;
        }

        return paiArray;

    },

    getCurrectIndeOnSeflPai: function (pai) {
        pai = (pai + "").trim()
        var type = (pai + "").substring(0, 1);
        var paiNum = (pai + "").substring(1);
        //tong 11-19
        //tiao 21-29
        //wan  31-39
        var index = -1;

        if (type == "1") {
            index = parseInt(paiNum) - 1
        }

        if (type == "2") {
            index = parseInt(paiNum) + 8
        }

        if (type == "3") {
            index = parseInt(paiNum) + 17
        }

        return index

    },

    getCorrectNameOnSelfPai: function (pai) {
        pai = (pai + "").trim()
        cc.log("img1:" + pai + "--" + pai.length);
        var type = (pai + "").substring(0, 1);
        var paiNum = (pai + "").substring(1);
        var prefix = ""
        var path = ""

        if (type == "1") {
            path = "image/table/pai/lipai/tong/";
            prefix = "b";
        }
        if (type == "2") {
            path = "image/table/pai/lipai/tiao/";
            prefix = "t";
        }
        if (type == "3") {
            path = "image/table/pai/lipai/wan/";
            prefix = "w";
        }

        var img = path + paiNum + prefix;
        cc.log("img2:" + img);
        return img;

    },

    resetUserPoint: function () {

        for (var i = 1; i < 5; i++) {

            if (i == 1) {
                this.userInfo1.x = 0;
                this.userInfo1.y = 345;
            }
            if (i == 2) {
                this.userInfo2.x = -607;
                this.userInfo2.y = 175;
            }
            if (i == 3) {
                this.userInfo3.x = 0;
                this.userInfo3.y = -75;
            }
            if (i == 4) {
                this.userInfo4.x = 547;
                this.userInfo4.y = 175;
            }


        }

    },

    fixUserPointByIndex: function (index) {
        index = index + "";
        if (index == "1") {
            cc.log("this.userInfo1 x:" + this.userInfo1.x);
            cc.log("this.userInfo1 y:" + this.userInfo1.y);
            var widget = this.userInfo1.getComponent(cc.Widget);
            widget.top = -40;
            // widget.isAlignRight = true;
            // widget.right = 210;
            //this.userInfo1.y=-20;
            cc.log("fixUserPointByIndex 1:" + this.userInfo1.y)
            //this.userInfo1.y =410;
            this.userInfo1.x = -600;
            //this.userInfo1.y = 0;

        }
        if (index == "2") {
            var widget = this.userInfo2.getComponent(cc.Widget);
            widget.top = 0;
            //widget.left = 60;
            this.userInfo2.x = -607;
            //  this.userInfo2.y = 0;
        }
        cc.log("fixUserPointByIndex:" + index);
        if (index == "4") {
            var widget = this.userInfo4.getComponent(cc.Widget);
            widget.isAlignRight = true;
            widget.right = 60;
            //this.userInfo4.x = 607;
            cc.log("fixUserPointByIndex:" + this.userInfo4.x);
        }
    },


    intalUserInfoReadyIcon: function () {

        var userList = Global.userList;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            var userNodeName = "user" + user.pointIndex + "Node";
            cc.log("userNodeName:" + userNodeName);
            var userNode = cc.find(userNodeName, this.tableNode);
            var userInfoNode = cc.find("userInfoNode", userNode);
            //var userNickNameNode = cc.find("userNickNameBg", userInfoNode);
            var userReadyiconNode = cc.find("userReadyNode", userInfoNode);
            var userReadyBtnNode = cc.find("readyButton", userReadyiconNode);
            var s = userReadyBtnNode.getComponent(cc.Sprite);
            cc.log("user.gameReadyStatu:" + user.gameReadyStatu);
            if (user.gameReadyStatu == "1") {
                s.spriteFrame = this.userReadyIconOk;
            } else {
                s.spriteFrame = this.userReadyIconNotOk;
            }
        }

    },

    initalUserOnRound: function () {
        this.userInfo3.active = true;
        this.user1ReadNode.active = true;
        this.user2ReadNode.active = true;
        this.user3ReadNode.active = true;
        this.user4ReadNode.active = true;
        this.resetUserPoint();
        this.intalUserInfoReadyIcon();
    },

    initalUserInfoFromGobalList: function () {
        //hide  table  pai starting 
        this.quepaiNode.active = false;
        this.tableCenterPoint.active = false;

        var numberOrder = [3, 4, 1, 2]
        var userList = Global.userList;
        var userInfo = Global.userInfo;
        var gameMode = Global.gameMode;
        var gamePeople = gameMode.gamePeopleNumber;
        var index = -1;
        if (userList != null && userList != undefined) {
            var tempList = [];
            //1.find the start index
            for (var i = 0; i < userList.length; i++) {
                var tableUserInfo = userList[i];
                if (index < 0) {
                    if (userInfo.openid == tableUserInfo.openid) {
                        tempList.push(tableUserInfo);
                        index = i;
                    }
                } else {
                    tempList.push(tableUserInfo);
                }

            }
            cc.log("index:" + index);
            if (index == 0) {
                if (gamePeople == "3") {
                    numberOrder = [3, 4, 2]
                }

                if (gamePeople == "2") {
                    numberOrder = [3, 1]
                }
            }
            if (index == 1) {
                if (gamePeople == "4") {
                    numberOrder = [2, 3, 4, 1]
                }
                if (gamePeople == "3") {
                    numberOrder = [2, 3, 4]
                }
                if (gamePeople == "2") {
                    numberOrder = [1, 3]
                }

            }
            if (index == 2) {
                if (gamePeople == "4") {
                    numberOrder = [1, 2, 3, 4]
                }
                if (gamePeople == "3") {
                    numberOrder = [4, 2, 3]
                }

            }
            if (index == 3) {
                if (gamePeople == "4") {
                    numberOrder = [4, 1, 2, 3]
                }
                if (gamePeople == "3") {
                    numberOrder = [4, 2, 3]
                }
            }

            // if (index > 0) {
            //     for (var i = 0; i < index; i++) {
            //         tempList.push(userList[i]);
            //     }
            // }

            //start fill the user info from index 
            cc.log("numberOrder:" + numberOrder.toString());
            for (var i = 0; i < userList.length; i++) {
                var user = userList[i];
                user.pointIndex = numberOrder[i];
                userList[i] = user;
                var userNodeName = "user" + numberOrder[i] + "Node";
                //var testHeaImageurl = "http://wx.qlogo.cn/mmopen/Po9mkm3Z42tolYpxUVpY6mvCmqalibOpcJ2jG3Qza5qgtibO1NLFNUF7icwCibxPicbGmkoiciaqKEIdvvveIBfEQqal8vkiavHIeqFT/0";
                var serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
                cc.log("headImageFileName:" + user.headImageFileName);
                var testHeaImageurl = serverUrl + "/webchatImage/" + userInfo.headImageFileName;
                cc.log("testHeaImageurl:" + testHeaImageurl);
                var userNode = cc.find(userNodeName, this.tableNode);
                var userInfoNode = cc.find("userInfoNode", userNode);
                var userNickNameNode = cc.find("userNickNameBg", userInfoNode);
                var userNickNameLableNode = cc.find("userNickName", userNickNameNode);
                cc.loader.load(testHeaImageurl, function (err, texture) {
                    var frame = new cc.SpriteFrame(texture);
                    userInfoNode.getComponent(cc.Sprite).spriteFrame = frame;
                });

                var userNickNameLable = userNickNameLableNode.getComponent(cc.Label);
                userNickNameLable.string = user.nickName;
                userNode.active = true;
            }
            Global.userList = userList;
            this.intalUserInfoReadyIcon();

        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
