var actionWidth = [];
var actionName = [];
var tablePaiActionScript;
var tableUserInfoNodeScript;
var huPaiScript;
var tableNetWorkScript;
var tableCenterScript;
var pengOrder = 100;
var moPaiScript;
var roundScoreUIScript;
var audioScript;
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
        paiType: String,
        paiNumber: String,
        fromUserOpenId: String,
        chuPaiUserOpenId: String,
        preStep: String,
        //needWaitOther
        otherUserActionString: String,
        tableNetWorkNode: cc.Node,
        tableCenterNode: cc.Node,
        user3PaiListNode: cc.Node,
        moPaiActionNode: cc.Node,
        roundScoreScriptNode: cc.Node,
        audioNode: cc.Node,
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
        this.preStep = "";
        tablePaiActionScript = this.tablePaiActionNode.getComponent('tablePaiAction');
        tableUserInfoNodeScript = this.tableUserInfoNode.getComponent('tableUserInfo');
        huPaiScript = this.huPaiNode.getComponent("HuPaiAction");
        tableNetWorkScript = this.tableNetWorkNode.getComponent("GameTableNetWork");
        tableCenterScript = this.tableCenterNode.getComponent("tableCenterPoint");
        moPaiScript = this.moPaiActionNode.getComponent("tableMoPaiAction");
        roundScoreUIScript = this.roundScoreScriptNode.getComponent("roundScoreUI");
        audioScript = this.audioNode.getComponent("AudioMng");
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

    testshowPengGangPaiListOnTalbe: function () {
        var y = -250;
        var x = 0;
        var tableNode = cc.find("Canvas/tableNode");
        var userPengPaiListNode = cc.find("user2PengPaiListNode", tableNode);
        this.showPengGangPaiListOnTalbe([11, 12], null, 2, "12", userPengPaiListNode, "peng", 0, -250)
    },
    checkQueInList: function (quePai, paiList) {
        var flag = false;
        if (quePai != null && quePai != undefined) {
            quePai = quePai + "";
            quePai = quePai.trim();
            for (var i = 0; i < paiList.length; i++) {
                var pai = paiList[i] + "";
                pai = pai.trim();
                var paiType = pai[0];
                if (paiType == quePai) {
                    flag = true;
                }

            }


        }
        return flag;
    },
    clearQuePaiInPaiList: function (quePai, paiList) {
        console.log("clearQuePaiInPaiList paiList1:" + paiList);
        var temp = [];

        if (quePai != null && quePai != undefined) {
            quePai = quePai + "";
            quePai = quePai.trim();
            for (var i = 0; i < paiList.length; i++) {
                var pai = paiList[i] + "";
                pai = pai.trim();
                var paiType = pai[0];
                if (paiType != quePai) {
                    temp.push(pai);
                }

            }


        }
        console.log("clearQuePaiInPaiList paiList2:" + paiList);
        return temp;

    },
    checkActionArrayInSelfPaiList: function (openid) {
        var user = tablePaiActionScript.getCorrectUserByOpenId(openid);
        var paiList = user.paiListArray;
        var tempList = [];
        for (var j = 0; j < paiList.length; j++) {
            tempList.push(paiList[j])
        }
        var huFlag = huPaiScript.hupaiLogicNoInsert(tempList);
        var actionArray = ['cancle'];
        for (var j = 0; j < tempList.length; j++) {
            var paiNumber = tempList[j] + ""
            paiNumber = paiNumber.trim();
            var paiCount = 0;
            for (var i = 0; i < tempList.length; i++) {
                var pai = tempList[i] + "";
                pai = pai.trim();
                if (pai == paiNumber) {
                    paiCount++
                }
            }

            if (paiCount == 4) {
                if (actionArray.indexOf("gang") < 0) {
                    actionArray.push("gang");
                }
                this.fromUserOpenId = openid;
                this.paiNumber = paiNumber;
                this.chuPaiUserOpenId = openid;
            }
        }


        if (huFlag == true) {
            if (actionArray.indexOf("hu") < 0) {
                actionArray.push("hu");
                actionLevel = 3
            }
        }
        return actionArray;
    },
    getActionBarArrayByOpenId: function (paiNumber, openid, type) {
        var user = tablePaiActionScript.getCorrectUserByOpenId(openid);
        var paiList = user.paiListArray;
        var tempList = [];
        for (var i = 0; i < paiList.length; i++) {
            tempList.push(paiList[i])
        }
        var pengList = user.pengPaiList;
        var actionArray = ['cancle'];

        var quePai = user.quePai;
        var userInfo = Global.userInfo;
        var paiCount = 0;
        quePai = quePai + "";
        console.log("getActionBarArrayByOpenId quePai:" + quePai);
        //check quepai 
        // if (type != "mopai") {
        var paiType = paiNumber + "";
        paiType = paiType.trim();
        if (paiType[0] == quePai) {
            return actionArray;
        }
        //  }

        var actionLevel = 0;
        var huFlag = false;
        if (pengList == null || pengList == undefined) {
            pengList = [];
        }
        //only mo pai check the peng list on gang 
        if (type == "mopai") {
            console.log("209:"+pengList.toString());
            for (var h = 0; h < pengList.length; h++) {
                console.log("pengList[i]:"+pengList[h]);
                var pengPai = pengList[h] + "";
                pengPai = pengPai.trim();
                if (pengPai+"" == paiNumber + "") {
                    if (actionArray.indexOf("gang") < 0) {
                        actionArray.push("gang");
                        actionLevel = 2;
                    }
                }

                for (var i = 0; i < tempList.length; i++) {
                    var pai = tempList[i] + "";
                    if (pengPai == pai + "") {
                        if (actionArray.indexOf("gang") < 0) {
                            actionArray.push("gang");
                            actionLevel = 2;
                            paiNumber=pai;
                        }
                    }

                    var count = this.countElementAccount(pai, tempList);
                    if (count == 4) {
                        if (actionArray.indexOf("gang") < 0) {
                            actionArray.push("gang");
                            actionLevel = 2;
                            paiNumber=pai;
                        }
                    }
                }


            }

            //only mo pai check other pai if gang 
        }
        tempList = this.clearQuePaiInPaiList(quePai, tempList);

        if (this.checkQueInList(quePai, tempList) == false) {

            console.log("huFlag0:" + huFlag);
            huFlag = huPaiScript.hupaiLogic(paiNumber, userInfo.openid, tempList, type);
            console.log("huFlag1:" + huFlag);
        }

        //checslef pai list
        if (this.fromUserOpenId == this.chuPaiUserOpenId) {
            for (var i = 0; i < tempList.length; i++) {
                var pai = tempList[i] + "";
                var count = this.countElementAccount(pai, tempList);
                if (count == 4) {
                    if (actionArray.indexOf("gang") < 0) {
                        actionArray.push("gang");
                        actionLevel = 2;

                        this.paiNumber = paiNumber;

                    }

                }

            }

        }


        //we need clear the mopai from the paiList 
        //get pai count in self pai list 
        for (var i = 0; i < tempList.length; i++) {
            var pai = tempList[i] + "";
            pai = pai.trim();
            if (pai == paiNumber) {
                paiCount++
            }
        }
        if (type != "mopai") {
            if (paiCount >= 3) {
                if (actionArray.indexOf("gang") < 0) {
                    actionArray.push("gang");
                    actionLevel = 2
                }
            }
        } else {

            if (paiCount == 4) {
                if (actionArray.indexOf("gang") < 0) {
                    actionArray.push("gang");
                    actionLevel = 2
                }

            }
            for (var i = 0; i < tempList.length; i++) {
                var tempPai = tempList[i] + "";
                tempPai = tempPai.trim();
                var tempCount = 0
                for (var j = 0; j < tempList.length; j++) {
                    var temp2 = tempList[j] + "";
                    temp2 = temp2.trim();
                    if (temp2 == tempPai) {
                        tempCount++
                        if (tempCount == 4) {
                            break;
                        }
                    }
                }

                if (tempCount == 4) {
                    if (actionArray.indexOf("gang") < 0) {
                        actionArray.push("gang");
                        actionLevel = 2;
                         paiNumber=pai;
                    }
                }
            }



        }
        if (type != "mopai") {
            if (paiCount >= 2) {
                if (actionArray.indexOf("peng") < 0) {
                    actionArray.push("peng");
                    actionLevel = 2
                }

            }
        }

        if (huFlag == true) {
            actionArray.push("hu");
            actionLevel = 3
        }
        console.log("paiCount:" + paiCount.toString());
        console.log("actionArray:" + actionArray.toString());
        return actionArray;

    },
    getSelfActionBarArray: function (paiNumber) {
        var userInfo = Global.userInfo;
        var user = tablePaiActionScript.getCorrectUserByOpenId(userInfo.openid);
        var paiList = user.paiListArray;
        var temp = [];
        for (var i = 0; i < paiList.length; i++) {
            temp.push(paiList[i]);
        }
        var paiCount = 0;
        var actionArray = ['cancle'];
        var actionLevel = 0;
        var huFlag = false;
        var quePai = user.quePai;
        console.log("getSelfActionBarArray paiList1:" + temp.toString());
        if (this.checkQueInList(quePai, temp) == false) {
            temp = this.clearQuePaiInPaiList(quePai, temp);
            huFlag = huPaiScript.hupaiLogic(paiNumber, userInfo.openid, temp, "mopai");
        }
        console.log("getSelfActionBarArray paiList2:" + paiList.toString());
        paiNumber = paiNumber + "";
        //get pai count in self pai list 
        for (var i = 0; i < paiList.length; i++) {
            var pai = paiList[i] + "";
            pai = pai.trim();
            if (pai == paiNumber) {
                paiCount++
            }
        }


        if (paiCount >= 3) {
            actionArray.push("gang");
            actionLevel = 2
        }

        if (paiCount >= 2) {
            actionArray.push("peng");
            actionLevel = 2
        }

        if (huFlag == true) {
            actionArray.push("hu");
            actionLevel = 3
        }
        console.log("paiCount:" + paiCount.toString());
        console.log("actionArray:" + actionArray.toString());
        return actionArray;

    },
    /**
     * This function only work on self mopai 
     */
    showActionBarOnSelf: function (paiNumber, fromPaiOpenId, type) {
    },
    /**
     * This function only work on the chu pai
     * 
     */
    showOtherActionBar: function (paiNumber, fromPaiOpenId, type) {
        //we should consider the action level.
        //hu ==3 , peng,gang==2
        var actionArray = ['cancle'];
        var showFlag = false;
        var actionLevel = 0;
        this.paiNumber = paiNumber;
        this.fromUserOpenId = fromPaiOpenId;
        paiNumber = paiNumber + "";
        paiNumber = paiNumber.trim();
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
        var userList = Global.userList;
        //get other user if have hu

        var huFlag = false;
        var otherHuArray = [];
        var otherHuMap = new Map();
        var otherUserResutl = false;
        for (var i = 0; i < userList.length; i++) {
            var otherHU = false;


            if (userList[i].openid == userInfo.openid) {
                // huFlag = otherHU;
            } else {
                var quePai = userList[i].quePai;
                if (this.checkQueInList(quePai, userList[i].paiListArray) == false) {
                    paiList = this.clearQuePaiInPaiList(quePai, userList[i].paiListArray);
                    otherHU = huPaiScript.hupaiLogic(paiNumber, userList[i].openid, "");
                }

                otherHuMap.set(userList[i].openid, otherHU);
                if (otherHU == true) {
                    otherUserResutl = otherHU;
                }

            }
        }
        actionArray = this.getSelfActionBarArray(paiNumber);


        if (actionArray.length > 1) {
            //if the action level is 3 ,show the level
            if (actionArray.join(",").indexOf("hu") >= 0) {
                this.showAction(actionArray);
                // showFlag = true;
            } else {
                //if other user no hu ,still show the bar action 
                if (otherUserResutl == false) {
                    this.showAction(actionArray);
                } else {
                    //other user can hu pai ,but him cancle this hu action 
                    if (type == "otherCancleHu") {
                        this.showAction(actionArray);
                    }
                }
            }

        } else {
            //go to next user mo pai 
        }

        return actionLevel;

    },
    showAction: function (actionArray) {
        //from right to left ,the x is reduce.
        console.log("showAction actionArray:" + actionArray.toString());
        var startX = 146;
        var actionWidthTemp = [];
        for (var j = 0; j < actionName.length; j++) {
            var node2 = cc.find(actionName[j] + "ActionNode", this.actionNode);
            node2.active = false;;
        }
        for (var i = 0; i < actionArray.length; i++) {
            var node = cc.find(actionArray[i] + "ActionNode", this.actionNode);
            node.active = true;
            node.x = startX
            for (var j = 0; j < actionName.length; j++) {
                if (actionName[j] == actionArray[i]) {
                    //actionWidthTemp.push(actionWidth[j]);
                    startX = startX - actionWidth[j] - 15;
                    console.log("startX:" + startX);
                }
            }
        }

        this.actionNode.active = true;
        this.actionNode.zIndex = 500;
        //disable user pai 

        tablePaiActionScript.disableAllSlefPai();
        console.log("startX:" + startX);



    },
    testPalyOtherChuPai: function () {
        var tableNode = cc.find("Canvas/tableNode");
        var user = tablePaiActionScript.getCorrectUserByOpenId("testUser2");
        var userChuPaiListNode = cc.find("user3PaiList", tableNode);
        // var chuPaiListNode = cc.find("user" + index + "ChuaPaiListNode",this.tableNode);
        var children = userChuPaiListNode.children;


        var node = null;
        for (var i = 0; i < children.length; i++) {

            if (children[i].name.indexOf("38") >= 0) {
                node = children[i];
            }

        }


        tablePaiActionScript.playSlefChuPaiAction(node, "3");
    },
    testMoPaiAction: function () {
        moPaiScript.moPaiAction("12", "testUser1");
        //tableCenterScript.index =2;
        //  moPaiScript.moPaiOnDataLayer("11", "testUser2");
        //  moPaiScript.moPaiOnDataLayer(paiNumber, toUserOpenid);
        //var user = tablePaiActionScript.getCorrectUserByOpenId("testUser2");
        //var paiListStr = user.paiList;
        // tableUserInfoNodeScript.initalOtherPaiListOnePai("11", user.paiListArray, user.pointIndex, "");

    },
    testMoPaiAction2: function () {
        moPaiScript.moPaiAction("24", "testUser2");

    },
    testMoPaiAction3: function () {
        moPaiScript.moPaiAction("14", "testUser3");

    },
    testMoPaiAction4: function () {
        moPaiScript.moPaiAction("38", "testUser4");

    },
    testHuPai: function () {

        this.fromUserOpenId = "testUser1";
        this.paiNumber = "12";
        this.chuPaiUserOpenId = "testUser4";
        // this.pengAction();
        var user = tablePaiActionScript.getCorrectUserByOpenId("testUser2");
        console.log("testHuPai:" + user.paiListArray.toString());
        //this.gangAction();
        console.log("testHuPai1:" + user.paiListArray.toString());
        //Global.huPreStep = "";
        //  this.preStep="";
        //this.testMoPaiAction();
        //this.fromUserOpenId = "testUser1";
        //this.chuPaiUserOpenId = "testUser2";
        //this.paiNumber = "15";
        //this.gangAction();
        this.huAction();
        // console.log("476");
        //tableNetWorkScript.countUserRoundScore();
        // console.log("477");
        //tableNetWorkScript.testScoreOutput();

        //  roundScoreUIScript.initalRoundScore();
        //  roundScoreUIScript.initalAllRoundScore();

    },
    testOtherPengPai: function () {


        // this.fromUserOpenId = "testUser2";
        // this.paiNumber = "15";
        // this.pengAction();
        // this.paiNumber = "29";
        //this.pengAction();
        // this.paiNumber = "24";
        // //this.pengAction();
        // this.paiNumber = "35";
        // //this.pengAction();

        // this.fromUserOpenId = "testUser1";
        // this.paiNumber = "16";
        // this.chuPaiUserOpenId = "testUser3";
        //this.gangAction();
        // this.paiNumber = "35";
        //this.chuPaiUserOpenId = "testUser2";
        //this.gangAction();
        //this.huAction();


    },
    testGangAction: function () {

    },
    countElementAccount: function (pai, paiList) {
        var count = 0;
        for (var i = 0; i < paiList.length; i++) {
            if (paiList[i] == pai) {
                count++
            }
        }

        return count

    },
    //------------------------Peng,Gang,Hu Action---------------------------------------

    pengAction: function () {



        this.preStep = "";
        var userInfo = Global.userInfo;
        var userOpenId = this.fromUserOpenId;
        var paiNumber = this.paiNumber;


        var nextUserOpenId = tableNetWorkScript.getNextUserByOpenId(userOpenId);
        //only work on the next user
        if (nextUserOpenId == userInfo.openid) {
            Global.nextUserOpenId = nextUserOpenId;
        } else {
            Global.nextUserOpenId = "";
        }


        //tableNetWorkScript.sendUpdateShowActionBarOnOtherUser(userOpenId,"","");
        console.log("pengAction paiNumber:" + paiNumber);
        var user = tablePaiActionScript.getCorrectUserByOpenId(userOpenId);
        var pointIndex = user.pointIndex;
        console.log("pointIndex:" + pointIndex);
        //data layer ------
        var paiList = user.paiListArray;
        paiList = this.removeElementByNumberFromUser(paiList, paiNumber, 2);
        console.log("pengAction paiList:" + paiList);
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
        console.log("pengAction:" + pointIndex);
        var endPoing = this.initalPengAndGangChuPaiList(userOpenId, paiNumber, "peng");
        if (pointIndex == "3") {
            tablePaiActionScript.removeAllNodeFromSelfPaiList();
            tableUserInfoNodeScript.intalSelfPaiList(user.paiList);
        } else {
            tablePaiActionScript.removeAllNodeFromOtherPaiList(pointIndex);
            //if (pointIndex != "2") 
            tableUserInfoNodeScript.initalOtherPaiList(user.paiList, pointIndex, "pengList", endPoing);
        }


        Global.chuPaiActionType = "peng";
        console.log("pengAction chuPaiUserOpenId:" + this.chuPaiUserOpenId);
        console.log("pengAction userInfo.openid:" + userInfo.openid);
        console.log("pengAction userOpenId:" + userOpenId);
        //remove last pai from chu pai list layer.
        tablePaiActionScript.removeLastPaiOnChuPaiListByUserOpenId(this.chuPaiUserOpenId, paiNumber);

        if (userInfo.openid == userOpenId) {
            tableNetWorkScript.sendPengPaiAction(userOpenId, paiNumber);
            this.actionNode.active = false;
            tablePaiActionScript.enabledAllPaiAfterQuePai();
            tableCenterScript.index = user.pointIndex;
            tableCenterScript.showCenterPoint();
            tableNetWorkScript.sendCenterIndex(user.openid);
        }


        audioScript.playAction("peng");
        // this.actionNode.active = false;
        // tablePaiActionScript.enabledAllPaiAfterQuePai();
    },
    gangAction: function () {
        var userInfo = Global.userInfo;
        var userOpenId = this.fromUserOpenId;
        var paiNumber = this.paiNumber;
        var user = tablePaiActionScript.getCorrectUserByOpenId(userOpenId);

        var nextUserOpenId = tableNetWorkScript.getNextUserByOpenId(userOpenId);
        //only work on the next user
        if (nextUserOpenId == userInfo.openid) {
            Global.nextUserOpenId = nextUserOpenId;
        } else {
            Global.nextUserOpenId = "";
        }

        var paiList = user.paiListArray;
        //check if it already contain 4 zhang pai in the pai list

        for (var i = 0; i < paiList.length; i++) {
            //var paiArrayCache = []
            var pai = paiList[i] + "";
            pai = pai.trim();
            var count = this.countElementAccount(pai, paiList);
            if (count == 4) {
                paiNumber = pai;
            }
            this.preStep = "zigang";
        }
        console.log("gang 647");
        var pointIndex = user.pointIndex;
        var isZiGangFlag = true;
        //data layer ------

        var pengList = user.pengPaiList;
        var gangList = user.gangPaiList;
        var gangFromUserList = user.gangFromUserListOpenId;
        if (gangFromUserList == null || gangFromUserList == undefined) {
            gangFromUserList = [];
        }
        Global.gangFromUserOpenId = this.chuPaiUserOpenId;

        Global.gangFromUserOpenIdCache = this.fromUserOpenId;
        Global.gangChuPaiUserOpenIdCache = this.chuPaiUserOpenId;
        gangFromUserList.push(this.chuPaiUserOpenId);
        user.gangFromUserListOpenId = gangFromUserList;
        //zi gang or pa gang 
        var gangTypeList = user.gangTypeList;
        if (gangTypeList == null || gangTypeList == undefined || gangTypeList == "") {
            gangTypeList = [];
        }
        //GET THE user list when it gang
        var gangExistUser = user.gangExistUser;
        if (gangExistUser == null || gangExistUser == undefined) {
            gangExistUser = [];
        }
        var gangExistUserCache = user.gangExistUserCache;
        if (gangExistUserCache == null || gangExistUserCache == undefined) {
            gangExistUserCache = [];
        }

        var userList2 = Global.userList;


        //check if pa gang only on self  
        if (pengList == null || pengList == undefined) {
            pengList = [];
        }
        for (var i = 0; i < pengList.length; i++) {
            var pengPai = pengList[i] + "";
            pengPai = pengPai.trim();
            if (pengPai == paiNumber + "") {
                pengList.splice(i, 1);
                user.pengPaiList = pengList;
                //gangTypeList.push("1");
                isZiGangFlag = false;
                //gangList.push(paiNumber); 
            }
        };
        console.log("gangAction source pai:" + paiNumber);
        console.log("gangAction paiList:" + paiList.toString());
        paiList = this.removeAllElementByNumberFromUser(paiList, paiNumber);
        //if the gang pai from other user.
        if (userOpenId != this.chuPaiUserOpenId) {
            tablePaiActionScript.removeLastPaiOnChuPaiListByUserOpenId(this.chuPaiUserOpenId, paiNumber);
        }
        if (userOpenId == this.chuPaiUserOpenId) {

            //remove the mo pai on this 
            if (user.userMoPai == paiNumber) {

                //remove the mopai 
                user.userMoPai = "";
                tablePaiActionScript.updateUserListInGobal(user);
                var children = this.user3PaiListNode.children;
                var moPaiNode = null;
                for (var i = 0; i < children.length; i++) {
                    var lastNode = children[i];
                    if (lastNode.name.indexOf("mopai") >= 0) {
                        lastNode.removeFromParent();
                    }
                }

                this.preStep = "zigang";

            } else {
                this.preStep = "gang";
            }
        } else {

            this.preStep = "gang";
        }
        Global.gangHuPai = paiNumber;
        console.log("gangAction  this.preStep:" + this.preStep);
        console.log("gangAction paiList:" + paiList);
        user.paiListArray = paiList;

        if (gangList == null || gangList == undefined) {
            gangList = [];
        }

        gangList.push(paiNumber);
        user.gangPaiList = gangList;
        //--------------GANG USER---------------------

        var existUserString = "";
        var existUserStringCache = "";
        for (var i = 0; i < userList2.length; i++) {
            var user2 = userList2[i];
            if (user2.huPai != null && user2.huPai != undefined && user2.huPai != "") {
            } else {
                //gang from self mo pai, every body should in this gang
                //if (this.chuPaiUserOpenId == user.openid) {
                if (user2.openid != this.fromUserOpenId) {
                    existUserString = existUserString + user2.openid + ";"
                    existUserStringCache = existUserStringCache + user2.openid + ";"
                }
                //}
            }
        }
        gangExistUserCache.push(existUserStringCache);
        if (this.chuPaiUserOpenId != user.openid) {
            existUserString = this.chuPaiUserOpenId;
        }

        if (existUserString.substring(existUserString.length - 1) == ";") {
            existUserString = existUserString.substring(0, existUserString.length - 1);
        }

        gangExistUser.push(existUserString);
        user.gangExistUser = gangExistUser;
        user.gangExistUserCache = gangExistUserCache;
        console.log(" user.gangExistUser:" + user.gangExistUser);
        //gangExistUserCache
        if (isZiGangFlag) {
            gangTypeList.push("2");
        } else {
            gangTypeList.push("1");
        }
        //gangTypeList.push("2");
        user.gangTypeList = gangTypeList;
        console.log("user.gangTypeList0:" + gangTypeList);
        console.log("user.gangTypeList1:" + gangTypeList[0]);
        // mopai 
        //update user to gobal
        user = tablePaiActionScript.synchronizationPaiList(user);
        tablePaiActionScript.updateUserListInGobal(user);
        //data layer end -------------------------------------
        //-------show user pai list-----------------
        console.log("gangAction:" + pointIndex);
        var endPoint = this.initalPengAndGangChuPaiList(userOpenId, paiNumber, "gang");
        if (pointIndex == "3") {
            tablePaiActionScript.removeAllNodeFromSelfPaiList();
            tableUserInfoNodeScript.intalSelfPaiList(user.paiList);
        } else {
            tablePaiActionScript.removeAllNodeFromOtherPaiList(pointIndex);
            // if (pointIndex != "2") {
            tableUserInfoNodeScript.initalOtherPaiList(user.paiList, pointIndex, "gang", endPoint);
            //  }
        }


        Global.huPreStep = "gang";
        Global.chuPaiActionType = "gang";
        console.log("0 gang:" + Global.chuPaiActionType);
        //remove last pai from chu pai user
        console.log("userInfo.openid:" + this.chuPaiUserOpenId);
        // if (userOpenId != this.chuPaiUserOpenId) {

        console.log("userInfo.openid:" + userInfo.openid);
        console.log("userOpenId:" + userOpenId);
        if (userInfo.openid == userOpenId) {
            tableNetWorkScript.sendGangPaiAction(this.chuPaiUserOpenId, userOpenId, paiNumber, gangTypeList);
            this.actionNode.active = false;
            //mopai
            tableNetWorkScript.sendMoPaiOnSelecAction(user.openid);
            //enable pai 
            tablePaiActionScript.enabledAllPaiAfterQuePai();
            tableCenterScript.index = user.pointIndex;
            tableCenterScript.showCenterPoint();
            tableNetWorkScript.sendCenterIndex(user.openid);
        }
        // this.actionNode.active = false;
        // tablePaiActionScript.enabledAllPaiAfterQuePai();

        console.log("gang:" + Global.huPreStep);
        audioScript.playAction("gang");

    },


    setZhuangOnFirstHU: function () {
        console.log("setZhuangOnFirstHU: 803");
        var userList = Global.userList;
        var huPaiNumer = 0;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            if (user.huPai != null && user.huPai != undefined && user.huPai != "") {
                huPaiNumer++;
            }
        }

        if (huPaiNumer == 1) {
            for (var i = 0; i < userList.length; i++) {
                var user2 = userList[i];
                if (user2.huPai != null && user2.huPai != undefined && user2.huPai != "") {
                    user2.zhuang = "1";
                    Global.zhuangOpenId = user2.openid;
                    console.log("setZhuangOnFirstHU: 818=" + user2.openid + "--" + user2.nickName);
                } else {
                    user2.zhuang = "";
                }
            }
            //update user list to Global
            Global.userList = userList;
        }
    },

    huAction: function () {
        var gameMode = Global.gameMode;
        if (this.preStep == null || this.preStep == undefined || this.preStep == "") {
            this.preStep = "normalChuPai"
        }

        var userInfo = Global.userInfo;
        var userOpenId = this.fromUserOpenId;
        var chupaiOpenId = this.chuPaiUserOpenId;

        var nextUserOpenId = tableNetWorkScript.getNextUserByOpenId(userOpenId);
        //only work on the next user
        if (nextUserOpenId == userInfo.openid) {
            Global.nextUserOpenId = nextUserOpenId;
        } else {
            Global.nextUserOpenId = "";
        }

        //var nextUserOpenId = this.getNextUserByOpenId(fromUserOpenid);





        console.log("huAction pai:" + this.paiNumber);
        if (Global.chuPaiActionType == null || Global.chuPaiActionType == undefined) {
            Global.chuPaiActionType = "";
        }
        huPaiScript.huPaiAction(this.paiNumber, this.fromUserOpenId, Global.chuPaiActionType);
        console.log("huAction pai 891:" + this.fromUserOpenId);
        console.log("huAction pai 892:" + Global.chuPaiActionType);
        //cache the user hupai information
        var user = tablePaiActionScript.getCorrectUserByOpenId(userOpenId);
        user.huPai = this.paiNumber;
        user.huPaiFromUser = this.chuPaiUserOpenId;
        //user.huchuPaiType = this.preStep;
        user.huchuPaiType = Global.huPreStep;
        //Global.huPreStep
        user.gangFromUserOpenIdCache = Global.gangFromUserOpenIdCache;

        var userList2 = Global.userList;
        var existUserString = "";
        console.log("hu gang:" + Global.chuPaiActionType);
        if (Global.huPreStep == "gang") {
            if (Global.userInfo.openid != userOpenId) {
            } else {
                user.huGangShangHuaChuPaiUserOpenId = this.chuPaiUserOpenId;
                user.huGangPaiInOtherUserFromOpenId = Global.gangFromUserOpenId;
            }
            console.log("hu huGangShangHuaChuPaiUserOpenId:" + user.huGangShangHuaChuPaiUserOpenId + "---" + user.openid)

        } else {
            // user.huGangShangHuaChuPaiUserOpenId = "";
        }
        //zi mo add all not hu user into exist user 
        if (userOpenId == chupaiOpenId || (gameMode.dianGangHua_ziMo + "" == "1" && Global.huPreStep == "gang")) {
            for (var i = 0; i < userList2.length; i++) {
                var user2 = userList2[i];
                if (user2.huPai != null && user2.huPai != undefined && user2.huPai != "") {
                } else {
                    if (user2.openid != userInfo.openid) {
                        existUserString = existUserString + user2.openid + ";"
                    }
                }
            }


        } else {

            //dian pao 
            existUserString = chupaiOpenId;
        }

        if (existUserString.length > 0) {
            if (existUserString.substring(existUserString.length - 1) == ";") {
                existUserString = existUserString.substring(0, existUserString.length - 1);
            }
        }
        console.log("existUserString 753:" + existUserString);
        console.log("existUserString 753 user:" + user.openid);
        console.log("existUserString 885 user:" + user.existUserString);
        if (Global.userInfo.openid != userOpenId) {
        } else {
            //only setting this on the hu pai user 
            user.existUserString = existUserString;

        }

        var pointIndex = user.pointIndex;
        tablePaiActionScript.updateUserListInGobal(user);

        //now we need set the zhuang jia on the first hu
        this.setZhuangOnFirstHU();
        if (userOpenId == chupaiOpenId) {
            audioScript.playAction("zimo");
        } else {
            audioScript.playAction("hu");
        }


        //self user send the hupai to other user
        console.log("hu userOpenId:" + userOpenId);
        console.log("hu userInfo.openid:" + userInfo.openid);
        if (userOpenId == userInfo.openid) {
            tableNetWorkScript.sendHuPaiAction(userOpenId, chupaiOpenId, this.paiNumber, Global.chuPaiActionType, this.preStep, existUserString, Global.gangFromUserOpenId, this.otherUserActionString);
            this.actionNode.active = false;
            tablePaiActionScript.disableAllSlefPai();
            //remove mopai 
               console.log("1033:"+chupaiOpenId);
            if (userOpenId == chupaiOpenId) {
                var tableNode = cc.find("Canvas/tableNode");
                var userPaiListNode = cc.find("user" + pointIndex + "PaiList", tableNode);
                var children = userPaiListNode.children;
                for (var i = 0; i < children.length; i++) {
                    var cNode = children[i];
                    console.log("1039:"+cNode.name);
                    if (cNode.name.indexOf("mopai") >= 0) {
                        cNode.removeFromParent();
                    }
                }
            }
            //otherUserActionString
            //if here no other action ,check if the round end ,if it should move to next user
            //if here exist other action ,it should send the action to server and wait other action

            tableCenterScript.showCenterPoint();
            tableNetWorkScript.sendCenterIndex(user.openid);
        }


        if (userInfo.openid == userOpenId) {
            tableNetWorkScript.sendUpdateShowActionBarOnOtherUser(userOpenId, "hudone", "");
        }

    },


    initalPengAndGangChuPaiList: function (userOpenId, paiNumber, type) {

        var user = tablePaiActionScript.getCorrectUserByOpenId(userOpenId);
        var pointIndex = user.pointIndex;
        var tableNode = cc.find("Canvas/tableNode");
        var userPengPaiListNode = cc.find("user" + pointIndex + "PengPaiListNode", tableNode);
        userPengPaiListNode.removeAllChildren();
        console.log("166:" + userPengPaiListNode.children.length)
        var pengList = user.pengPaiList;
        var gangPaiList = user.gangPaiList;
        var paiList = user.paiListArray;
        var x = 0;
        var y = 0;
        //inital the orlder inital  value 
        pengOrder = 100;
        if (pointIndex == "3") {
            user.pengGangPaiPoint = 410;
            y = 0;
            x = user.pengGangPaiPoint;
        } else if (pointIndex == "1") {
            user.pengGangPaiPoint = -200;
            y = 0;
            x = user.pengGangPaiPoint;
        } else if (pointIndex == "2") {
            user.pengGangPaiPoint = -210;



            y = user.pengGangPaiPoint;
            x = 0;
        } else if (pointIndex == "4") {
            user.pengGangPaiPoint = 130;
            y = user.pengGangPaiPoint;
            x = 0;
        }


        this.showPengGangPaiListOnTalbe(pengList, gangPaiList, pointIndex, paiNumber, userPengPaiListNode, type, x, y)
        console.log("end");
        var endPoint = this.getEndPoint(pengList, gangPaiList, pointIndex, paiNumber, userPengPaiListNode, type, x, y);
        // return endPoint;
        return endPoint

    },

    getEndPoint: function (pengList, gangList, pointIndex, paiNumber, userPengPaiListNode, type, x, y) {
        var finalX = x;
        var finalY = y;
        var endPoint;
        if (pengList != null && pengList != undefined) {
            for (var i = 0; i < pengList.length; i++) {
                //get final point for gang
                for (var j = 1; j < 4; j++) {

                    var point0 = this.getCorrectPointByIndex(pointIndex, finalX, finalY);
                    finalX = point0[0];
                    finalY = point0[1];
                    console.log("endPoint finalX:" + finalX);
                }
            }
        }

        if (gangList != null && gangList != undefined) {
            for (var k = 0; k < gangList.length; k++) {
                for (var j = 1; j < 4; j++) {
                    var point = this.getCorrectPointByIndex(pointIndex, finalX, finalY);
                    finalX = point[0];
                    console.log("endPoint finalX 2:" + finalX);
                    finalY = point[1];
                }
            }
        }
        //get final end point 
        if (pointIndex == "1") {
            endPoint = finalX;
            console.log("endPoint:" + endPoint);
        } else if (pointIndex == "3") {
            endPoint = finalX;
        } else if (pointIndex == "2") {
            endPoint = finalY;
        } else {
            endPoint = finalY;
        }

        return endPoint;

    },

    showPengGangPaiListOnTalbe: function (pengList, gangList, pointIndex, paiNumber, userPengPaiListNode, type, x, y) {


        var isGangFlagList = [];
        var finalX = x;
        var finalY = y;
        var endPoint;
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

                // eval("console.log( 'isGang 216:'+  isGang" + paiNumber+")");
                var paiPath = tablePaiActionScript.getChuPaiNameByNodeName(tempPai, pointIndex);
                var middlePoint = null;
                // console.log("isGang loadRes:" + isGang);
                cc.loader.loadRes(paiPath, cc.SpriteFrame, function (err, sp) {
                    if (err) {
                        console.log("----" + err.message || err);
                        return;
                    }


                    var sencodPaiX = -1;
                    var sencodPaiY = -1;
                    for (var j = 1; j < 4; j++) {
                        var pNode = cc.instantiate(this.paiChuPaiNode);
                        pNode.name = "pengpai" + pointIndex + "_" + paiNumber;
                        pNode.active = true;
                        console.log("peng x:" + x + "-----y:" + y);
                        pNode.position = cc.p(x, y);
                        if (j == 2) {
                            sencodPaiX = x;
                            sencodPaiY = y;
                        }


                        if (pointIndex == "2") {
                            pNode.setLocalZOrder(Math.abs(pengOrder));
                            pNode.zIndex = Math.abs(pengOrder);
                            //pNode.siblingIndex = pengOrder;
                            pengOrder--;
                            console.log("siblingIndex:" + pengOrder)
                            userPengPaiListNode.setLocalZOrder(121);
                            userPengPaiListNode.zIndex = 121;


                        }

                        if (pointIndex == "4") {
                            userPengPaiListNode.setLocalZOrder(139);
                            userPengPaiListNode.zIndex = 139;
                            //console.log("4 zindex:" + pNode.zIndex);
                            // console.log("4 setLocalZOrder:" + pNode.getLocalZOrder());
                        }
                        var point = this.getCorrectPointByIndex(pointIndex, x, y);
                        x = point[0];
                        y = point[1];
                        // pengOrder=point[2];



                        var sprite = pNode.getComponent(cc.Sprite);
                        sprite.spriteFrame = sp;
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
                cc.loader.loadRes(paiPath, cc.SpriteFrame, function (err, sp) {
                    if (err) {
                        console.log("----" + err.message || err);
                        return;
                    }


                    var sencodPaiX = -1;
                    var sencodPaiY = -1;
                    for (var m = 1; m < 4; m++) {
                        var pNode = cc.instantiate(this.paiChuPaiNode);
                        pNode.name = "pengpai" + pointIndex + "_" + paiNumber;
                        pNode.active = true;
                        console.log("gang m:" + m);
                        console.log("gang x:" + finalX + "-----y:" + finalY);
                        pNode.position = cc.p(finalX, finalY);
                        if (m == 2) {
                            sencodPaiX = finalX;
                            sencodPaiY = finalY;
                        }

                        if (pointIndex == "2") {
                            pNode.setLocalZOrder(Math.abs(pengOrder));
                            pNode.zIndex = Math.abs(pengOrder);
                            pengOrder--;
                        }

                        var point = this.getCorrectPointByIndex(pointIndex, finalX, finalY);
                        finalX = point[0];
                        finalY = point[1];

                        var sprite = pNode.getComponent(cc.Sprite);
                        sprite.spriteFrame = sp;
                        userPengPaiListNode.addChild(pNode);
                    }



                    //if (singleIsGang == true) {
                    var pNode2 = cc.instantiate(this.paiChuPaiNode);
                    if (pointIndex == "3") {
                        sencodPaiY = sencodPaiY + 15;
                    } else if (pointIndex == "1") {
                        sencodPaiY = sencodPaiY + 15;
                    } else if (pointIndex == "2") {
                        sencodPaiY = sencodPaiY + 15
                    } else {
                        sencodPaiY = sencodPaiY + 15

                    }

                    console.log("isGang paiNumber:" + paiNumber);
                    console.log("isGang paiPath:" + paiPath);

                    pNode2.name = "pengpai" + pointIndex + "_gang" + paiNumber;
                    pNode2.active = true;
                    if (pointIndex == "2") {
                        pNode2.setLocalZOrder(Math.abs(pengOrder + 100));
                        pNode2.zIndex = Math.abs(pengOrder + 100);
                    }
                    console.log("gang x:" + finalX + "-----y:" + finalY);
                    pNode2.position = cc.p(sencodPaiX, sencodPaiY);
                    console.log("sencodPaiX:" + sencodPaiX);
                    console.log("sencodPaiY:" + sencodPaiY);
                    var sprite2 = pNode2.getComponent(cc.Sprite);
                    sprite2.spriteFrame = sp;
                    userPengPaiListNode.addChild(pNode2);
                    //isGang = false;

                    // }

                }.bind(this));
            }
        }

    },

    getCorrectPointByIndex: function (pointIndex, x, y) {
        var point = [];
        var sourceY = y;
        if (pointIndex == "3") {
            x = x - 42;
        } else if (pointIndex == "1") {

            x = x + 42;

        } else if (pointIndex == "2") {

            y = y + 35;
        } else {
            y = y - 35;
        }
        if (Math.abs(sourceY) < Math.abs(y)) {
            sourceY = Math.abs(sourceY) - 1;

        }

        point.push(x);
        point.push(y);
        point.push(pengOrder);
        return point;

    },
    closeActionBar: function () {
        this.actionNode.active = false;
        var huNode = cc.find("huActionNode", this.actionNode);
        if (huNode.active == true) {
            //send cancle hu to user.
        }
        //send cancle action to mo pai user
        var userInfo = Global.userInfo;

        this.preStep = "";

        tableNetWorkScript.sendUpdateShowActionBarOnOtherUser(this.fromUserOpenId, "", "");
        if (this.chuPaiUserOpenId == this.fromUserOpenId) {
            tablePaiActionScript.enabledAllPaiAfterQuePai();
        } else {
            if (this.otherUserActionString != null && this.otherUserActionString != "") {
                //show other user pai 
                // var obj = JSON.parse(this.otherUserActionString);
                //tableNetWorkScript.sendShowActionBarOnOtherUser(obj.userOpenId, obj.actionArray.toString(), obj.paiNumber, "");
            } else {

            }
            // tableNetWorkScript.sendCacleToMoPaiAction(userInfo.openid, this.otherUserActionString);
            tablePaiActionScript.disableAllSlefPai();
            console.log("disableAllSlefPai :closeActionBar");
        }
        console.log("tablePaiActionScript :closeActionBar");

        //tablePaiActionScript.enabledAllPaiAfterQuePai();

    },


    //-----------------Action end-------------------------------------------------------
    removeAllElementByNumberFromUser: function (paiList, paiNumber) {
        paiNumber = paiNumber + "";
        paiNumber = paiNumber.trim();
        var tempList = [];
        for (var i = 0; i < paiList.length; ++i) {
            var temp = paiList[i] + "";
            temp = temp.trim();
            if (temp == paiNumber) {
                //paiList.splice(i, 1);
            } else {
                tempList.push(temp);
            }

        }

        return tempList
    },
    //  removeElementByNumberFromUser: function (paiList, paiNumber, b) {
    //      var tempList=[];
    //       for (var i = 0; i < paiList.length; ++i) {
    //             var temp = paiList[i] + "";
    //             temp = temp.trim();
    //             if (temp == paiNumber) {
                   
    //             }

    //         }
    //  },

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

        //only for test peng pai
        // if (paiList.length > 1)
        //     paiList.splice(0, 1);

        //onely for test end

        console.log("peng pai list:" + paiList);
        return paiList;

    },


});