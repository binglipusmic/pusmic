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
    },

    // use this for initialization
    onLoad: function () {
        this.userInfo1.active = false;
        this.userInfo2.active = false;
        this.userInfo3.active = false;
        this.userInfo4.active = false;

        this.initalUserPai();

    },
    //this function only inital a gaobal user list for test 
    testInitalUserList: function () {
        var paiList = ["11, 11, 13, 14, 18, 21, 24, 32, 33, 34, 34, 35, 36, 39",
            "15, 17, 18, 22, 25, 26, 29, 31, 32, 33, 36, 37, 39",
            "16, 17, 19, 23, 23, 24, 27, 31, 32, 33, 33, 34, 36,37",
            "15, 17, 18, 18, 22, 22, 25, 26, 28, 28, 29, 34, 38",
        ];
        var userList = [];
        for (var i = 0; i < 5; i++) {
            var o = new Object();
            o.id = i;
            o.nickName = "testUser" + i;
            o.headImageFileName = "testUser" + i + ".jpg";
            o.diamondsNumber = "30";
            o.country = "CN";
            o.openid = "testUser" + i;
            o.unionid = "testUser" + i;
            o.userCode = "testUser" + i;
            o.publicIp = "127.0.0.1";
            o.paiList = paiList[i];
            o.gameReadyStatu = "1";
            o.gameScoreCount = "1";
            o.pointIndex = i + 1;
            o.headImageFileName = "1";
            if (i == 0) {
                o.zhuang = "1";
            } else {
                o.zhuang = "0";
            }

            userList.push(o);

        }

        Global.userList = userList;

    },
    initalUserPai: function () {
        //inital the test data
        this.testInitalUserList();
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
        for (var i = 0; i < userList.length - 1; i++) {
            var user = userList[i];
            //show current user node
            if (user.pointIndex != null && user.pointIndex != undefined) {
                cc.log(user.pointIndex);
                //fix user point
                if (user.pointIndex != "3") {
                    eval("this.userInfo" + user.pointIndex + ".active = true");
                    this.fixUserPointByIndex(user.pointIndex);

                }

                var paiList = user.paiList;
                if (paiList != null && paiList != undefined) {
                    if ((user.pointIndex + "") == "3") {
                        //inital self pai
                        user.paiListArray = this.intalSelfPaiList(paiList);
                    } else {
                        user.paiListArray = this.initalOtherPaiList(paiList, user.pointIndex)
                        //intal other user pai
                    }

                }



            }
        }

        //put back the user list to gobal

         Global.userList=userList;


    },

    initalOtherPaiList: function (paiList, point) {
        var paiArray = paiList.split(",");
        var startX = 0;
        var startY = 0;
        //cc.log("********initalOtherPaiList:" + paiList + "----" + point);
        for (var i = 0; i < paiArray.length; i++) {
            if (paiArray[i] != null && paiArray[i] != undefined) {

                var paiNode;
                var sprite;
                paiNode = cc.instantiate(this.backNode);
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


                eval("this.user" + point + "PaiListNode.addChild(paiNode)");
                //fix the user 1
                if (point == "1") {
                    startX = -380;
                    paiNode.rotation = 180;
                    paiNode.position = cc.p(startX + i * 55, 0);
                }

                if (point == "2") {
                    startX = 0;
                    startY = 180;
                    paiNode.position = cc.p(startX, startY - i * 30);
                    paiNode.zIndex = i;
                    paiNode.width = 40;
                    paiNode.height = 85;

                }

                if (point == "4") {
                    startX = 0;
                    startY = 180;
                    paiNode.position = cc.p(startX, startY - i * 30);
                    paiNode.zIndex = i;
                    paiNode.width = 40;
                    paiNode.height = 85;
                }

            }
        }

        return paiArray
    },
    intalSelfPaiList: function (paiList) {

        var startPoint = -520;
        var paiArray = paiList.split(",");
        for (var i = 0; i < paiArray.length; i++) {
            if (paiArray[i] != null && paiArray[i] != undefined) {
                var paiNode = cc.instantiate(this.liPaiPrefab);
                var sprite = paiNode.getComponent(cc.Sprite);
                paiNode.name = "slefPai" + i;
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
                paiNode.position = cc.p(startPoint + i * 79, 0);
            }
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

    fixUserPointByIndex: function (index) {
        if (index == "1") {
            var widget = this.userInfo1.getComponent(cc.Widget);
            widget.top = 0;
            widget.isAlignRight = true;
            widget.right = 210;

        }
        if (index == "2") {
            var widget = this.userInfo2.getComponent(cc.Widget);
            widget.left = 60;
        }

        if (index == "4") {
            var widget = this.userInfo4.getComponent(cc.Widget);
            widget.right = 60;
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

    initalUserInfoFromGobalList: function () {
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
