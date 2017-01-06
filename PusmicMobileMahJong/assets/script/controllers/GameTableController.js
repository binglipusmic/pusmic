var gameMode;
var userInfo;
var serverUrl;
var socket;
var roomNumber;
var messageDomain;
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
        user1Node: cc.Node,
        user2Node: cc.Node,
        user3Node: cc.Node,
        user4Node: cc.Node,
        userReadyOK: cc.SpriteFrame,
        userReadyNotOk: cc.SpriteFrame

    },

    // use this for initialization
    onLoad: function () {
        this.user1Node.active = false;
        this.user2Node.active = false;
        this.user3Node.active = false;
        this.user4Node.active = false;
    },

    showUserInfo: function () {
        var userList = Global.userList;
        if (userList != null && userList != undefined) {
            for (var i = 0; i < userList.length; i++) {
                var user = userList[i];
            }
        }
    },

    initalUserInfoFromGobalList: function () {
        var numberOrder = [3, 4, 1, 2]
        var userList = Global.userList;
        var userInfo = Global.userInfo;
        var index = -1;
        if (userList != null && userList != undefined) {
            var tempList = [];
            //1.find the start index
            for (var i = 0; i < userList.length(); i++) {
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

            if (index > 0) {
                for (var i = 0; i < index; i++) {
                    tempList.push(userList[i]);
                }
            }

            //start fill the user info from index 
            for (var i = 0; i < tempList.length(); i++) {
                var gameUser = tempList[i];
                var userNodeName = "user" + numberOrder[i] + "Node";
                var userNode = cc.find(userNodeName, this.tableNode);
                userNode.active = true;
                var userInfoNode = cc.find("userInfoNode", userNode);
                var userReadyNode = cc.find("userReadyNode", userInfoNode);
                var readyButton = cc.find("readyButton", userReadyNode);
                var s = readyButton.getComponent(cc.Sprite);
                if (gameUser.gameReadyStatu == "1") {
                    s.spriteFrame = this.userReadyOK
                } else {
                    s.spriteFrame = this.userReadyNotOk
                }


            }

        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
