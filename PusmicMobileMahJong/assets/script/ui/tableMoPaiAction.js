
var tableActionScript;
var tableUserInfoScript;
var paiActionScript;
var tableUserPaiScript;
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
        tableAction: cc.Node,
        liPaiPrefab: cc.Prefab,
        user3PaiListNode: cc.Node,
        tableUserInfo: cc.Node,
        paiActionNode: cc.Node,
        tableUserPaiNode: cc.Node,
    },



    // use this for initialization
    onLoad: function () {
        tableActionScript = this.tableAction.getComponent("tablePaiAction");
        tableUserInfoScript = this.tableUserInfo.getComponent("tableUserInfo");
        paiActionScript = this.paiActionNode.getComponent("paiAction");
        //tableUserPaiScript =this.tableUserPaiNode.getComponent("tablePaiAction");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    moPaiFromServer: function (userOpenId) {

    },
    moPaiTest: function () {
        this.moPaiAction("15", "testUser2");
    },

    moPaiOnDataLayer: function (paiNumber, userOpenId) {
        //---data layer-----------------
        var userList = Global.userList;
        var user
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userOpenId) {
                user = userList[i];
                //break;
            }
        }
        user.userMoPai = paiNumber;
        user = tableActionScript.insertMoPaiIntoPaiList(user);
        user = tableActionScript.synchronizationPaiList(user);
        cc.log("moPaiOnDataLayer mopai:" + user.userMoPai);
        this.updateUserListInGobal(user);
    },

    moPaiAction: function (paiNumber, userOpenId) {
        var paiList = tableActionScript.getSelfPaiList();
        var latstIndex = 0;
        if (paiList.length == 13) {
            latstIndex = 13
        } else {
            latstIndex = paiList.length;
        }
        var paiNode = cc.instantiate(this.liPaiPrefab);
        var sprite = paiNode.getComponent(cc.Sprite);
        paiNode.name = "mopai" + latstIndex + "_" + paiNumber;

        var index = tableUserInfoScript.getCurrectIndeOnSeflPai(paiNumber);
        sprite.spriteFrame = tableUserInfoScript.liPaiZiMian[index]
        this.user3PaiListNode.addChild(paiNode);
        var startPoint = -520;
        if (paiList.length <= 10) {
            startPoint = parseInt(-520 + (10 - paiList.length) * 79 / 2)
        } else {

        }

        paiNode.position = cc.p(startPoint + latstIndex * 80, 0);


        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);

        tableActionScript.enabledAllPaiAfterQuePai(parentNode, false);
        Global.chuPaiActionType = "normalMoPai";
        //check if show gang action on this paiList
        // var paiCount = 0;
        // for (var i = 0; i < paiList.length; i++) {
        //     var pai = paiList[i] + "";
        //     pai = pai.trim();
        //     if (pai == paiNumber) {
        //         paiCount++
        //     }
        // }
        // if (paiCount == 3) {
        //     var actionArray = ['cancle', 'gang'];
        //     paiActionScript.fromUserOpenId = userOpenId;
        //     paiActionScript.paiNumber = paiNumber;
        //     paiActionScript.chuPaiUserOpenId = userOpenId;
        //     paiActionScript.showAction(actionArray);
        // }
        this.moPaiOnDataLayer(paiNumber, userOpenId);
        var actionArray = paiActionScript.getActionBarArrayByOpenId(paiNumber, userOpenId, "mopai");

        if (actionArray.length > 1) {
            paiActionScript.fromUserOpenId = userOpenId;
            paiActionScript.paiNumber = paiNumber;
            paiActionScript.chuPaiUserOpenId = userOpenId;
            paiActionScript.showAction(actionArray);

            tableActionScript.disableAllSlefPai();

        } else {

        }

        //we need update this into gobal user list
        //this.updateUserListInGobal(user);



    },

    updateUserListInGobal: function (user) {
        var userList = Global.userList;

        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == user.openid) {
                userList[i] = user;

            }
        }
        Global.userList = userList;

    },


});
