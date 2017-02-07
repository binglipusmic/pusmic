var actionWidth = [];
var actionName = [];
var tablePaiActionScript;
var tableUserInfoNodeScript;
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
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    testShowAction: function () {
        var actionArray = ['cancle', 'gang', 'peng'];
        this.showAction(actionArray);
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

    pengAction: function (userOpenId, paiNumber) {
        var user = tablePaiActionScript.getCorrectUserByPoint(userOpenId);
        var pointIndex = user.pointIndex;
        //data layer ------
        var paiList = user.paiListArray;
        paiList = removeElementByNumberFromUser(paiList, paiNumber, 2);
        user.paiListArray = paiList;
        var pengList = user.pengPaiList;
        pengList.push(paiNumber);
        user.pengPaiList = pengList;
        //update user to gobal
        tablePaiActionScript.updateUserListInGobal(user);
        //data layer end -------------------------------------
        //-------show user pai list-----------------
        if (pointIndex == "3") {
            tablePaiActionScript.removeAllNodeFromSelfPaiList();
            tableUserInfoScript.intalSelfPaiList(user.paiList);
        } else {
            tablePaiActionScript.removeAllNodeFromOtherPaiList(pointIndex);
            tableUserInfoScript.initalOtherPaiList(paiList,pointIndex);
        }
      


        //fix the pengpai list point 
        if (user.pengGangPaiPoint == 0) {
            if (pointIndex == "3") {
                user.pengGangPaiPoint = 600;
            } else if (pointIndex == "1") {
                user.pengGangPaiPoint = -410;
            } else if (pointIndex == "2") {
                user.pengGangPaiPoint = -250;
            } else if (pointIndex == "4") {
                user.pengGangPaiPoint = 250;
            }
        }


        var moveX = 0;
        var moveY = 0;
        //self peng pai action

        if (user.pointIndex == "3") {
            // user.pengGangPaiPoint= user.pengGangPaiPoint-42*3
        } else {
            //other pai action 
        }

    },

    gangAction: function (userOpenId, paiNumber) {

    },

    huAction: function (userOpenId, paiNumber) {

    },


    //-----------------Action end-------------------------------------------------------

    removeElementByNumberFromUser: function (paiList, paiNumber, b) {
        var c = 0;

        for (var i = 0; i < paiList.length; ++i) {
            var temp = paiList[i] + "";
            temp = temp.trim();
            if (temp == paiNumber) {
                paiList.splice(i, 1);
                c++;
                if (c == b) {
                    break;
                }

            }

        }

        return paiList

    },


});
