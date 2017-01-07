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
    },

    // use this for initialization
    onLoad: function () {
        this.userInfo1.active = false;
        this.userInfo2.active = false;
        this.userInfo3.active = false;
        this.userInfo4.active = false;

    },

    initalUserInfoFromGobalList: function () {
        var numberOrder = [3, 4, 1, 2]
        var userList = Global.userList;
        var userInfo = Global.userInfo;
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

            if (index > 0) {
                for (var i = 0; i < index; i++) {
                    tempList.push(userList[i]);
                }
            }

            //start fill the user info from index 
            for (var i = 0; i < tempList.length; i++) {
                var user=tempList[i];
                var userNodeName = "user" + numberOrder[i] + "Node";
                var testHeaImageurl = "http://wx.qlogo.cn/mmopen/Po9mkm3Z42tolYpxUVpY6mvCmqalibOpcJ2jG3Qza5qgtibO1NLFNUF7icwCibxPicbGmkoiciaqKEIdvvveIBfEQqal8vkiavHIeqFT/0";
                var userNode = cc.find(userNodeName, this.tableNode);
                var userInfoNode = cc.find("userInfoNode", userNode);
                var userNickNameNode = cc.find("userNickNameBg", userInfoNode);
                var userNickNameLableNode=cc.find("userNickName", userNickNameNode);
                cc.loader.load({url: testHeaImageurl, type: 'png'},function (err, texture) {
                    var frame = new cc.SpriteFrame(texture);
                    userInfoNode.getComponent(cc.Sprite).spriteFrame = frame;
                });

                var userNickNameLable=userNickNameLableNode.getComponent(cc.Label);
                userNickNameLable.string=user.nickName;
                userNode.active=true;
            }

        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
