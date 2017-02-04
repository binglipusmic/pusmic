
var tableActionScript;
var tableUserInfoScript;
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
        tableUserInfo : cc.Node,
    },



    // use this for initialization
    onLoad: function () {
        tableActionScript = this.tableAction.getComponent("tablePaiAction");
        tableUserInfoScript = this.tableUserInfo.getComponent("tableUserInfo");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    moPaiTest: function () {
        this.moPaiAction("15","testUser2");
    },

    moPaiAction: function (paiNumber,userOpenId) {
        var paiList = tableActionScript.getSelfPaiList();
        var latstIndex = 0;
        if (paiList.length == 13) {
            latstIndex = 13
        } else {
            latstIndex = paiList.length + 1;
        }
        var paiNode = cc.instantiate(this.liPaiPrefab);
        var sprite = paiNode.getComponent(cc.Sprite);
        paiNode.name = "pai" + latstIndex + "_" + paiNumber;

        var index = tableUserInfoScript.getCurrectIndeOnSeflPai(paiNumber);
        sprite.spriteFrame = tableUserInfoScript.liPaiZiMian[index]
        this.user3PaiListNode.addChild(paiNode);
        paiNode.position = cc.p(-520 + latstIndex * 80, 0);
        //---data layer-----------------
       var userList = Global.userList;
       var user
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userOpenId) {
                user=userList[i] ;
                break;
            }
        }
        user.userMoPai=paiNumber;
        this.updateUserListInGobal(user);


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
