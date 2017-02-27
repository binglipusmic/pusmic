var userListArray;
var privateClient;
var serverUrl;
var socket;
var paiListArray;
var gameModeModel = require('gameMode').gameMode;
var preRoomNumber;
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
        createRoomBtn: cc.Node,
        backRoomBtn: cc.Node,
        tableNode: cc.Node,
        gameModeNode: cc.Node,
        gameMainMenu: cc.Node,
        roomNumberLayer: cc.Node,
        userReadyLayer: cc.Node,
        userReady1Node: cc.Node,
        userReady2Node: cc.Node,
        userReady3Node: cc.Node,
        userReady4Node: cc.Node,
        changeUserStatusYesBtnImage: cc.SpriteFrame,
        changeUserStatusNoBtnImage: cc.SpriteFrame,
        userStatusYesImage: cc.SpriteFrame,
        userStatusNoImage: cc.SpriteFrame,
        quePaiNode:cc.Node,
        huanPaiNode:cc.Node,
        tableCenterNode:cc.Node,
        w1: cc.SpriteFrame,
        w2: cc.SpriteFrame,
        w3: cc.SpriteFrame,
        w4: cc.SpriteFrame,
        w5: cc.SpriteFrame,
        w6: cc.SpriteFrame,
        w7: cc.SpriteFrame,
        w8: cc.SpriteFrame,
        w9: cc.SpriteFrame,
        t1: cc.SpriteFrame,
        t2: cc.SpriteFrame,
        t3: cc.SpriteFrame,
        t4: cc.SpriteFrame,
        t5: cc.SpriteFrame,
        t6: cc.SpriteFrame,
        t7: cc.SpriteFrame,
        t8: cc.SpriteFrame,
        t9: cc.SpriteFrame,
        a1: cc.SpriteFrame,
        a2: cc.SpriteFrame,
        a3: cc.SpriteFrame,
        a4: cc.SpriteFrame,
        a5: cc.SpriteFrame,
        a6: cc.SpriteFrame,
        a7: cc.SpriteFrame,
        a8: cc.SpriteFrame,
        a9: cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
        cc.log("***********:" + this.name);
        //inital the websokect public var
        serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        socket = new SockJS(serverUrl + "/stomp");

        //hide the join room layer
        this.roomNumberLayer.active = false;
        this.userReadyLayer.active = false;
        this.backRoomBtn.active = false;
        this.createRoomBtn.active = true;
        //this.userReady1Node.active



        userListArray = new Array();
        paiListArray = new Array();
        if (Global.userInfo == undefined || Global.userInfo == null) {
            console.log("Error: no found correct user ,please check server or network.");
        } else {
            var userInfo = Global.userInfo;
        }
        //intal the userList by self point 3
        userListArray[0] = null;
        userListArray[1] = null;
        //status 0-offline ,1-online ,2-not ready, 3-ready,4-gameing,5-other 
        userInfo.gameingStatu = "1";
        userInfo.zhuangStatu = "0";
        userListArray[2] = userInfo;
        userListArray[3] = null;
        //inital the user ready icon
        this.initalUserReadyLayer();
        //intal the websokect 
        this.initalPrivateChanleForUser(userInfo.roomNumber, "");

        //inital the game mode domain  
        if (gameModeModel.gamePeopleNumber == 0) {
            gameModeModel.gamePeopleNumber = 4;
        }


    },

    //--------------------------------------Game Table Function Starting----------------------------------------------------------
    createRoom_clearTableInitalUserInfo: function () {
        cc.log("createRoom_clearTableInitalUserInfo starting......");
        for (var i = 1; i < 5; i++) {
            cc.log("i:" + i);
            var user1PaiListLayerNode = this.tableNode.getChildByName("user" + i + "PaiListLayer");
            user1PaiListLayerNode.active = false;
            var user1HidePaiLayerNode = this.tableNode.getChildByName("user" + i + "HidePaiLayer");
            user1HidePaiLayerNode.active = false;
            var user1ChuPaiLayerNode = this.tableNode.getChildByName("user" + i + "ChuPaiLayer");
            user1ChuPaiLayerNode.active = false;
            //hide other uer info icon,until other user join this room
            var userInfo = this.tableNode.getChildByName("user" + i + "Layer");
            if (i != 3) {
                userInfo.active = false;
            } else {
                //inital the user self to center of the x point
                //x 602,y -165,top 490
                userInfo.x = 0;
                var userWiget = userInfo.getComponent(cc.Widget);
                userWiget.top = 600;
                //userWiget.right = 617;
                userWiget.isAlignHorizontalCenter = true;
                userWiget.horizontalCenter = 0;
                //inital self user info
                this.initalUserInfoLayer(userInfo);
                //inital self user icon

                this.userReady3Node.active = true;
            }
        }


    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    //end the room
    endToRoom: function () {
        this.backRoomBtn.action = false;
        //build remove all online room from server
        // this.buildCanleUserMessageAndSendIt(userListArray[2].roomNumber);


    },
    //back to room by preRoomNumber
    backToRoom: function () {
        if (privateClient != null || privateClient != undefined) {
            privateClient.unsubscribe();
        }
        socket = new SockJS(serverUrl + "/stomp");
        this.initalPrivateChanleForUser(preRoomNumber, "send");

    },
    //create a new room 
    createRoomAndEnterTable: function () {
       

        if (privateClient == null || privateClient == undefined) {
            var userInfo = Global.userInfo;
            socket = new SockJS(serverUrl + "/stomp");
            userListArray[2] = userInfo;
            this.initalPrivateChanleForUser(userInfo.roomNumber, "update");

        } else {
            this.buildGameModeMessageAndSendIt(userListArray[2].roomNumber);
        }
         //create a new room ,will default as zhuang 
        userListArray[2].zhuangStatu = "1";

        this.showGameTable();
    },
    closeRoomNumberLayer: function () {
        var listButton = this.gameMainMenu.getChildByName("ListButton");
        var topInfoUser = this.gameMainMenu.getChildByName("topInfoUserLayer");
        listButton.active = true;
        topInfoUser.active = true;
        this.roomNumberLayer.active = false;
        //this.roomNumberLayer.opacity = 255;
    },
    showRoomNumberLayer: function () {
        //this.showGameTable();
        //close the private wesokect
        var listButton = this.gameMainMenu.getChildByName("ListButton");
        var topInfoUser = this.gameMainMenu.getChildByName("topInfoUserLayer");
        listButton.active = false;
        topInfoUser.active = false;
        this.roomNumberLayer.active = true;
        this.roomNumberLayer.opacity = 255;
    },
    joinRoomAndEnterTable: function () {


        //1. get other room number
        var roomNumber = "";
        var roomLayout = this.roomNumberLayer.getChildByName("roomNumberLayout");
        for (var i = 1; i < 7; i++) {
            var roomNumNode = roomLayout.getChildByName("Num" + i);
            var roomNumEditBox = roomNumNode.getComponent(cc.EditBox);
            roomNumber = roomNumber + roomNumEditBox.string;
        }

        cc.log("new roomNumNode:" + roomNumber);
        if (roomNumber.length != 6) {
            cc.log("Get room number error");
        }
        //3. check the room number
        this.checkOnlineRoomNumber(roomNumber, this);



    },
    showGameTable: function () {
        this.gameMainMenu.active = false;
        this.gameModeNode.active = false;
        this.tableNode.active = true;
        this.tableNode.opacity = 255;
        //hide other UI .
        this.quePaiNode.active =false;
        this.tableCenterNode.active =false;
        this.createRoom_clearTableInitalUserInfo();
        //this.initalUserReadyLayer();
    },
    showGameMenu: function () {
        this.gameMainMenu.active = true;
        this.gameModeNode.active = false;
        this.tableNode.active = false;
        this.roomNumberLayer.active = false;
        this.userReadyLayer.active = false;

    },
    //TODO
    userBackToMainMeau: function () {
        //.pre setup
        this.showGameMenu();
        this.createRoomBtn.active = false;
        this.backRoomBtn.active = true;
        //0. this.initalPrivateChanleForUser(userInfo.roomNumber, "");

        //1. client send the user openid to server

        //2. server get the new openid and old openid, set the user room number as new openid
        //3. public the all users to old private chanle ,to update the user list
        if (userListArray[2].zhuangStatu == "1") {
            preRoomNumber = userListArray[2].roomNumber;
        } else {
            preRoomNumber = null
        }
        this.buildCanleUserMessageAndSendIt(userListArray[2].roomNumber);

        //preRoomNumber
        //4. hide the ready icon for empry user


    },
    //This function will commit a private room number to server
    //Server public a message to the private chanle ,any active client will send back active message and key to server
    //Server public the active client in the private chanle again ,client get which client is active
    checkOnlineUserInThePrivateChanle: function () {

    },

    //change user statu to ready or canle the ready
    changeUserStatu: function () {
        var useropenid = userListArray[2].openid;
        var roomNumber = userListArray[2].roomNumber;
        var status = parseInt(userListArray[2].gameingStatu);
        cc.log("send status1:" + status);
        //status 0-offline ,1-online ,2-not ready, 3-ready,4-gameing,5-other 
        if (status == 1) {
            status = 3
        } else if (status == 2) {
            status = 3
        } else if (status == 3) {
            status = 2
        }

        cc.log("send status2:" + status);
        this.buildChangeUserStatusMessageAndSendIt(useropenid, roomNumber, status);
    },
    checkUserStatu: function () {

    },

    //-------------------------------------------Game Table function End-----------------------------------------------------
    showGameMode: function () {
        cc.log("createRoom_clearTableInitalUserInfo starting......");
        this.gameMainMenu.active = false;
        //self.gameMainMenu.opacity=0;
        this.gameModeNode.active = true;
        this.gameModeNode.opacity = 0;
        this.tableNode.active = false;

        this.gameModeNode.opacity = 255;


    },

    //-------------------------------------------------------------------------------
    //inital uer info layer by gobal userinfo object, the self user only user3 .
    initalUserInfoLayer: function (userInfoNode) {
        cc.log("initalUserInfoLayer starting......");
        var userLayout = userInfoNode.getChildByName("user3LayoutLayer");
        var userTextInfoLayer = userLayout.getChildByName("userinfoFrameBg");
        var userNameLableNode = userTextInfoLayer.getChildByName("userNickNameLabel");
        var userScortLableNode = userTextInfoLayer.getChildByName("scortLabel");
        var userNickNameLable = userNameLableNode.getComponent(cc.Label);
        var userScortLable = userScortLableNode.getComponent(cc.Label);

        if (Global.userInfo != null) {
            userNickNameLable.string = Global.userInfo.nickName;
            userScortLable.string = Global.userInfo.diamondsNumber;
        } else {
            userNickNameLable.string = 'test123';
            userScortLable.string = '2321';
        }
    },
    initalUserInfoLayerById: function (userInfoNode, id) {
        var userInfo = this.tableNode.getChildByName("user" + id + "Layer");
        userInfo.active = true;
        if (id == 1) {
            var userWidget = userInfo.getComponent(cc.Widget);
            userWidget.isAlignHorizontalCenter = true;
            userWidget.horizontalCenter = 0;
            // userInfo.x=0;
        }
        var userLayout = userInfo.getChildByName("user" + id + "LayoutLayer");
        var userTextInfoLayer = userLayout.getChildByName("userinfoFrameBg");
        var userNameLableNode = userTextInfoLayer.getChildByName("userNickNameLabel");
        var userScortLableNode = userTextInfoLayer.getChildByName("scortLabel");
        var userNickNameLable = userNameLableNode.getComponent(cc.Label);
        var userScortLable = userScortLableNode.getComponent(cc.Label);

        userNickNameLable.string = userInfoNode.nickName;
        userScortLable.string = userInfoNode.diamondsNumber;

    },
    initalUserReadyLayer: function () {
        this.userReadyLayer.active = true;
        this.userReady1Node.active = false;
        this.userReady2Node.active = false;
        this.userReady3Node.active = false;
        this.userReady4Node.active = false;
    },
    //----------------------------------web sokec connect and subscribe and handle resive message------------------------
    initalPrivateChanleForUser: function (roomNumber, action) {
        cc.log("initalPrivateChanleForUser roomNumber:" + roomNumber);
        //reset the room for user List 
        userListArray[2].roomNumber = roomNumber;
        privateClient = Stomp.over(socket);
        // var messageDomain = require("messageDomain").messageDomain;
        privateClient.connect({}, function () {
            privateClient.subscribe("/queue/privateRoomChanle" + roomNumber, function (message) {
                var bodyStr = message.body;
                cc.log("get meesge from private chanle:privateRoomChanle" + roomNumber);
                var messageDomain = require("messageDomain").messageDomain;
                var obj = JSON.parse(bodyStr);
                if (obj != undefined && obj != null) {
                    for (var p in obj) {
                        messageDomain[p] = obj[p]
                    }
                }
                //1. join new user to room-------------------------------------------------------------------------
                if (messageDomain.messageAction == "addNewUserToPrivateChanle") {
                    var userListJsonStr = messageDomain.messageBody
                    var userList = JSON.parse(userListJsonStr);
                    //gameingStatu

                    for (var i = 0; i < userList.length; i++) {
                        var u = userList[i];
                        var existFlag = false;
                        //check the user if already exist in the user list
                        for (var j = 0; j < userListArray.length; j++) {
                            if (userListArray[j] != null) {
                                if (u.openid == userListArray[j].openid) {

                                    existFlag = true;
                                }
                            }
                        }

                        if (!existFlag) {
                            for (var j = 0; j < userListArray.length; j++) {
                                if (!existFlag) {
                                    if (userListArray[j] == null) {
                                        //status 0-offline ,1-online ,2-not ready, 3-ready,4-gameing,5-other 
                                        cc.log("inital user game user u.gameingStatu:" + u.gameingStatu);
                                        if (u.gameingStatu == null || u.gameingStatu == undefined) {
                                            u.gameingStatu = "2";
                                        } else if (parseInt(u.gameingStatu) == 0 || parseInt(u.gameingStatu) == 1) {
                                            u.gameingStatu = "2";
                                        }

                                        userListArray[j] = u;

                                        //userListArray[j].gameingStatu = 2;
                                        this.setUserStautsAndImage(j, userListArray[j].gameingStatu);
                                        var userReadNode = this.userReadyLayer.getChildByName("user" + (j + 1) + "ReadyNode");
                                        userReadNode.active = true;
                                        this.initalUserInfoLayerById(u, j + 1);
                                        existFlag = true;
                                    }

                                }
                            }
                        }
                        //userListArray
                    }
                }
                //2. CHANGE user status-----------------------------------------------------------------------
                if (messageDomain.messageAction == "changeUserStatusInPrivateChanle") {
                    var o = JSON.parse(messageDomain.messageBody);
                    var useropenid = o.openid;
                    var userStatus = o.status;
                    if (useropenid != null && useropenid != undefined) {
                        for (var j = 0; j < userListArray.length; j++) {
                            if (userListArray[j] != null && userListArray[j] != undefined) {
                                if (useropenid == userListArray[j].openid) {
                                    userListArray[j].gameingStatu = userStatus;
                                    this.setUserStautsAndImage(j, userStatus);
                                }
                            }

                        }
                    }
                }
                //3. get all pai from server---------------------------------------------------------------------
                if (messageDomain.messageAction == "publicAllPai") {
                    //var paiStr = messageDomain.messageBody;
                    //inital the pai list
                    //paiListArray = paiStr.split(",");

                    //remove the all user ready icon
                    this.userReadyLayer.active = false;
                    var obj = JSON.parse(messageDomain.messageBody);
                    var paiStr = obj.paiRestList;
                    paiListArray = paiStr.split(",");
                    var userPaiList = obj.userPaiList
                    for (var i = 0; i < userPaiList.length; i++) {
                        for (var j = 0; j < userListArray.length; j++) {
                            if (userPaiList[i].openid == userListArray[j].openid) {

                            }
                        }
                    }


                }
                //4. cancle the user from the room------------------------------------------------------------------
                if (messageDomain.messageAction == "userCanleRoom") {
                    var cancleUserOpenId = messageDomain.messageBody;
                    cc.log("cancleUserOpenId canle!!" + cancleUserOpenId);
                    for (var j = 0; j < userListArray.length; j++) {
                        //this is other user 

                        if (userListArray[j] != null && userListArray[j] != undefined) {
                            if (cancleUserOpenId == userListArray[j].openid) {
                                userListArray[j] = "";
                                //hide the user ready icon Laryer
                                var userReadNode = this.userReadyLayer.getChildByName("user" + (j + 1) + "ReadyNode");
                                userReadNode.active = false;
                                //hide the user info layer
                                var userInfo = this.tableNode.getChildByName("user" + (j + 1) + "Layer");
                                userInfo.active = false;
                            }
                        }

                    }


                    //disconnect the connect from room
                    if (privateClient != null && privateClient != undefined) {
                        privateClient.unsubscribe();
                        privateClient = null;
                        cc.log("privateClient canle!!");
                    }

                    cc.log("privateClient canle 111!!");
                }

            }.bind(this));
            if (action == "send") {
                this.buildAddNewUserMessageAndSendIt(roomNumber);
            };
            if (action == "update") {
                this.buildUpdateRoomNumberOfOnlineUserMessage(userListArray[2].roomNumber, userListArray[2].openid);
                this.buildGameModeMessageAndSendIt(userListArray[2].roomNumber);
            }
        }.bind(this), function () {
            cc.log("connect private chanle error !");
        });


    },
    //----------------------------------send message to server----------------------------------------------------
    sendWebSokectMessageToServer: function (messageObj) {
        // var o = new Object();
        // o.token = "test word"
        privateClient.send("/app/resiveAllUserChanlePusmicGame", {}, JSON.stringify(messageObj));
    },
    //-----------------------------------------------------------------------------------------------------------------
    removeOnlineUserById: function () {
        var xhr = new XMLHttpRequest();
        var url = serverUrl + "/user/removeOnlinUserById?userId=" + Global.userInfo.id;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },
    checkOnlineRoomNumber: function (roomNumber, self) {
        var xhr = new XMLHttpRequest();
        var url = serverUrl + "/room/checkOnlineRoomNumberCorrect?roomNumber=" + roomNumber + "&openunid=" + Global.userInfo.openid;
        //url = serverUrl + "/user/getLoginUserIP";
        xhr.onreadystatechange = function () {
            cc.log("xhr.status:" + xhr.status);
            cc.log("xhr.readyState:" + xhr.readyState);

            cc.log("-----------");

            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                //let self=this;
                var response = xhr.responseText;
                cc.log(response);
                if (response == "correct") {
                    //1. close private chanle
                    if (privateClient != null && privateClient != undefined) {
                        privateClient.unsubscribe();
                    }
                    //2. connect to new private chanle
                    socket = new SockJS(serverUrl + "/stomp");
                    this.initalPrivateChanleForUser(roomNumber, "send");


                    //3. build a message for add new user for all in the private chanle

                    //4. send a message to server for public the new join user .

                    //5. show game table sence

                    this.gameMainMenu.active = false;
                    this.gameModeNode.active = false;
                    this.tableNode.active = true;
                    this.tableNode.opacity = 0;
                    this.createRoom_clearTableInitalUserInfo();
                    this.tableNode.opacity = 255;
                    //this.initalUserReadyLayer();
                    //messageDomain = require("messageDomain").messageDomain;
                    //messageDomain.messageBelongsToPrivateChanleNumber = roomNumber;
                } else {
                    //full --- room alredy full
                    // show the is a incorerct room number
                }
            } else {
                // show net work issue
            }
        }.bind(this);
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.open("GET", url, true);
        xhr.send();
    },
    onDestroy: function () {
        let self = this;
        self.removeOnlineUserById();
        cc.log("remove success");
        //colse the websokect
        privateClient.disconnect();
    },
    //------------------------------------until function in this classs---------------------------------------------
    //add the new user to private chanle
    buildAddNewUserMessageAndSendIt: function (roomNumber) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNumber;
        messageDomain.messageAction = "addNewUserToPrivateChanle";
        messageDomain.messageBody = "";
        this.sendWebSokectMessageToServer(messageDomain);
    },
    //change the user status
    buildChangeUserStatusMessageAndSendIt: function (useropenid, roomNumber, stauts) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNumber;
        messageDomain.messageAction = "changeUserStatusInPrivateChanle";
        var o = new Object();
        o.openid = useropenid;
        o.status = stauts;
        var bodyStr = JSON.stringify(o);
        messageDomain.messageBody = bodyStr;

        this.sendWebSokectMessageToServer(messageDomain);

    },
    //send game mode to server 
    buildGameModeMessageAndSendIt: function (roomNumber) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNumber;
        messageDomain.messageAction = "publicGameMode";
        messageDomain.messageBody = JSON.stringify(gameModeModel);
        this.sendWebSokectMessageToServer(messageDomain);
    },
    //send the canle user openid to server and public to other
    buildCanleUserMessageAndSendIt: function (roomNumber) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNumber;
        messageDomain.messageAction = "userCanleRoom";
        messageDomain.messageBody = userListArray[2].openid;
        this.sendWebSokectMessageToServer(messageDomain);
    },
    //build update room number for user message
    buildUpdateRoomNumberOfOnlineUserMessage: function (roomNumber, myopenid) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNumber;
        messageDomain.messageAction = "updateOnlineUserRoomNumber";
        messageDomain.messageBody = myopenid;
        this.sendWebSokectMessageToServer(messageDomain);
    },
    setUserStautsAndImage: function (i, userStatus) {
        cc.log("setUserStautsAndImage:" + i + "-" + userStatus);
        var userReadNode = this.userReadyLayer.getChildByName("user" + (i + 1) + "ReadyNode");
        if (i == 2) {
            var userBtn = userReadNode.getChildByName("userReadyBtn");
            userReadNode = userReadNode.getChildByName("userStatuImage");

            if (userStatus == 2) {
                userBtn.normalSprite = this.changeUserStatusNoBtnImage;
                userBtn.pressedSprite = this.changeUserStatusNoBtnImage;
                userBtn.hoverSprite = this.changeUserStatusNoBtnImage;
            }
            if (userStatus == 3) {
                userBtn.normalSprite = this.changeUserStatusYesBtnImage;
                userBtn.pressedSprite = this.changeUserStatusYesBtnImage;
                userBtn.hoverSprite = this.changeUserStatusYesBtnImage;
            }


        } else {

        }

        var s = userReadNode.getComponent(cc.Sprite);
        if (userStatus == 2) {
            s.spriteFrame = this.userStatusNoImage
        }
        if (userStatus == 3) {
            s.spriteFrame = this.userStatusYesImage
        }

        userListArray[i].gameingStatu = userStatus;

    },
});
