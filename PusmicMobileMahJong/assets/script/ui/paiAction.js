var actionWidth = [];
var actionName = [];
var tablePaiActionScript;
var tableUserInfoNodeScript;
var huPaiScript;
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
        actionNode: cc.Node,
        zimoNode: cc.Node,
        pengNode: cc.Node,
        gangNode: cc.Node,
        huNode: cc.Node,
        cancleNode: cc.Node,
        tablePaiActionNode: cc.Node,
        tableUserInfoNode: cc.Node,
        paiChuPaiNode: cc.Prefab,
        huPaiNode: cc.Node,
        paiNumber: String,
        fromUserOpenId: String,
    },

    // use this for initialization
    onLoad: function () {
        actionName = ['zimo', 'peng', 'gang', 'hu', 'cancle'];
        actionWidth = [225, 166, 137, 121, 112];
        //actionWidth = [225, 156, 157, 141, 112];
        this.actionNode.active = false;
        this.zimoNode.active = false;
        this.pengNode.active = false;
        this.huNode.active = false;
        this.cancleNode.active = false;
        tablePaiActionScript = this.tablePaiActionNode.getComponent('tablePaiAction');
        tableUserInfoNodeScript = this.tableUserInfoNode.getComponent('tableUserInfo');
        huPaiScript = this.huPaiNode.getComponent();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    testShowAction: function () {
        var actionArray = ['cancle', 'gang', 'peng'];
        this.showAction(actionArray);
    },
    testPengPai: function () {
        this.pengAction("testUser2", "33");
        this.pengAction("testUser0", "11");
        this.pengAction("testUser1", "22");
        this.pengAction("testUser3", "28");
        //this.gangAction("testUser2", "23");
        this.pengAction("testUser2", "23");
    },
    showActionBar: function (paiNumber, fromPaiOpenId, type) {
        //we should consider the action level.
        //hu ==3 , peng,gang==2
        var showFlag = false;
        var actionLevel = 0;
        this.paiNumber = paiNumber;
        this.fromUserOpenId = fromPaiOpenId;
        paiNumber = paiNumber + "";
        paiNumber = paiNumber.trim();
        var actionArray = ['cancle'];
        var userInfo = Global.userInfo;
        var user = tablePaiActionScript.getCorrectUserByOpenId(userInfo.openid);
        var paiList = user.paiListArray;
        var paiCount = 0;

        //if it is chupai from other user, it should not work on intalSelfPaiList
        // if(type=="chupai"){
        //     if(userInfo.openid==fromPaiOpenId){
        //         return false;
        //     }
        // }

        for (var i = 0; i < paiList.length; i++) {
            var pai = paiList[i] + "";
            pai = pai.trim();
            if (pai == paiNumber) {
                paiCount++
            }
        }

        var huFlag = huPaiScript.hupaiLogic(paiNumber, userInfo.openid);
        if (paiCount >= 3) {
            actionArray.push("gang");
            actionLevel = 2
        }
        if (fromPaiOpenId == userInfo.openid) {

            if (huFlag == true) {
                actionArray.push("zimo");
                actionLevel = 3;
            }
        } else {
            if (paiCount >= 2) {
                actionArray.push("peng");
                actionLevel = 2
            }

            if (huFlag == true) {
                actionArray.push("hu");
                actionLevel = 3
            }


        }


        if (actionArray.length > 1) {
            this.showAction(actionArray);
            showFlag = true;
        } else {
            //go to next user mo pai 
        }

        return actionLevel;

    },
    showAction: function (actionArray) {
        //from right to left ,the x is reduce.
        var startX = 146;
        var actionWidthTemp = [];
        for (var i = 0; i < actionArray.length; i++) {
            var node = cc.find(actionArray[i] + "ActionNode", this.actionNode);
            node.active = true;
            node.x = startX
            for (var j = 0; j < actionName.length; j++) {
                if (actionName[j] == actionArray[i]) {
                    //actionWidthTemp.push(actionWidth[j]);
                    startX = startX - actionWidth[j] - 15;
                    cc.log("startX:" + startX);
                }
            }
        }

        this.actionNode.active = true;



    },
    //------------------------Peng,Gang,Hu Action---------------------------------------

    pengAction: function () {
        var userOpenId = this.fromUserOpenId;
        var paiNumber = this.paiNumber;
        var user = tablePaiActionScript.getCorrectUserByOpenId(userOpenId);
        var pointIndex = user.pointIndex;
        //data layer ------
        var paiList = user.paiListArray;
        paiList = this.removeElementByNumberFromUser(paiList, paiNumber, 2);
        cc.log("pengAction paiList:" + paiList);
        user.paiListArray = paiList;
        var pengList = user.pengPaiList;
        if (pengList == null || pengList == undefined) {
            pengList = [];
        }
        pengList.push(paiNumber);
        user.pengPaiList = pengList;
        //update user to gobal
        user = tablePaiActionScript.synchronizationPaiList(user);
        tablePaiActionScript.updateUserListInGobal(user);
        //data layer end -------------------------------------
        //-------show user pai list-----------------
        cc.log("pengAction:" + pointIndex);
        if (pointIndex == "3") {
            tablePaiActionScript.removeAllNodeFromSelfPaiList();
            tableUserInfoNodeScript.intalSelfPaiList(user.paiList);
        } else {
            tablePaiActionScript.removeAllNodeFromOtherPaiList(pointIndex);
            //if (pointIndex != "2") 
            tableUserInfoNodeScript.initalOtherPaiList(user.paiList, pointIndex, "pengList");
        }

        this.initalPengAndGangChuPaiList(userOpenId, paiNumber);
        Global.chuPaiActionType = "peng";


    },
    gangAction: function () {
        var userOpenId = this.fromUserOpenId;
        var paiNumber = this.paiNumber;
        var user = tablePaiActionScript.getCorrectUserByOpenId(userOpenId);
        var pointIndex = user.pointIndex;
        //data layer ------
        var paiList = user.paiListArray;
        paiList = this.removeElementByNumberFromUser(paiList, paiNumber, 3);
        cc.log("gangAction paiList:" + paiList);
        user.paiListArray = paiList;
        var gangList = user.gangPaiList;
        if (gangList == null || gangList == undefined) {
            gangList = [];
        }
        gangList.push(paiNumber);
        user.gangPaiList = gangList;
        // mopai 
        //update user to gobal
        user = tablePaiActionScript.synchronizationPaiList(user);
        tablePaiActionScript.updateUserListInGobal(user);
        //data layer end -------------------------------------
        //-------show user pai list-----------------
        cc.log("pengAction:" + pointIndex);
        if (pointIndex == "3") {
            tablePaiActionScript.removeAllNodeFromSelfPaiList();
            tableUserInfoNodeScript.intalSelfPaiList(user.paiList);
        } else {
            tablePaiActionScript.removeAllNodeFromOtherPaiList(pointIndex);
            // if (pointIndex != "2") {
            tableUserInfoNodeScript.initalOtherPaiList(user.paiList, pointIndex, "gang");
            //  }
        }

        this.initalPengAndGangChuPaiList(userOpenId, paiNumber);
        Global.chuPaiActionType = "gang";


    },



    huAction: function () {
        var userInfo = Global.userInfo;
        huPaiScript.huPaiAction(this.paiNumber, userInfo.openid);
    },


    initalPengAndGangChuPaiList: function (userOpenId, paiNumber) {
        var user = tablePaiActionScript.getCorrectUserByOpenId(userOpenId);
        var pointIndex = user.pointIndex;
        var tableNode = cc.find("Canvas/tableNode");
        var userPengPaiListNode = cc.find("user" + pointIndex + "PengPaiListNode", tableNode);
        userPengPaiListNode.removeAllChildren();
        cc.log("166:" + userPengPaiListNode.children.length)
        var pengList = user.pengPaiList;
        var gangPaiList = user.gangPaiList;
        var x = 0;
        var y = 0;
        if (pointIndex == "3") {
            user.pengGangPaiPoint = 410;
            y = 0;
            x = user.pengGangPaiPoint;
        } else if (pointIndex == "1") {
            user.pengGangPaiPoint = -270;
            y = 0;
            x = user.pengGangPaiPoint;
        } else if (pointIndex == "2") {
            user.pengGangPaiPoint = -250;
            y = user.pengGangPaiPoint;
            x = 0;
        } else if (pointIndex == "4") {
            user.pengGangPaiPoint = 100;
            y = user.pengGangPaiPoint;
            x = 0;
        }


        this.showPengGangPaiListOnTalbe(pengList, gangPaiList, pointIndex, paiNumber, userPengPaiListNode, "peng", x, y)


    },

    showPengGangPaiListOnTalbe: function (pengList, gangList, pointIndex, paiNumber, userPengPaiListNode, type, x, y) {


        var isGangFlagList = [];
        var finalX = x;
        var finalY = y;
        if (pengList != null && pengList != undefined) {
            for (var i = 0; i < pengList.length; i++) {
                //get final point for gang
                for (var j = 1; j < 4; j++) {

                    var point0 = this.getCorrectPointByIndex(pointIndex, finalX, finalY);
                    finalX = point0[0];
                    finalY = point0[1];
                }
                var tempPai = pengList[i] + "";
                tempPai = tempPai.trim();
                //var isGang
                //eval("var   isGang" + paiNumber+"" + " = false;");
                // isGangFlagList[parseInt(tempPai)] = false;

                // eval("cc.log( 'isGang 216:'+  isGang" + paiNumber+")");
                var paiPath = tablePaiActionScript.getChuPaiNameByNodeName(tempPai, pointIndex);
                var middlePoint = null;
                // cc.log("isGang loadRes:" + isGang);
                cc.loader.loadRes(paiPath, function (err, sp) {
                    if (err) {
                        cc.log("----" + err.message || err);
                        return;
                    }


                    var sencodPaiX = -1;
                    var sencodPaiY = -1;
                    for (var j = 1; j < 4; j++) {
                        var pNode = cc.instantiate(this.paiChuPaiNode);
                        pNode.name = "pengpai" + pointIndex + "_" + paiNumber;
                        pNode.active = true;
                        cc.log("peng x:" + x + "-----y:" + y);
                        pNode.position = cc.p(x, y);
                        if (j == 2) {
                            sencodPaiX = x;
                            sencodPaiY = y;
                        }

                        if (pointIndex == "2") {
                            pNode.setLocalZOrder(100 - j);
                            pNode.zIndex = 100 - j;
                        }

                        var point = this.getCorrectPointByIndex(pointIndex, x, y);
                        x = point[0];
                        y = point[1];

                        var sprite = pNode.getComponent(cc.Sprite);
                        sprite.spriteFrame = new cc.SpriteFrame(sp);
                        userPengPaiListNode.addChild(pNode);
                    }



                }.bind(this));


            }
        }

        if (gangList != null && gangList != undefined) {
            for (var k = 0; k < gangList.length; k++) {
                var tempPai = gangList[k] + "";
                tempPai = tempPai.trim();
                var paiPath = tablePaiActionScript.getChuPaiNameByNodeName(tempPai, pointIndex);
                cc.loader.loadRes(paiPath, function (err, sp) {
                    if (err) {
                        cc.log("----" + err.message || err);
                        return;
                    }


                    var sencodPaiX = -1;
                    var sencodPaiY = -1;
                    for (var m = 1; m < 4; m++) {
                        var pNode = cc.instantiate(this.paiChuPaiNode);
                        pNode.name = "pengpai" + pointIndex + "_" + paiNumber;
                        pNode.active = true;
                        cc.log("gang m:" + m);
                        cc.log("gang x:" + finalX + "-----y:" + finalY);
                        pNode.position = cc.p(finalX, finalY);
                        if (m == 2) {
                            sencodPaiX = finalX;
                            sencodPaiY = finalY;
                        }

                        if (pointIndex == "2") {
                            pNode.setLocalZOrder(100 - m);
                            pNode.zIndex = 100 - m;
                        }

                        var point = this.getCorrectPointByIndex(pointIndex, finalX, finalY);
                        finalX = point[0];
                        finalY = point[1];

                        var sprite = pNode.getComponent(cc.Sprite);
                        sprite.spriteFrame = new cc.SpriteFrame(sp);
                        userPengPaiListNode.addChild(pNode);
                    }


                    //if (singleIsGang == true) {
                    var pNode2 = cc.instantiate(this.paiChuPaiNode);
                    if (pointIndex == "3") {
                        sencodPaiY = sencodPaiY + 15;
                    } else if (pointIndex == "1") {
                        sencodPaiY = sencodPaiY - 10;
                    } else if (pointIndex == "2") {
                        sencodPaiX = sencodPaiX + 10
                    } else {
                        sencodPaiX = sencodPaiX + 10
                    }

                    cc.log("isGang paiNumber:" + paiNumber);
                    cc.log("isGang paiPath:" + paiPath);

                    pNode2.name = "pengpai" + pointIndex + "_gang" + paiNumber;
                    pNode2.active = true;
                    cc.log("gang x:" + finalX + "-----y:" + finalY);
                    pNode2.position = cc.p(sencodPaiX, sencodPaiY);
                    var sprite2 = pNode2.getComponent(cc.Sprite);
                    sprite2.spriteFrame = new cc.SpriteFrame(sp);
                    userPengPaiListNode.addChild(pNode2);
                    //isGang = false;

                    // }

                }.bind(this));
            }
        }

    },

    getCorrectPointByIndex: function (pointIndex, x, y) {
        var point = [];
        if (pointIndex == "3") {
            x = x - 42;
        } else if (pointIndex == "1") {

            x = x + 42;

        } else if (pointIndex == "2") {

            y = y + 35;
        } else {
            y = y - 35;
        }

        point.push(x);
        point.push(y);
        return point;

    },
    closeActionBar: function () {
        this.actionNode.active = false;
    },


    //-----------------Action end-------------------------------------------------------

    removeElementByNumberFromUser: function (paiList, paiNumber, b) {
        var c = 1;
        while (c <= b) {
            for (var i = 0; i < paiList.length; ++i) {
                var temp = paiList[i] + "";
                temp = temp.trim();
                if (temp == paiNumber) {
                    paiList.splice(i, 1);

                    break;
                }

            }
            c++;
        }

        return paiList

    },


});
