var client;
var roomNumber;
var userInfo;
var actionUIScriptNode;
var alertMessageUI;
var serverUrl;
var socket;
var messageDomain;
var connect_callback;
var userInfoScript;
var huanSanZhangScript;
var quePaiScript;
var tableCenterScript;
var tablePaiActionScript;
var paiActionScript;
var moPaiScript;
var tableUserInfoScript;
var huPaiScript;
var messageScript;
var roundScoreScript;
var base64 = require('base64');
var offlineScript;
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

        actionNodeScript: cc.Node,
        alertMessageNodeScirpt: cc.Node,
        userInfoScriptNode: cc.Node,

        huanSanZhangNode: cc.Node,
        quePaiScriptNode: cc.Node,
        tableCenterNode: cc.Node,
        tablePaiNode: cc.Node,
        paiRestNode: cc.Node,
        paiAactionNode: cc.Node,
        moPaiActionNode: cc.Node,
        tableActionNode: cc.Node,
        tableUserInfoNode: cc.Node,

        gameRoundEndNode: cc.Node,
        allGameRoundEndNode: cc.Node,
        huPaiNode: cc.Node,
        messageNode: cc.Node,
        roundScoreNode: cc.Node,
        ruzhuoButton: cc.Node,
        offlineScriptNode: cc.Node,


    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        actionUIScriptNode = self.actionNodeScript.getComponent("gameConfigButtonListAction");
        alertMessageUI = self.alertMessageNodeScirpt.getComponent("alertMessagePanle");
        userInfoScript = self.userInfoScriptNode.getComponent("tableUserInfo");
        moPaiScript = self.moPaiActionNode.getComponent("tableMoPaiAction");
        offlineScript = self.offlineScriptNode.getComponent("userOffline");
        messageDomain = require("messageDomain").messageDomain;
        Global.subid = 0;
        connect_callback = function (error) {
            // display the error's message header:
            alert(error.headers.message);
        };

        huanSanZhangScript = self.huanSanZhangNode.getComponent("huanPaiUI");
        quePaiScript = self.quePaiScriptNode.getComponent("quepaiScript");
        tableCenterScript = self.tableCenterNode.getComponent("tableCenterPoint");
        tablePaiActionScript = self.tablePaiNode.getComponent("tablePaiAction");
        paiActionScript = self.paiAactionNode.getComponent("paiAction");
        tableUserInfoScript = self.tableUserInfoNode.getComponent("tableUserInfo");
        huPaiScript = self.huPaiNode.getComponent("HuPaiAction");
        messageScript = self.messageNode.getComponent("messageUI");
        roundScoreScript = self.roundScoreNode.getComponent("roundScoreUI");

        //tableUserInfoScript.initalUserInfoFromGobalList();
        //-----------------------
        cc.game.on(cc.game.EVENT_HIDE, function () {
            // cc.audioEngine.pauseMusic();
            // cc.audioEngine.pauseAllEffects();
            // cc.eventManager.removeCustomListeners(cc.game.EVENT_HIDE);
            //cc.audioEngine.pauseAll();
            cc.game.pause();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            // cc.audioEngine.pauseMusic();
            // cc.audioEngine.pauseAllEffects();


            cc.game.resume();
            this.initalClientAgain();
            //cc.audioEngine.resumeAll();

        }.bind(this));

        // this.testJonsString();
    },
    testJonsString: function () {
        var huActionListCache = [];
        for (var i = 0; i < 3; i++) {
            var o = new Object();
            o.userOpenId = "test" + i;
            o.actionArray = "cancle,peng,gang";
            o.paiNumber = "11";
            huActionListCache.push(o);

        }
        var json = JSON.stringify(huActionListCache)
        console.log("huActionListCache:" + json.toString());
    },
    connectByPrivateChanel: function () {
        if (client == null || client == undefined || client.connected == false) {
            userInfo = require("userInfoDomain").userInfoDomain;
            userInfo = Global.userInfo;
            roomNumber = userInfo.roomNumber;
            serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
            socket = new SockJS(serverUrl + "/stomp");
            console.log("conect to server");
            client = Stomp.over(socket);
        }
    },
    subscribeToPrivateChanelNoConnetAgain: function (thisRooNumber) {
        if (client == null || client == undefined) {

        }
        client.subscribe("/queue/privateUserChanel" + thisRooNumber, function (message) {
            var bodyStr = message.body;
            console.log("######################");
            if (bodyStr.length > 0) {
                bodyStr = base64.decode(bodyStr);
            }

            //bodyStr = this.b64DecodeUnicode(bodyStr);
            console.log("decode:" + bodyStr);
            var obj = JSON.parse(bodyStr);
            if (obj != undefined && obj != null) {
                for (var p in obj) {
                    messageDomain[p] = obj[p]
                }
                actionUIScriptNode.closeLoadingIcon();

                //-----------------------------------------------------------------------------------------
                //user offline

                //userOffLineSelect
                if (messageDomain.messageAction == "userOffLineSelect") {
                    offlineScript.showOptionIntoUserSlect(messageDomain.messageBody);
                }
                if (messageDomain.messageAction == "userOffline") {
                    var offLineUserObj = JSON.parse(messageDomain.messageBody);
                    console.log("offLineUserObj:" + offLineUserObj.onlineStau);


                    if (offLineUserObj.onlineStau == 1) {
                        //remove user form gobale user list
                        var userList = Global.userList;
                        for (var j = 0; j < userList.length; j++) {
                            var gameUser = userList[j];
                            if (gameUser.openid == offLineUserObj.springUserOpenId) {
                                //userList[j] = null;
                                userList.splice(j, 1);
                            }
                        }
                        // console.log("offLineUserObj 168-11:" + offLineUserObj.onlineStau);
                        Global.userList = userList;
                        //update the GUI
                        //console.log("offLineUserObj 168-22:" + offLineUserObj.onlineStau);
                        tableUserInfoScript.cleanUserNode();
                        tableUserInfoScript.initalUserInfoFromGobalList();
                        //console.log("offLineUserObj 168-33:" + offLineUserObj.onlineStau);


                    }
                    console.log("offLineUserObj 176:" + offLineUserObj.onlineStau);
                    //2,1 only for test 
                    if (offLineUserObj.onlineStau == 2) {
                        offlineScript.showOfflinePanel(offLineUserObj.springUserNickName, offLineUserObj.springUserOpenId);
                    }
                    console.log("offLineUserObj 180:" + offLineUserObj.onlineStau);

                }



                //build less deomond 
                if (messageDomain.messageAction == "buildRoundFail") {
                    //请联系代理，或者直接关注微信公众号:乐乐四川麻将
                    alertMessageUI.text = "你所有的钻石不足以开启一局.";
                    alertMessageUI.setTextOfPanel();

                }

                //updateDiamond
                if (messageDomain.messageAction == "updateDiamond") {
                    var userObj = JSON.parse(messageDomain.messageBody);
                    var gobalUser = Global.userInfo;
                    if (userObj.openid == gobalUser.openid) {
                        gobalUser.diamondsNumber = userObj.diamondsNumber;
                        Global.userInfo = gobalUser;
                        actionUIScriptNode.updateScoreAndDemand();
                    }

                }

                if (messageDomain.messageAction == "updateScoreAndWindCount") {
                    var userObj = JSON.parse(messageDomain.messageBody);
                    var gobalUser = Global.userInfo;
                    if (userObj.openid == gobalUser.openid) {
                        gobalUser.gameScroe = userObj.gameScroe;
                        gobalUser.winCount = userObj.winCount;
                        Global.userInfo = gobalUser;
                        actionUIScriptNode.updateScoreAndDemand();
                    }

                }
                //-------------------------------------------------------------------------------------------
                // actionUIScriptNode.showGameTalbe();
                if (messageDomain.messageAction == "closeGameRoundLun") {
                    actionUIScriptNode.onlyCloseGameTable();
                }
                //closeGameRoundLun
                //-------------------------------------------------------------------------------------------
                // actionUIScriptNode.showGameTalbe();
                if (messageDomain.messageAction == "buildNewRoundLun") {
                    console.log(messageDomain.messageBody);
                    var userObj = JSON.parse(messageDomain.messageBody);
                    var userList = [];
                    userObj.pointIndex = "3";
                    userObj.zhuang = "1";
                    userList.push(userObj);
                    Global.userList = userList;
                    actionUIScriptNode.showGameTalbe("1");
                    // this.ruzhuoButton.active=true;
                    /*
                   if (userInfo.openid==userObj.openid) {
                       //inital the gobal user list by self user             
                   } else {
                       alertMessageUI.text = messageDomain.messageBody;
                       alertMessageUI.setTextOfPanel();
                   }*/
                }

                //intalUserInfoReadyIcon
                if (messageDomain.messageAction == "userReadyStatuChange") {
                    var Obj = JSON.parse(messageDomain.messageBody);
                    if (Obj.messageExecuteFlag == "success") {
                        var userList = Global.userList;
                        var gameUserList = JSON.parse(Obj.messageExecuteResult);
                        console.log("%%%%%%Obj:" + Obj.messageExecuteResult);
                        for (var j = 0; j < gameUserList.length; j++) {
                            var gameUser = gameUserList[j];
                            for (var i = 0; i < userList.length; i++) {
                                var user = userList[i];
                                if (user.openid == gameUser.openid) {
                                    user.gameReadyStatu = gameUser.gameReadyStatu;
                                }
                            }
                        }
                        Global.userList = userList;
                        console.log("Global.userList:" + Global.userList.toString())
                        userInfoScript.intalUserInfoReadyIcon();
                    } else {
                        alertMessageUI.text = Obj.messageExecuteResult;
                        alertMessageUI.setTextOfPanel();
                    }

                };
                //--------------------------------------------------
                if (messageDomain.messageAction == "joinExistRoom") {
                    var userOpenId = messageDomain.messageBody;
                    // var Obj = JSON.parse(messageDomain.messageBody);
                    // var gobalUser = Global.userInfo
                    // //Obj=JSON.parse(Obj.messageBody);
                    //console.log("messageBody1:" + messageDomain.messageBody);
                    // //console.log("messageBody2:"+obj.messageBody);

                    // var joinRoomJson = JSON.parse(messageDomain.messageBody);
                    // var gameUserList = JSON.parse(joinRoomJson.userList);
                    // var joinMode = JSON.parse(joinRoomJson.gameMode);

                    // if (joinMode != null && joinMode != undefined) {
                    //     Global.gameMode = joinMode;
                    //    console.log("joinMode:" + Global.gameMode.toString());
                    // }

                    // var userList = [];
                    // for (var j = 0; j < gameUserList.length; j++) {
                    //     var getUser = gameUserList[j]
                    //     if (getUser.paiList != null && getUser.paiList != undefined) {
                    //         getUser.paiListArray = getUser.paiList.split(",");

                    //     }
                    //     if (getUser.openid == gobalUser.openid) {
                    //         getUser.pointIndex = "3";
                    //     }

                    //     // userObj.pointIndex = "3";
                    //     userList.push(getUser);
                    // }
                    // Global.userList = userList;

                    // var paiRestCount = 13 * gameUserList.length + 1;
                    // paiRestCount = 108 - paiRestCount;
                    // var paiListLable = this.paiRestNode.getComponent(cc.Label)
                    // paiListLable.string = paiRestCount + "";
                    // Global.restPaiCount = paiRestCount;
                    // actionUIScriptNode.showGameTalbe("0");
                    // userInfoScript.initalUserPai("inital", "joinExist");

                }
                //--------------------------------------------------
                if (messageDomain.messageAction == "joinRoom") {
                    var Obj = JSON.parse(messageDomain.messageBody);
                    console.log("%%%%%%Obj.messageExecuteFlag:" + Obj.messageExecuteFlag);
                    if (Obj.messageExecuteFlag == "success") {
                        Global.joinRoomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
                        var joinRoomJson = JSON.parse(Obj.messageExecuteResult);
                        var gameUserList = JSON.parse(joinRoomJson.userList);
                        var joinMode = JSON.parse(joinRoomJson.gameMode);
                        if (joinMode != null && joinMode != undefined) {
                            Global.gameMode = joinMode;
                            console.log("joinMode:" + Global.gameMode.toString());
                        }
                        var existFlag = false;

                        console.log("%%%%%%Obj:" + Obj.messageExecuteResult);
                        console.log("%%%%%%gameUserList:" + gameUserList.length);
                        if (gameUserList.length == 1) {
                            //  gameUserList[0].zhuang="1";
                        }
                        //console.log("%%%%%%gameUser:"+gameUser.toString());
                        var userList = [];
                        for (var j = 0; j < gameUserList.length; j++) {
                            var getUser = gameUserList[j]
                            console.log("%%%%%%gamegetUser:" + getUser.openid);
                            userList.push(getUser);
                        }

                        console.log("userList 1:" + userList.toString());
                        Global.userList = userList;
                        //show game table
                        if (Global.joinRoomNumber == Global.userInfo.roomNumber) {
                            actionUIScriptNode.showGameTalbe("1");
                        } else {
                            actionUIScriptNode.showGameTalbe("0");
                        }

                    } else {
                        alertMessageUI.text = Obj.messageExecuteResult;
                        alertMessageUI.setTextOfPanel();
                        this.forceInitaClient();
                    }
                }

                if (messageDomain.messageAction == "faPai") {
                    offlineScript.offlineNumber = 0;
                    offlineScript.agreeDeleUserCount = 0;
                    offlineScript.offlineUserOpenId = "";
                    var gameUserList = JSON.parse(messageDomain.messageBody);
                    var userList2 = Global.userList;
                    var userInfo = Global.userInfo;
                    for (var j = 0; j < gameUserList.length; j++) {
                        var gameUser = gameUserList[j];
                        for (var i = 0; i < userList2.length; i++) {
                            var user = userList2[i];
                            if (user.openid == gameUser.openid) {
                                var paiListString = gameUser.paiList;
                                user.zhuang = gameUser.zhuang;
                                paiListString = this.changeJsonListStringToArrayString(paiListString)
                                console.log("gameUser.paiList:" + paiListString);
                                user.paiList = paiListString;
                            }

                            //   if (user.openid == userInfo.openid) {
                            //      console.log("found 3:"+user.openid);
                            //        user.pointIndex =3
                            //   }
                        }


                    }
                    var paiRestCount = 13 * gameUserList.length + 1;
                    paiRestCount = 108 - paiRestCount;
                    var paiListLable = this.paiRestNode.getComponent(cc.Label)
                    paiListLable.string = paiRestCount + "";
                    Global.restPaiCount = paiRestCount;
                    Global.userList = userList2;
                    //table user info

                    userInfoScript.initalUserPai("inital", "");
                }

                //huan sanzhang 
                if (messageDomain.messageAction == "huanSanZhangFaPai") {
                    var gameUserList = JSON.parse(messageDomain.messageBody);
                    var userList2 = Global.userList;
                    var userInfo = Global.userInfo;
                    for (var j = 0; j < gameUserList.length; j++) {
                        var gameUser = gameUserList[j];
                        for (var i = 0; i < userList2.length; i++) {
                            var user = userList2[i];
                            if (user.openid == gameUser.openid) {
                                var paiListString = gameUser.paiList;

                                paiListString = this.changeJsonListStringToArrayString(paiListString)
                                console.log("gameUser.paiList:" + paiListString);
                                user.paiList = paiListString;
                            }

                            //   if (user.openid == userInfo.openid) {
                            //      console.log("found 3:"+user.openid);
                            //        user.pointIndex =3
                            //   }
                        }


                    }
                    Global.userList = userList2;
                    //clean table 
                    userInfoScript.cleanTable();
                    //inital user on table 
                    userInfoScript.initalUserPai("inital", "");
                    userInfoScript.disableAllPai();
                    //close wait panel  
                    huanSanZhangScript.closeWaitPanle();
                    huanSanZhangScript.closeHuanSanZhang();
                    Global.chuPaiActionType = "";
                    quePaiScript.showQuePaiNodeAll();
                    //quePaiScript.stratTimer();
                }

                //set current round count
                if (messageDomain.messageAction == "setCurrentRoundCount") {
                    var currentRoundCount = messageDomain.messageBody
                    if (currentRoundCount != null && currentRoundCount != undefined) {
                        Global.gameRoundCount = parseInt(currentRoundCount);
                        console.log("set gameRoundCount:" + Global.gameRoundCount);
                    }


                }


                //quepai sendQuePai
                if (messageDomain.messageAction == "sendQuePai") {
                    var quePaiUser = JSON.parse(messageDomain.messageBody);
                    console.log("quePaiUser.quePai:" + quePaiUser.quePai);
                    console.log("quePaiUser.openid:" + quePaiUser.openid);
                    var userList2 = Global.userList;
                    var userInfo = Global.userInfo;
                    var quePaiCount = 0;
                    for (var i = 0; i < userList2.length; i++) {
                        if (quePaiUser.openid == userList2[i].openid) {
                            //if (quePaiUser.openid != userList2[i].openid) {
                            userList2[i].quePai = quePaiUser.quePai;
                            //quePaiCount++;
                            // }
                        }

                        if (userList2[i].quePai != null && userList2[i].quePai != undefined) {
                            quePaiCount++;
                        }
                    }
                    Global.userList = userList2;

                }

                //zhuangjiaChuPai

                if (messageDomain.messageAction == "zhuangJiaChuPai") {
                    var userList2 = Global.userList;
                    var userInfo = Global.userInfo;
                    var zhuangOpenId = "";
                    var currentUser;
                    var zhuangInde;
                    for (var i = 0; i < userList2.length; i++) {
                        console.log("userList2[i].zhuang:" + userList2[i].zhuang);
                        console.log("userList2[i].pointIndex:" + userList2[i].pointIndex + "--" + userList2[i].nickName);
                        if (userList2[i].zhuang == "1") {
                            zhuangOpenId = userList2[i].openid;
                            zhuangInde = userList2[i].pointIndex;
                        }

                        if (userList2[i].openid == userInfo.openid) {
                            currentUser = userList2[i]
                        }
                    }
                    console.log("zhuangOpenId:" + zhuangOpenId);
                    //close all wait Panle .
                    quePaiScript.closeWaitPanel();
                    //show center table
                    console.log("zhuangInde:" + zhuangInde);
                    tableCenterScript.index = zhuangInde;
                    tableCenterScript.showCenterPoint();
                    //enable self pai list 
                    if (currentUser.openid == zhuangOpenId) {
                        tablePaiActionScript.enabledAllPaiAfterQuePai();
                        var paiLast = currentUser.paiListArray[currentUser.paiListArray.length - 1]
                        console.log("First mopai:" + paiLast);
                        currentUser.userMoPai = paiLast;
                        tablePaiActionScript.updateUserListInGobal(currentUser);

                        var tableNode = cc.find("Canvas/tableNode");
                        var parentNode = cc.find("user3PaiList", tableNode);
                        var children = parentNode.children;
                        console.log("First Name:" + children[children.length - 1].name)
                        children[children.length - 1].name = "mopai_" + paiLast
                        console.log("Last Name:" + children[children.length - 1].name)

                        //check if user have gang
                        var actionArray = paiActionScript.checkActionArrayInSelfPaiList(currentUser.openid)
                        console.log("actionArray:" + actionArray.length);
                        if (actionArray.length > 1) {
                            paiActionScript.showAction(actionArray);
                        }
                    }

                }

                //-------------Play Audio message------------------------------
                if (messageDomain.messageAction == "playMp3Message") {
                    var mp3MessageBase64Encode = messageDomain.messageBody;
                    if (cc.sys.os == cc.sys.OS_IOS) {
                        var isinstall = jsb.reflection.callStaticMethod('AudioFunc', 'saveEncodeBase64toMp3:title:', mp3MessageBase64Encode, "");
                    }
                    if (cc.sys.os == cc.sys.OS_ANDROID) {
                        jsb.reflection.callStaticMethod("com/pusmicgame/mahjong/AppActivity", "decodeBase64File", "(Ljava/lang/String;)V", mp3MessageBase64Encode);
                    }
                }
                if (messageDomain.messageAction == "endGameRoundLun") {
                    this.countUserRoundScore();
                    this.testScoreOutput();
                    var userInfo = Global.userInfo;
                    var currentUser = this.getCurreentUserByOpenId(userInfo.openid);
                    this.sendRoundScoreToServer(currentUser);
                    roundScoreScript.initalRoundScore();
                    roundScoreScript.endLunFlag = "1";
                    tableCenterScript.endTimer();
                }
                if (messageDomain.messageAction == "endGameRoundAndStartNewRound") {
                    //messageScript
                    this.countUserRoundScore();
                    this.testScoreOutput();
                    var userInfo = Global.userInfo;
                    var currentUser = this.getCurreentUserByOpenId(userInfo.openid);
                    this.sendRoundScoreToServer(currentUser);
                    roundScoreScript.initalRoundScore();
                    roundScoreScript.endLunFlag = "0";
                    tableCenterScript.endTimer();
                }

                if (messageDomain.messageAction == "sendMessage") {
                    var obj = JSON.parse(messageDomain.messageBody);
                    var sendUserOpendId = obj.openid;
                    var messageBody = obj.messageString;
                    console.log("messageBody:" + messageBody);
                    messageScript.showMessage(messageBody);
                }
                //--------------------------------------Game Action  -----------------------------------------------
                if (messageDomain.messageAction == "gameAction") {
                    var userList = Global.userList;
                    var userInfo = Global.userInfo;
                    var obj = JSON.parse(messageDomain.messageBody);
                    var fromUserOpenid = obj.fromUserOpenid;
                    var paiNumber = obj.paiNumber

                    //---------------chupai------------------------
                    if (obj.actionName == "chuPai") {
                        paiActionScript.chuPaiUserOpenId = fromUserOpenid;
                        tableCenterScript.endTimer();
                        var paiList = obj.paiList;
                        if (paiList.indexOf(",") > 0) {
                            paiList = paiList.split(",")
                        } else {
                            paiList = [paiList]
                        }

                        var u = this.getCurreentUserByOpenId(fromUserOpenid);


                        //get next user openid 
                        var nextUserOpenId = this.getNextUserByOpenId(fromUserOpenid);
                        console.log("593:");
                        if (fromUserOpenid != userInfo.openid) {
                            //reset user action status for each user 
                            for (var i = 0; i < userList.length; i++) {

                                //play chupai action on other side
                                if (obj.fromUserOpenid == userList[i].openid) {
                                    //show the chu pai action on animation
                                    var index = userList[i].pointIndex;
                                    console.log("602:" + index);
                                    tablePaiActionScript.playOtherChuPaiAction(paiNumber, index);
                                    //update the pai list on the chu pai user
                                    userList[i].paiList = paiList.join(",");
                                    userList[i].paiListArray = paiList;
                                    userList[i].actionBarFlag = "-2";


                                } else {
                                    userList[i].actionBarFlag = "-1";
                                }


                            }
                            //update pai and pai list to Gobal user list var 
                            Global.userList = userList;

                            //check peng and gang and hu in the chu pai

                        }
                        console.log("620:");
                        //only work on the next user 
                        if (nextUserOpenId == userInfo.openid) {
                            userList = Global.userList;
                            var huActionListCache = [];
                            var noHuActionListCache = [];
                            console.log("626:");
                            for (var i = 0; i < userList.length; i++) {
                                if (fromUserOpenid != userList[i].openid) {
                                    if (userList[i].huPai == null || userList[i].huPai == undefined || userList[i].huPai == "") {
                                        var actionArray = paiActionScript.getActionBarArrayByOpenId(paiNumber, userList[i].openid, "")
                                        console.log("openid :" + userList[i].openid);
                                        console.log("paiList:" + userList[i].paiListArray.toString());
                                        console.log("actionArray:" + actionArray.length);
                                        if (actionArray.length > 1) {
                                            userList[i].actionBarFlag = "1";
                                            var o = new Object();
                                            o.userOpenId = userList[i].openid;
                                            o.actionArray = actionArray;
                                            o.paiNumber = paiNumber;
                                            if (actionArray.toString().indexOf("hu") >= 0) {
                                                huActionListCache.push(o);
                                            } else {
                                                noHuActionListCache.push(o);
                                            }

                                            //this.sendShowActionBarOnOtherUser(userList[i].openid, actionArray.toString(), paiNumber);
                                        } else {
                                            userList[i].actionBarFlag = "0";
                                        }
                                    }
                                } else {
                                    userList[i].actionBarFlag = "0";
                                }
                            }

                            //First check the acttion count
                            var count = huActionListCache.length + noHuActionListCache.length;
                            console.log("658:");
                            if (count == 0) {
                                this.sendMoPaiAction();
                            } else if (count == 1) {
                                var userObject = null;
                                if (huActionListCache.length == 1) {
                                    userObject = huActionListCache[0];
                                } else {
                                    userObject = noHuActionListCache[0];
                                }
                                if (userObject != null) {
                                    this.sendShowActionBarOnOtherUser(userObject.userOpenId, userObject.actionArray.toString(), userObject.paiNumber, "");
                                } else {
                                    console.log("EROOR:It should have a action object ,but it is null");
                                }


                            } else {
                                //send all action bar to server ,let server decide the order.
                                //hu 2,nohu 1
                                //hu 1,nohu 1
                                //hu 2,nohu 0
                                //hu 3,nohu 0
                                var huActionString = "";
                                var noHuActionString = "";


                                if (huActionListCache.length > 0) {
                                    huActionString = JSON.stringify(huActionListCache);
                                }

                                if (noHuActionListCache.length > 0) {
                                    noHuActionString = JSON.stringify(noHuActionListCache);
                                }
                                this.sendAllShowActionBarOnOtherUser(huActionString, noHuActionString);


                            }

                            if (huActionListCache.length > 0) {

                                /**
                                 * Here have a bug ,if two user already to hu pai ,but the other user already to peng or gang 
                                 * The correct way should need wait the two user to do decide.
                                 * But now ,it only support one user to do decide.
                                 * 
                                 */

                                //TODO we still need send the noHuActionListCache after the huActoin close the action bar.
                                var othreActionString = "";
                                // if (noHuActionListCache.length > 0) {
                                //     othreActionString = JSON.stringify(noHuActionListCache[0])
                                // }
                                for (var j = 0; j < huActionListCache.length; j++) {
                                    var obj = huActionListCache[j];
                                    // this.sendShowActionBarOnOtherUser(obj.userOpenId, obj.actionArray.toString(), obj.paiNumber, "");
                                }
                            } else {

                            }

                            if (noHuActionListCache.length > 0) {
                                for (var j = 0; j < noHuActionListCache.length; j++) {
                                    var obj = noHuActionListCache[j];
                                    // this.sendShowActionBarOnOtherUser(obj.userOpenId, obj.actionArray.toString(), obj.paiNumber, "");

                                }
                            }




                            //check if already have action in the other user 
                            // var alreadyExistFlag = false;
                            // for (var i = 0; i < userList.length; i++) {
                            //     if (userList[i].actionBarFlag == "1") {
                            //         //show 
                            //         alreadyExistFlag = true;

                            //     }
                            // }
                            //console.log("alreadyExistFlag:" + alreadyExistFlag);

                            // if (alreadyExistFlag == false) {
                            //     //mopai
                            //     this.sendMoPaiAction();
                            // }
                            //update user list to gobal 
                            Global.userList = userList;
                        }


                    }
                    //---------------pengpai-----------------------------------------------
                    if (obj.actionName == "pengPai") {
                        userInfo = Global.userInfo;
                        var pengFromUserOpenId = obj.fromUserOpenid;
                        if (userInfo.openid != pengFromUserOpenId) {
                            var pengPaiNumber = obj.paiNumber;

                            paiActionScript.fromUserOpenId = pengFromUserOpenId;
                            paiActionScript.paiNumber = pengPaiNumber;
                            paiActionScript.pengAction();
                            var user = this.getCurreentUserByOpenId(pengFromUserOpenId)
                            tableCenterScript.index = user.pointIndex;
                            tableCenterScript.showCenterPoint();
                        }


                    }
                    //---------------set center index-----------------
                    //setCenterIndex
                    if (obj.actionName == "setCenterIndex") {
                        userInfo = Global.userInfo;
                        var setCenterUserOpenId = obj.fromUserOpenid;
                        if (userInfo.openid != setCenterUserOpenId) {
                            var user = this.getCurreentUserByOpenId(setCenterUserOpenId);
                            var userPointIndex = user.pointIndex;
                            tableCenterScript.index = user.pointIndex;
                            tableCenterScript.showCenterPoint();
                        }
                    }
                    //---------------gangpai-----------------------------------------------
                    if (obj.actionName == "gangPai") {
                        userInfo = Global.userInfo;
                        var gangFromUserOpenId = obj.fromUserOpenid;
                        var gangPaiNumber = obj.paiNumber;
                        var chuPaiUserOpenId = obj.toUserOpenid;
                        var gangTypeList = obj.gangTypeList;

                        if (userInfo.openid != gangFromUserOpenId) {

                            paiActionScript.fromUserOpenId = gangFromUserOpenId;
                            paiActionScript.paiNumber = gangPaiNumber;
                            paiActionScript.chuPaiUserOpenId = chuPaiUserOpenId;
                            paiActionScript.gangAction();

                            var user = this.getCurreentUserByOpenId(gangFromUserOpenId)
                            tableCenterScript.index = user.pointIndex;
                            tableCenterScript.showCenterPoint();
                        }
                    }
                    //-------------------------------------------------------------------
                    if (obj.actionName == "sendMessage") {
                        var sendUserOpendId = obj.openid;
                        var messageBody = obj.messageString;
                        console.log("messageBody:" + messageBody);
                        messageScript.showMessage(messageBody);
                    }

                    //---------------moPai-----------------------------------------------


                    if (obj.actionName == "moPai") {
                        var paiNumber = obj.paiNumber;
                        var pengFromUserOpenId = obj.fromUserOpenid;
                        var pengPaiNumber = obj.nextMoPai;
                        var toUserOpenid = obj.toUserOpenid;
                        //0, open table center point
                        var user = this.getCurreentUserByOpenId(toUserOpenid)
                        tableCenterScript.index = user.pointIndex;
                        tableCenterScript.showCenterPoint();
                        //1, remove rest pai number in the table 
                        var paiRestCount = Global.restPaiCount;
                        if (paiRestCount != null && paiRestCount != undefined) {
                            paiRestCount = parseInt(paiRestCount) - 1;
                            Global.restPaiCount = paiRestCount;
                            var paiListLable = this.paiRestNode.getComponent(cc.Label)
                            paiListLable.string = paiRestCount + "";
                        }
                        //moPai
                        //user.paiListArray.push(paiNumber);
                        // moPaiScript.moPaiOnDataLayer(paiNumber, toUserOpenid);
                        // user = tablePaiActionScript.insertMoPaiIntoPaiList(user);
                        // user = tablePaiActionScript.synchronizationPaiList(user);
                        //GUI add a new pai
                        // tableUserInfoScript.initalOtherPaiListOnePai(paiNumber, user.paiListArray, user.pointIndex, "");

                        //2.enable all pai
                        var userInfo = Global.userInfo;
                        if (userInfo.openid == toUserOpenid) {
                            moPaiScript.moPaiAction(paiNumber, toUserOpenid);
                            tablePaiActionScript.enabledAllPaiAfterQuePai();
                        } else {
                            moPaiScript.moPaiOnDataLayer(paiNumber, toUserOpenid);
                            //user = tablePaiActionScript.insertMoPaiIntoPaiList(user);
                            //user = tablePaiActionScript.synchronizationPaiList(user);
                            var paiListStr = user.paiList;
                            tableUserInfoScript.initalOtherPaiListOnePai(paiNumber, user.paiListArray, user.pointIndex, "");
                            //tablePaiActionScript.updateUserListInGobal(user);
                        }


                    }
                    //-----------------check action flag-------------------
                    if (obj.actionName == "checkActionBarFlag") {
                        var nextUserOpenid = obj.fromUserOpenid;
                        var pai = obj.paiNumber
                        var actionArray = paiActionScript.getSelfActionBarArray(pai, nextUserOpenid, "chupai")
                        if (actionArray.length > 1) {
                            this.sendCheckActionOnOtherUser(nextUserOpenid, "1")
                        } else {
                            this.sendCheckActionOnOtherUser(nextUserOpenid, "0")
                        }
                        var continueFlag = false;
                        var userList = Global.userList;
                        var userInfo = Global.userInfo;
                        for (var i = 0; i < userList.length; i++) {
                            if (userList[i].actionBarFlag == "-1") {

                            }
                        }
                    }
                    //----------------check action status------------------


                    if (obj.actionName == "checkActionBar") {
                        var fromUserOpenId = obj.fromUserOpenid;
                        var userInfo = Global.userInfo;
                        var flag = obj.actionFlag;
                        var userList = Global.userList;
                        var sendMoPai = "-1";
                        var count = 0;
                        //if (userInfo.openid != fromUserOpenId) {
                        for (var i = 0; i < userList.length; i++) {
                            if (userList[i].openid == fromUserOpenId) {
                                userList[i].actionBarFlag = flag;
                            }
                            sendMoPai = flag;
                            if (userList[i].actionBarFlag != "-1") {
                                count++
                            }
                        }

                        if (sendMoPai == "0" && count == userList.length - 1) {
                            //no any action bar or it already send the mopai action 
                            this.sendMoPaiAction();
                        }
                    }
                    //showActionBar
                    if (obj.actionName == "showActionBar") {
                        console.log("showActionBar action resive ")
                        var fromUserOpenId = obj.fromUserOpenid;
                        var arrayString = obj.actionArrayStr;
                        // var otherUserActionString = obj.otherActionStr;
                        paiNumber = obj.paiNumber;
                        var userInfo = Global.userInfo;
                        if (userInfo.openid == fromUserOpenId) {
                            var actionArray = arrayString.split(",");
                            paiActionScript.fromUserOpenId = fromUserOpenId;
                            paiActionScript.paiNumber = paiNumber;
                            //paiActionScript.otherUserActionString = otherUserActionString;
                            paiActionScript.showAction(actionArray);
                        }

                    }

                    //----------------cancleAction-----------------------------------------------

                    if (obj.actionName == "cancleAction") {
                        var executeNextStepFlag = obj.executeNextStepFlag;
                        var userInfo = Global.userInfo;
                        var moPaiUserId = this.getNextUserFromCurentIndex();
                        fromUserOpenId = obj.fromUserOpenid;
                        console.log("moPaiUserId:" + moPaiUserId);

                        if (executeNextStepFlag + "" == "true") {
                            if (moPaiUserId == userInfo.openid) {
                                this.sendMoPaiAction();
                            }
                        }
                        // if (moPaiUserId == userInfo.openid) {

                        //     var userList = Global.userList;
                        //     for (var i = 0; i < userList.length; i++) {
                        //         if (userList[i].openid == fromUserOpenId) {
                        //             userList[i].actionBarFlag = "0";
                        //            console.log("moPaiUserId actionBarFlag:" + userList[i].openid);
                        //         }
                        //     }

                        //     var alreadyExistFlag = false;
                        //     for (var i = 0; i < userList.length; i++) {
                        //         if (userList[i].actionBarFlag == "1") {
                        //             //show 
                        //             alreadyExistFlag = true;
                        //             //this.sendShowActionBarOnOtherUser(userList[i].openid, paiNumber);
                        //         }
                        //     }
                        //    console.log("moPaiUserId alreadyExistFlag:" + alreadyExistFlag);
                        //     if (alreadyExistFlag == false) {
                        //         //mopai
                        //         if (userInfo.openid != fromUserOpenId) {
                        //             this.sendMoPaiAction();
                        //         }

                        //     }

                        // }
                    }


                    //-----------hupai action-------------------
                    if (obj.actionName == "huPai") {
                        var userInfo = Global.userInfo;
                        var userList = Global.userList;
                        fromUserOpenId = obj.fromUserOpenid;
                        paiNumber = obj.paiNumber;
                        var chuPaiUserOpenId = obj.chuPaiUserOpenId;
                        var huChuPaiType = obj.huChuPaiType;
                        var preStep = obj.preStep;
                        var existUserString = obj.existUserString;
                        var gangFromUserOpenId = obj.gangFromUserOpenId;
                        var executeNextStepFlag = obj.executeNextStepFlag;
                        //Global.huGangShangHuaChuPaiUserOpenId = gangFromUserOpenId;
                        //---set hu pai user center point 
                        var huuser = this.getCurreentUserByOpenId(fromUserOpenId)
                        tableCenterScript.index = huuser.pointIndex;
                        //update the hupai for the hu user
                        huuser.huPai = paiNumber;
                        huuser.huPaiFromUser = chuPaiUserOpenId;
                        huuser.huChuPaiType = huChuPaiType;
                        huuser.existUserString = existUserString;
                        // huuser.huGangPai = gangPai;
                        huuser.huGangShangHuaChuPaiUserOpenId = chuPaiUserOpenId// gangFromUserOpenId;
                        huuser.huGangPaiInOtherUserFromOpenId = gangFromUserOpenId;
                        tablePaiActionScript.updateUserListInGobal(huuser);


                        //tableCenterScript.showCenterPoint();

                        var userInfo = Global.userInfo;
                        if (userInfo.openid != fromUserOpenId) {
                            paiActionScript.fromUserOpenId = fromUserOpenId;
                            paiActionScript.paiNumber = paiNumber;
                            paiActionScript.chuPaiUserOpenId = chuPaiUserOpenId;
                            paiActionScript.preStep = huChuPaiType;
                            paiActionScript.huAction();
                        }

                        if (executeNextStepFlag + "" == "true") {

                            var moPaiUserId = this.getNextUserFromCurentIndex();
                            //check if game round end
                            userList = Global.userList;
                            var huPeople = 0;
                            var endGameFlag = false;
                            for (var i = 0; i < userList.length; i++) {

                                if (userList[i].huPai != null && userList[i] != undefined && userList[i] != "") {
                                    huPeople++
                                }

                            }
                            console.log("huPeople:" + huPeople);
                            console.log("userList.length:" + userList.length);
                            if (huPeople == userList.length - 1) {
                                endGameFlag = true;
                            }
                            console.log("endGameFlag:" + endGameFlag);
                            if (Global.restPaiCount == 0) {
                                endGameFlag = true;
                            }

                            if (endGameFlag == false) {
                                if (userInfo.openid == fromUserOpenId) {
                                    this.sendMoPaiAction();
                                }
                            } else {
                                console.log("**sendCheckRoundEnd**");
                                //hu pai action will send to all user
                                //we only need send one time check round end.
                                if (userInfo.openid == fromUserOpenId) {
                                    this.sendCheckRoundEnd();
                                }

                                //send to server to check if it already end the round and round lun 

                            }


                        }


                    }
                }


                // if (messageDomain.messageAction == "userReadyStatuChange") {
                //     if (messageDomain.messageBody.indexOf("success") >= 0) {
                //         var temp = messageDomain.messageBody.split(":");
                //         var openid = temp[1];
                //     } else {
                //         alertMessageUI.text = messageDomain.messageBody;
                //         alertMessageUI.setTextOfPanel();
                //     }
                // }
            } else {

                console.log("No found correct user info return from server ,please check .");
            }

        }.bind(this), function () {
            console.log("websocket connect subscribe Error:233");
            //client.disconnect();
        });
    },
    subscribeToPrivateChanel: function (thisRooNumber) {
        client.connect({}, function () {
            this.subscribeToPrivateChanelNoConnetAgain(thisRooNumber);
            //after reconect ,send the location infomation
            console.log("subscribeToPrivateChanel");
            this.sendLocationInfoToServer();

        }.bind(this), function () {
            console.log("websocket connect  Error:234");
            //client.disconnect();
        });

    },
    initalClientAgain: function () {
        if (client == null || client == undefined || client.connected == false) {
            var roomNumber = Global.joinRoomNumber;
            this.connectByPrivateChanel();
            this.subscribeToPrivateChanel(roomNumber);

        }

    },
    initalClient: function () {
        console.log("initalClient staring");
        if (client == null || client == undefined || client.connected == false) {
            this.connectByPrivateChanel();
            this.subscribeToPrivateChanel(roomNumber);

        }
        //this.sendInitalMessage();

    },
    forceInitaClient: function () {
        if (client == null || client == undefined || client.connected == false) {
            this.connectByPrivateChanel();
        }
        var userInfo = Global.userInfo;
        var joinRoomNumber = userInfo.roomNumber;
        client.unsubscribe("sub-" + Global.subid);
        this.subscribeToPrivateChanelNoConnetAgain(joinRoomNumber);
        Global.subid = Global.subid + 1;

        this.subscribeToPrivateChanel(joinRoomNumber);
    },
    //-------------------------------save location to user info -----------------
    saveLocationInfoToGobalInfo: function (longitude, latitude) {
        var userLocation = Global.userLocation;
        if (userLocation == null || userLocation == undefined) {
            userLocation = new Object();
        }
        userLocation.longitude = longitude;
        userLocation.latitude = latitude;
        Global.userLocation = userLocation;
        console.log("saveLocationInfoToGobalInfo end**");

    },
    //-------------------------------chu pai action---------------------------------------------
    sendUserAuthTokenAndRefreshTokenToServer: function (authToken, refreshToken, openid) {

    },

    sendLocationInfoToServer: function () {
        console.log("sendLocationInfoToServer staring");
        var joinRoomNumber = Global.joinRoomNumber;

        var userInfo = Global.userInfo;
        if (joinRoomNumber == null || joinRoomNumber == undefined) {
            joinRoomNumber = userInfo.roomNumber;
        }
        var userLocation = Global.userLocation;
        var o = new Object();
        o.openid = userInfo.openid;
        if (userLocation.longitude != null && userLocation.longitude != undefined) {
            o.longitude = userLocation.longitude;
            o.latitude = userLocation.latitude;
            var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "updateLocation");
            this.sendMessageToServer(messageObj);
        }
    },

    sendRoundScoreToServer: function (user) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = user.openid;
        o.actionName = "saveRoundScore";
        o.roundScoreCount = user.roundScoreCount;
        o.huPaiDetails = user.huPaiDetails;
        //o.toUserOpenid = userOpenId;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },

    sendStartNewRound: function () {

        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        //o.fromUserOpenid = userOpenId;
        o.actionName = "startNewRound";
        //o.toUserOpenid = userOpenId;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },
    sendOffLineUserKouFen: function (useropenid, maxFen) {

        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        //o.fromUserOpenid = userOpenId;
        o.actionName = "offlineUserKouFen";
        o.openid = useropenid;
        o.maxFen = maxFen;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "offlineUserKouFen");
        this.sendMessageToServer(messageObj);
    },

    sendCheckRoundEnd: function () {

        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        //o.fromUserOpenid = userOpenId;
        o.actionName = "checkRoundEnd";
        //o.toUserOpenid = userOpenId;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },

    sendUserOfflineSatauSelect: function (message) {
        var joinRoomNumber = Global.joinRoomNumber;
        var messageObj = this.buildSendMessage(message, joinRoomNumber, "userOffLineSelect");
        this.sendMessageToServer(messageObj);
    },


    sendCenterIndex: function (userOpenId) {

        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = userOpenId;
        o.actionName = "setCenterIndex";
        o.toUserOpenid = userOpenId;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },
    sendAllShowActionBarOnOtherUser: function (huPaiActionString, noHuPaiActionString) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        // o.fromUserOpenid = showUserOpenid;
        o.actionName = "allShowActionBar";
        //o.actionArrayStr = arrayString;
        o.huPaiActionString = huPaiActionString;
        o.noHuPaiActionString = noHuPaiActionString;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },

    sendShowActionBarOnOtherUser: function (showUserOpenid, arrayString, paiNumber, otherActionString) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = showUserOpenid;
        o.actionName = "showActionBar";
        o.actionArrayStr = arrayString;
        o.paiNumber = paiNumber;
        o.otherActionStr = otherActionString;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },
    sendCheckNextFlagActionOnOtherUser: function (nextUserOpenid, paiNumber) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = nextUserOpenid;
        o.actionName = "checkActionBarFlag";
        o.paiNumber = paiNumber;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },
    sendCheckActionOnOtherUser: function (fromUserOpenid, flag) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = fromUserOpenId;
        o.actionName = "checkActionBar";
        o.actionFlag = flag;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },
    sendCacleToMoPaiAction: function (userOpenid, otherUserActionString) {
        var moPaiUserOpenId = this.getNextUserFromCurentIndex();
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = userOpenid;
        o.actionName = "cancleAction";
        o.toUserOpenid = userOpenid;
        o.needWaitOhterUser = otherUserActionString;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);

    },
    sendCacleHuPaiAction: function () {

    },
    sendHuPaiAction: function (fromUserOpenId, chuPaiUserOpenId, paiNumber, huChuPaiType, preStep, existUserString, gangFromUserOpenId, needWaitOhterUser) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        //var gameStep = require("gameStep").gameStep;

        o.fromUserOpenid = fromUserOpenId;
        o.actionName = "huPai";
        o.paiNumber = paiNumber;
        o.chuPaiUserOpenId = chuPaiUserOpenId;
        o.huChuPaiType = huChuPaiType;
        o.preStep = preStep;
        o.existUserString = existUserString;
        o.gangFromUserOpenId = gangFromUserOpenId;
        o.executeNextStepFlag = "";
        if (needWaitOhterUser == null || needWaitOhterUser == undefined) {
            needWaitOhterUser = "";
        }
        o.needWaitOhterUser = needWaitOhterUser;

        //o.chuPaiType = Global.chuPaiActionType;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
        tableCenterScript.endTimer();
    },
    sendPengPaiAction: function (fromUserOpenId, paiNumber) {
        console.log("sendPengPaiAction");
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        //var gameStep = require("gameStep").gameStep;

        o.fromUserOpenid = fromUserOpenId;
        o.actionName = "pengPai";
        o.paiNumber = paiNumber;
        o.toUserOpenid = fromUserOpenId;




        //o.chuPaiType = Global.chuPaiActionType;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
        tableCenterScript.endTimer();
    },
    sendGangPaiAction: function (chuPaiUserOpenId, fromUserOpenId, paiNumber, gangTypeList) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        //var gameStep = require("gameStep").gameStep;

        o.fromUserOpenid = fromUserOpenId;
        o.actionName = "gangPai";
        o.paiNumber = paiNumber;
        o.toUserOpenid = chuPaiUserOpenId;
        o.gangTypeList = gangTypeList;

        //o.chuPaiType = Global.chuPaiActionType;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
        tableCenterScript.endTimer();
    },

    /**
     * paiType --normal chupai  /Gang chupai/Peng Chu pai 
     */
    sendChuPaiAction: function (userOpenId, paiNumber, paiList, paiType) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        //var gameStep = require("gameStep").gameStep;

        o.fromUserOpenid = userOpenId;
        o.actionName = "chuPai";
        o.paiNumber = paiNumber;
        o.toUserOpenid = userOpenId;
        o.paiList = paiList.join(",");
        o.chuPaiType = Global.chuPaiActionType;
        o.nextOpenid = this.getNextUserByOpenId(userOpenId);
        o.nextMoPai = ""



        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
        //tableCenterScript.endTimer();
    },

    sendMoPaiOnSelecAction: function (openId) {
        var joinRoomNumber = Global.joinRoomNumber;
        // var nextUserOpenId = this.getNextUserFromCurentIndex();
        var o = new Object();
        //var gameStep = require("gameStep").gameStep;
        o.fromUserOpenid = openId;
        o.actionName = "moPai";
        //we must set the toUserOpenid 
        o.toUserOpenid = openId;

        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);

    },
    //send mo pai will auto get current user 
    sendMoPaiAction: function () {
        console.log("sendMoPaiAction");
        var joinRoomNumber = Global.joinRoomNumber;
        var nextUserOpenId = this.getNextUserFromCurentIndex();
        var o = new Object();
        //var gameStep = require("gameStep").gameStep;
        o.fromUserOpenid = nextUserOpenId;
        o.actionName = "moPai";
        o.toUserOpenid = nextUserOpenId;

        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
        //tableCenterScript.endTimer();
    },
    sendInitalMessage: function () {
        var userInfo = Global.userInfo;
        var joinRoomNumber = userInfo.roomNumber;
        var messageObj = this.buildSendMessage("test", joinRoomNumber, "gameinistal");
        this.sendMessageToServer(messageObj);
    },

    /**
     * 
     * Get next user by the current openid 
     * 
     */

    getNextUserByOpenId: function (openid) {
        var userList = Global.userList;
        var currentIndex = 0;
        var nextIndex = 0;
        var nextOpenId = "";
        for (var j = 0; j < userList.length; j++) {
            if (userList[j].openid == openid) {
                currentIndex = userList[j].pointIndex;
            }
        }

        currentIndex = this.getNextIndex(currentIndex);
        console.log("getNextUserByOpenId currentIndex 1398:" + currentIndex);
        var user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
        //console.log("1018 user.huPai:" + user.huPai);
        if (user.huPai != null && user.huPai != undefined & user.huPai != "") {
            currentIndex = this.getNextIndex(currentIndex);
            user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
            //console.log("1022 user.huPai:" + user.huPai);
            if (user.huPai != null && user.huPai != undefined & user.huPai != "") {
                currentIndex = this.getNextIndex(currentIndex);
                user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
                //console.log("1026 user.huPai:" + user.huPai);
                if (user.huPai != null && user.huPai != undefined & user.huPai != "") {
                    //show end round 
                }
            }
        }
        nextOpenId = user.openid;
        console.log("getNextUserByOpenId currentIndex nextOpenId:" + nextOpenId);
        return nextOpenId

    },

    getNextUserFromCurentIndex: function () {
        var userList = Global.userList;
        var currentIndex = tableCenterScript.index;
        var nextIndex = 0;
        var nextOpenId = "";

        //console.log("1013 currentIndex:" + currentIndex);
        currentIndex = this.getNextIndex(currentIndex);
        //tableActionScript.getNextUserFromCurentIndex
        console.log("1096 currentIndex:" + currentIndex);
        var user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
        //console.log("1018 user.huPai:" + user.huPai);
        if (user.huPai != null && user.huPai != undefined & user.huPai != "") {
            currentIndex = this.getNextIndex(currentIndex);
            user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
            //console.log("1022 user.huPai:" + user.huPai);
            if (user.huPai != null && user.huPai != undefined & user.huPai != "") {
                currentIndex = this.getNextIndex(currentIndex);
                user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
                //console.log("1026 user.huPai:" + user.huPai);
                if (user.huPai != null && user.huPai != undefined & user.huPai != "") {
                    //show end round 
                }
            }
        }

        // for (var j = 0; j < userList.length; j++) {
        //     if (userList[j].pointIndex == nextIndex) {
        //         nextOpenId = userList[j].openid;

        //     }
        // }
        nextOpenId = user.openid;
        console.log("getNextUserFromCurentIndex:" + nextOpenId);
        return nextOpenId

    },

    getNextIndex: function (currentIndex) {
        var nextIndex = 0;
        currentIndex = currentIndex + "";
        currentIndex = currentIndex.trim();
        currentIndex = parseInt(currentIndex);
        //console.log("currentIndex:" + currentIndex);
        console.log("Global.userList.length:" + Global.userList.length);
        if (Global.userList.length == 4) {
            if (currentIndex == Global.userList.length) {
                //console.log("1050:" + currentIndex);
                nextIndex = 1
            } else {

                nextIndex = currentIndex + 1
                //console.log("1053:" + nextIndex);
            }
        } else {
            //san ren majiang 
            if (currentIndex == 4) {
                nextIndex = 2
            } else {
                nextIndex = currentIndex + 1
            }
        }
        console.log("1057:" + nextIndex);
        return nextIndex
    },

    //--------------------------------------------------------------------------------------------------------
    testJoinRoom: function (joinRoomNumber) {
        Global.joinRoomNumber = joinRoomNumber;
        // client.unsubscribe("sub-" + Global.subid);


        var userInfo = Global.userInfo;

        userInfo.roomNumber = joinRoomNumber;
        Global.userInfo = userInfo;
        //client.disconnect();
        this.connectByPrivateChanel();
        this.subscribeToPrivateChanelNoConnetAgain(joinRoomNumber);
        Global.subid = Global.subid + 1;
        console.log("Global.subid:" + Global.subid);
        userInfo = Global.userInfo;
        var openId = userInfo.openid;
        //var messageObj = this.buildSendMessage(openId, joinRoomNumber, "joinRoom");
        //this.sendMessageToServer(messageObj);
    },

    roomOwnerJoinRoom: function () {
        var joinRoomNumber = Global.joinRoomNumber;
        this.joinRoom(joinRoomNumber);
        this.ruzhuoButton.active = false;
    },


    joinRoom: function (joinRoomNumber) {
        Global.joinRoomNumber = joinRoomNumber;
        client.unsubscribe("sub-" + Global.subid);

        //client.disconnect();
        //this.connectByPrivateChanel();
        this.subscribeToPrivateChanelNoConnetAgain(joinRoomNumber);
        Global.subid = Global.subid + 1;
        console.log("Global.subid:" + Global.subid);
        userInfo = Global.userInfo;
        var openId = userInfo.openid;
        var messageObj = this.buildSendMessage(openId, joinRoomNumber, "joinRoom");
        this.sendMessageToServer(messageObj);
    },
    checkRoomNumber: function () {

    },
    //--------------------------------------------------------------------------------------------------------
    buildNewGameRound: function () {
        // this.initalClient();
        console.log("buildNewGameRound-----------------------");
        var gameMode = Global.gameMode;
        if (gameMode == null) {
            gameMode = require("gameMode").gameMode;
        }
        userInfo = Global.userInfo;
        Global.joinRoomNumber = userInfo.roomNumber;
        if (gameMode != null) {
            roomNumber = userInfo.roomNumber;
            var o = new Object();
            o.userOpenId = userInfo.openid;
            //add limit for mode
            if (Global.gameConfigSetting != null && Global.gameConfigSetting != undefined) {
                gameMode.publicIpLimit = Global.gameConfigSetting.publicIpLimit;
                gameMode.gpsLimit = Global.gameConfigSetting.gpsLimit;
            } else {
                gameMode.publicIpLimit = "0"
                gameMode.gpsLimit = "0"
            }
            o.gameMode = gameMode;
            console.log("buildNewGameRound2-----------------------");
            var messageObj = this.buildSendMessage(JSON.stringify(o), roomNumber, "buildNewRoundLun");

            this.sendMessageToServer(messageObj);
            console.log("buildNewGameRound3-----------------------");
        }
        Global.gameMode = gameMode;

        actionUIScriptNode.showLoadingIcon();

    },
    closeGameRoundLun: function () {
        userInfo = Global.userInfo;
        if (userInfo != null) {
            roomNumber = userInfo.roomNumber;
            var messageObj = this.buildSendMessage(roomNumber, roomNumber, "closeGameRoundLun");
            this.sendMessageToServer(messageObj);
        }

    },

    closeGameRoundLunByRoomNumber: function (roomNumber) {

        var messageObj = this.buildSendMessage(roomNumber, roomNumber, "closeGameRoundLun");
        this.sendMessageToServer(messageObj);


    },
    getFaPai: function () {
        var messageObj = this.buildSendMessage("", roomNumber, "faPai");
        this.sendMessageToServer(messageObj);
    },
    //-------------------send huan sanzhang -----------------------------------------------
    //Global.huanSanZhangPaiList
    sendQuePai: function (quePaiCount, peopleCount) {

        userInfo = Global.userInfo;
        var que = userInfo.quePai;
        var userOpenId = userInfo.openid;
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.quePai = que;
        o.openid = userOpenId;
        o.quePaiCount = quePaiCount;
        o.peopleCount = peopleCount;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "sendQuePai");
        this.sendMessageToServer(messageObj);
        console.log("sendQuePai");


    },
    //-------------------send Audio message -----------------------------------------------
    sendAudioMessage: function (mp3Base64EncodeString) {
        if (mp3Base64EncodeString.length > 0) {
            mp3Base64EncodeString = mp3Base64EncodeString.replace(/\r/g, "");
            mp3Base64EncodeString = mp3Base64EncodeString.replace(/\n/g, "");
            console.log("mp3Base64EncodeString:" + mp3Base64EncodeString);
            var joinRoomNumber = Global.joinRoomNumber;
            userInfo = Global.userInfo;
            var userCode = userInfo.userCode;
            var o = new Object();
            o.audioMessage = mp3Base64EncodeString;
            o.userCode = userCode;
            var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "sendMp3Message");
            this.sendMessageToServer(messageObj);
        }

    },
    //-------------------send huan sanzhang -----------------------------------------------
    //Global.huanSanZhangPaiList
    sendHuanSanZhang: function () {
        var paiList = "";
        for (var i = 0; i < 3; i++) {
            paiList = paiList + Global.huanSanZhangPaiList[i] + ",";
        }
        paiList = paiList.substring(0, paiList.length - 1);
        userInfo = Global.userInfo;
        var userOpenId = userInfo.openid;
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.huanSanZhangPaiList = paiList;
        o.openid = userOpenId;
        console.log("sendHuanSanZhang userOpenId:" + userOpenId);
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "userHuanSanZhang");
        this.sendMessageToServer(messageObj);

    },
    //-------------------User ready action-------------------------------------------------
    sendUserReadyToServer: function (event) {
        var node = event.target;
        var readyStatu = "0";
        console.log("node:" + node.name);
        var s = node.getComponent(cc.Sprite);
        console.log("s:" + s.spriteFrame.name);
        if (s.spriteFrame.name == "26") {
            readyStatu = "1";
        } else {
            readyStatu = "0";
        }
        userInfo = Global.userInfo;
        var userOpenId = userInfo.openid;
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.userReadyStatu = readyStatu;
        o.openid = userOpenId;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "userReadyStatuChange");
        this.sendMessageToServer(messageObj);

    },

    //--------------- Game chat room 
    sendMessageToUser: function (messageString) {

        var userInfo = Global.userInfo;
        var userOpenId = userInfo.openid;
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.messageString = messageString;
        o.openid = userOpenId;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "sendMessage");
        this.sendMessageToServer(messageObj);
    },

    //--------------------------------------------------------------------------------------------------------
    b64EncodeUnicode: function (str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    },
    b64DecodeUnicode: function (str) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },
    sendMessageToServer: function (messageObj) {
        //base 64 
        var s = JSON.stringify(messageObj);
        var encodeStr = base64.encode(s);

        client.send("/app/user_private_message", {}, encodeStr);

    },


    buildSendMessage: function (messageBody, roomNum, action) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNum;
        messageDomain.messageAction = action;
        messageDomain.messageBody = messageBody;

        return messageDomain


    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    //----------------Count round socre--------------------
    checkUserIfTingPai: function (user) {
        var paiList = user.paiListArray;
        console.log("1276:" + paiList.toString());
        var gangPaiList = user.gangPaiList;
        var pengList = user.pengPaiList;

        var tempPaiList = [];
        for (var i = 0; i < paiList.length; i++) {
            tempPaiList.push(paiList[i]);
        }
        var quePai = user.quePai;
        if (quePai == undefined) {
            quePai = "3";
        }
        var paiTypeList = ["1", "2", "3"];
        var temp = [];
        console.log("checkUserIfTingPai quePai:" + quePai);
        for (var i = 0; i < paiTypeList.length; i++) {
            var pai = paiTypeList[i];
            if (quePai + "" != pai) {
                temp.push(pai);
            }
        }
        console.log("checkUserIfTingPai temp:" + temp.toString());
        var testPaiList = [];
        for (var i = 0; i < temp.length; i++) {
            for (var j = 1; j <= 9; j++) {
                var paiNumber = temp[i] + "" + j;
                testPaiList.push(paiNumber);
            }
        }
        console.log("testPaiList:" + testPaiList.toString());
        var huFlag = false;
        if (user.maxFanShu == undefined || user.maxFanShu == null) {
            user.maxFanShu = 0;
        }
        for (var i = 0; i < testPaiList.length; i++) {
            console.log("1311:" + paiList.toString());
            huFlag = huPaiScript.hupaiLogic(testPaiList[i], user.openid, tempPaiList, "");
            console.log("1312:" + tempPaiList.toString());
            console.log("1313 pai:" + paiList.toString());
            if (huFlag == true) {
                user.tingJiao = true;
                paiList.push(testPaiList[i]);
                console.log("1317:" + paiList.toString());
                paiList.sort(function (a, b) { return a - b });
                var returnArray = this.countHuPaiFanshu(pengList, gangPaiList, paiList, user.huPai);
                var fanshu = returnArray[0];
                if (fanshu == undefined) {
                    fanshu = 0;
                }
                fanshu = parseInt(fanshu);
                if (fanshu > user.maxFanShu) {
                    user.maxFanShu = fanshu;
                }
                //break;
            }
        }
        console.log("checkUserIfTingPai user:" + user.openid);
        console.log("checkUserIfTingPai:" + huFlag);
        return huFlag

    },
    countUserRoundScore: function () {
        console.log("countUserRoundScore starting ");
        var userList = Global.userList;
        var noHuList = [];
        var gameMode = Global.gameMode;
        var maxFan = 0;
        if (gameMode.fan2 + "" == "1") {
            maxFan = 2;
        }
        if (gameMode.fan3 + "" == "1") {
            maxFan = 3;
        }
        if (gameMode.fan4 + "" == "1") {
            maxFan = 4;
        }
        if (gameMode.fan6 + "" == "1") {
            maxFan = 6;
        }
        console.log("maxFan:" + maxFan);
        var roundScore = 0;
        var fanshu = 0;
        var details = "";
        //First set the ting jiao 
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            if (user.huPaiDetails == undefined || user.huPaiDetails == null) {
                user.huPaiDetails = "";
            }
            if (user.huPai != null && user.huPai != undefined && user.huPai != "") {

            } else {
                this.checkUserIfTingPai(user);

                console.log("user.tingJiao:" + user.tingJiao);
                console.log("user.tingJiao user:" + user.openid);
            }
        }

        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            user.huPaiFanShu = 0;
            var zimoJiaDiFalg = false;

            //First ----gang count ---only on hu pai and ting pai 
            if ((user.huPai != null && user.huPai != undefined && user.huPai != "") || user.tingJiao == true) {

                var gangPaiList = user.gangPaiList;
                var paiList = user.paiListArray;
                var gangFromUserListOpenId = user.gangFromUserListOpenId;
                var userGangExistUser = user.gangExistUser;
                var existUserString = user.existUserString;
                var gangTypeList = user.gangTypeList;
                var gangExistUserCache = user.gangExistUserCache;
                console.log("user gangTypeList1306:" + gangTypeList);
                console.log("user :" + user.openid);
                console.log("user existUserString 1838:" + existUserString);
                if (gangPaiList != null && gangPaiList != undefined && gangPaiList.length > 0) {
                    console.log("user userGangExistUser:" + userGangExistUser.toString());

                    for (var j = 0; j < gangPaiList.length; j++) {


                        if (user.huPaiFanShu <= maxFan) {
                            user.huPaiFanShu = user.huPaiFanShu + 1;
                        }
                        var userGangExistUser = userGangExistUser[j];
                        var userGangList = [];
                        if (userGangExistUser != undefined && userGangExistUser != null) {
                            userGangList = userGangExistUser.split(";");
                        }
                        console.log("user userGangExistUser 1852:" + userGangExistUser);
                        this.setExistUserRoundCount(userGangExistUser, gangTypeList[j], user);
                        console.log("gangTypeList[j]:" + gangTypeList[j]);
                        if (gangTypeList[j] + "" == "2") {
                            details = details + " 自杠 " + userGangList.length + "*2;";
                        } else {
                            details = details + " 巴杠 " + userGangList.length + "*1;";
                        }

                    }


                }
            }

            if (user.huPai != null && user.huPai != undefined && user.huPai != "") {
                //-----count gang -----------------------
                var gangPaiList = user.gangPaiList;
                var pengList = user.pengPaiList;

                var paiList = user.paiListArray;



                //-----------hu pai  fanshu count -----------------------------------
                var returnArray = this.countHuPaiFanshu(pengList, gangPaiList, paiList, user.huPai);
                fanshu = returnArray[0];

                details = details + returnArray[1];
                user.huPaiFanShu = user.huPaiFanShu + fanshu
                console.log(" user.huPaiFanShu:" + user.huPaiFanShu);
                console.log(" user.details:" + details);
                if (user.huPaiFanShu > maxFan) {
                    user.huPaiFanShu = maxFan;
                }

                //-----------zi mo check ----------------------------
                if (user.huPaiFanShu < maxFan) {
                    if (user.huPaiFromUser == user.openid) {
                        if (gameMode.ziMoJiaDi + "" == "1") {
                            //roundScore = roundScore + 1;
                            details = details + "自摸加底1;"
                            zimoJiaDiFalg = true;
                        }

                        if (gameMode.ziMoJiaFan + "" == "1") {
                            //fanshu = fanshu + 1;
                            user.huPaiFanShu = user.huPaiFanShu + 1;
                            details = details + "自摸加1番;"
                        }

                    }
                }

                console.log(" user.huPaiFanShu 1355:" + user.huPaiFanShu);
                //-----------gang shang hua check --------------------
                if (user.huchuPaiType == "gang") {
                    if (user.huPaiFanShu < maxFan) {
                        user.huPaiFanShu = user.huPaiFanShu + 1;
                        details = details + "点杠加1番;"
                        //var huGangPai = user.huGangPai;
                        var gangFromUserList = user.gangFromUserListOpenId;
                    }
                }

                //existUserString
                if (gameMode.dianGangHua_ziMo + "" == "1") {

                }

                if (gameMode.dianGangHua_dianPao + "" == "1") {

                }

                //------------Round score count--------------------
                //get fan shu 
                if (user.huPaiFanShu > maxFan) {
                    user.huPaiFanShu = maxFan;
                }
                if (user.huPaiFanShu == 0) {
                    roundScore = 1;
                    details = details + "平胡";
                } else {
                    //roundScore=fanshu*2;
                    var a = 1;
                    console.log("1384 user.huPaiFanShu:" + user.huPaiFanShu);
                    console.log("1384 user.roundScore:" + roundScore);
                    if (user.huPaiFanShu == undefined || user.huPaiFanShu == null || user.huPaiFanShu == 0 || user.huPaiFanShu == "") {

                    } else {
                        for (var n = 1; n <= user.huPaiFanShu; n++) {
                            a = a * 2;
                        }
                    }



                    roundScore = a;
                    console.log("1389 a:" + a);
                }

                if (zimoJiaDiFalg) {
                    roundScore = roundScore + 1;
                }

                console.log("roundScore:" + roundScore);
                //start count for each user 

                if (user.huchuPaiType == "gang" && gameMode.dianGangHua_dianPao + "" == "1") {
                    console.log("1388:" + user.huGangShangHuaChuPaiUserOpenId);
                    var tempUser = this.getCurreentUserByOpenId(user.huGangShangHuaChuPaiUserOpenId);

                    if (user.roundScoreCount == null || user.roundScoreCount == undefined) {
                        user.roundScoreCount = roundScore * 1;
                    } else {
                        user.roundScoreCount = user.roundScoreCount + roundScore * 1;
                    }

                    if (user.huPaiDetails == undefined || user.huPaiDetails == null) {
                        user.huPaiDetails = "";
                    }
                    user.huPaiDetails = user.huPaiDetails + " 胡牌得分:" + roundScore * 1 + ";";
                    // user.huPaiDetails = details + " 杠上炮 " + roundScore * 1;
                    if (tempUser.roundScoreCount == undefined || tempUser.roundScoreCount == null) {
                        tempUser.roundScoreCount = 0;
                    }
                    if (tempUser.huPaiDetails == undefined || tempUser.huPaiDetails == null) {
                        tempUser.huPaiDetails = "";
                    }
                    tempUser.roundScoreCount = tempUser.roundScoreCount - roundScore;
                    tempUser.huPaiDetails = tempUser.huPaiDetails + " 杠上炮-" + roundScore + ";";

                } else {
                    var existUserList = existUserString.split(";");
                    console.log("user.roundScoreCount0:" + user.roundScoreCount);
                    if (user.roundScoreCount == null || user.roundScoreCount == undefined) {
                        user.roundScoreCount = roundScore * existUserList.length;
                    } else {
                        user.roundScoreCount = user.roundScoreCount + roundScore * existUserList.length;
                    }
                    user.huPaiDetails = details + " 胡牌得分:" + roundScore * existUserList.length + ";";
                    console.log("user.roundScoreCount1:" + roundScore);
                    console.log("user.roundScoreCount2:" + roundScore * existUserList.length);
                    console.log("user.roundScoreCount3:" + user.roundScoreCount);
                    console.log("user.huPaiDetails:" + user.huPaiDetails);
                    for (var k = 0; k < existUserList.length; k++) {
                        console.log("existUserList[k]:" + existUserList[k]);
                        if (existUserList[k] != null && existUserList[k] != undefined && existUserList[k] != "") {
                            var tempUser = this.getCurreentUserByOpenId(existUserList[k]);
                            if (tempUser.roundScoreCount == null || tempUser.roundScoreCount == undefined) {
                                tempUser.roundScoreCount = - roundScore;
                            } else {
                                tempUser.roundScoreCount = tempUser.roundScoreCount - roundScore;
                            }
                            if (tempUser.huPaiDetails == undefined || tempUser.huPaiDetails == null) {
                                tempUser.huPaiDetails = "";
                            }

                            tempUser.huPaiDetails = tempUser.huPaiDetails + " 胡牌失分:-" + roundScore + ";";
                            console.log("tempUser.roundScoreCount:" + tempUser.roundScoreCount);
                        }

                    }
                }

                //呼叫转移
                if (user.huchuPaiType == "gang") {
                    var firstGangUserOpenId = user.huGangShangHuaChuPaiUserOpenId;
                    var firstGangUser = this.getCurreentUserByOpenId(firstGangUserOpenId);
                    //var firstXiaJiaoFlag = this.checkUserIfTingPai(firstGangUser);
                    if ((firstGangUser.huPai != null && firstGangUser.huPai != undefined && firstGangUser.huPai != "") || firstGangUser.tingJiao == true) {

                        //only firstGangUser xia jiao 
                        var firstGangUserPaiList = firstGangUser.gangPaiList;
                        console.log("firstGangUserPaiList:" + firstGangUserPaiList);
                        var resultScoreceHuJiao = 0;
                        if (firstGangUserPaiList != null && firstGangUserPaiList != undefined && firstGangUserPaiList.length > 0) {
                            var firstUserGangExistUser = firstGangUser.gangExistUser;
                            console.log("firstUserGangExistUser:" + firstUserGangExistUser);
                            var firstGangTypeList = firstGangUser.gangTypeList;
                            var firstGangFromUserListOpenId = firstGangUser.gangFromUserListOpenId;
                            for (var v = 0; v < firstGangUserPaiList.length; v++) {
                                if (user.huGangPaiInOtherUserFromOpenId == firstGangFromUserListOpenId[v]) {
                                    var firstUserGangExistUser = firstUserGangExistUser[v];
                                    var firstUserGangList = [];
                                    if (firstUserGangExistUser != undefined && firstUserGangExistUser != null) {
                                        firstUserGangList = firstUserGangExistUser.split(";");
                                        var score = 0;
                                        if (firstGangTypeList[v] + "" == "1") {
                                            score = 1;
                                        }
                                        if (firstGangTypeList[v] + "" == "2") {
                                            score = 2;
                                        }
                                        var tempUserCacheList = [];
                                        for (var t = 0; t < firstUserGangList.length; t++) {
                                            if (firstUserGangList[t] != user.openid) {
                                                tempUserCacheList.push(firstUserGangList[t]);
                                            }
                                        }
                                        if (tempUserCacheList.length == 0) {
                                            resultScoreceHuJiao = score
                                        } else {
                                            resultScoreceHuJiao = tempUserCacheList.length * score
                                        }

                                    }
                                }

                            }
                            if (user.roundScoreCount == undefined || user.roundScoreCount == null) {
                                user.roundScoreCount = 0;
                            }
                            user.roundScoreCount = user.roundScoreCount + resultScoreceHuJiao;
                            user.huPaiDetails = user.huPaiDetails + " 呼叫转移 " + resultScoreceHuJiao + ";"
                            firstGangUser.roundScoreCount = firstGangUser.roundScoreCount - resultScoreceHuJiao;
                            firstGangUser.huPaiDetails = firstGangUser.huPaiDetails + " 呼叫转移 -" + resultScoreceHuJiao + ";"
                        }
                    }
                }
            } else {
                noHuList.push(userList[i]);
            }
        }
        //查叫，查花猪
        var chaFanShu = 0;
        var xiaJiaoUserList = [];
        var noXiaJiaoUserList = [];
        //查叫
        for (var i = 0; i < noHuList.length; i++) {
            //查花猪 
            //user.maxFanShu
            if (noHuList[i].tingJiao) {
                xiaJiaoUserList.push(noHuList[i]);
                //chaFanShu = user.maxFanShu;
            } else {
                noXiaJiaoUserList.push(noHuList[i]);

            }

        }
        //console.log("xiaJiaoUserList:" + xiaJiaoUserList.toString());
        //console.log("noXiaJiaoUserList:" + noXiaJiaoUserList.toString());
        if (xiaJiaoUserList != undefined && xiaJiaoUserList.length > 0) {
            if (noXiaJiaoUserList != undefined && noXiaJiaoUserList.length > 0) {
                for (var j = 0; j < noXiaJiaoUserList.length; j++) {
                    chaFanShu = 0;
                    var peiFuFenShu = 0;
                    var noXiaJiaoUser = noXiaJiaoUserList[j];
                    var isHuaZhuFlag = this.checkHuaZhu(noXiaJiaoUser);
                    for (var k = 0; k < xiaJiaoUserList.length; k++) {

                        if (noXiaJiaoUserList[j].huPaiDetails == undefined || noXiaJiaoUserList[j].huPaiDetails == null) {
                            noXiaJiaoUserList[j].huPaiDetails = "";
                        }
                        if (isHuaZhuFlag) {
                            chaFanShu = maxFan;
                            noXiaJiaoUserList[j].huPaiDetails = noXiaJiaoUserList[j].huPaiDetails + "查花猪 "
                        } else {
                            chaFanShu = xiaJiaoUserList[k].maxFanShu;
                        }

                        //get the pei fu fan shu .
                        var b = 1;
                        if (chaFanShu == 0) {
                            peiFuFenShu = 1;
                        } else {
                            for (var n = 1; n <= chaFanShu; n++) {
                                b = b * 2;
                            }
                            peiFuFenShu = b;
                        }

                        if (xiaJiaoUserList[k].huPaiDetails == undefined || xiaJiaoUserList[k].huPaiDetails == null) {
                            xiaJiaoUserList[k].huPaiDetails = "";
                        }
                        xiaJiaoUserList[k].huPaiDetails = xiaJiaoUserList[k].huPaiDetails + " 查叫得分:" + peiFuFenShu + ";";
                        if (xiaJiaoUserList[k].roundScoreCount == undefined || xiaJiaoUserList[k].roundScoreCount == null) {
                            xiaJiaoUserList[k].roundScoreCount = 0;
                        }
                        xiaJiaoUserList[k].roundScoreCount = xiaJiaoUserList[k].roundScoreCount + peiFuFenShu;


                    }

                    noXiaJiaoUserList[j].huPaiDetails = noXiaJiaoUserList[j].huPaiDetails + " 赔叫失分:-" + peiFuFenShu + ";"
                    if (noXiaJiaoUserList[j].roundScoreCount == undefined || noXiaJiaoUserList[j].roundScoreCount == null) {
                        noXiaJiaoUserList[j].roundScoreCount = 0;
                    }

                    noXiaJiaoUserList[j].roundScoreCount = noXiaJiaoUserList[j].roundScoreCount - peiFuFenShu * xiaJiaoUserList.length;
                }
            }
        }



        Global.userList = userList;

    },

    //查花猪 
    checkHuaZhu: function (user) {
        var isHuaZhu = false;
        var quePai = user.quePai;

        if (quePai != null && quePai != undefined) {
            var paiList = user.paiListArray;

            for (var i = 0; i < paiList.length; i++) {
                var pai = paiList[i] + "";
                pai = pai + "";
                pai = pai.trim();

                if (quePai + "" == pai[0] + "") {
                    isHuaZhu = true;
                }
            }
        }

        return isHuaZhu;
    },
    //existUserString
    testScoreOutput: function () {

        var userList = Global.userList;
        for (var i = 0; i < userList.length; i++) {
            var score = userList[i].roundScoreCount;
            var details = userList[i].huPaiDetails;
            console.log("user:" + userList[i].openid + "--" + score);
            console.log("user details:" + details);
        }

    },
    //--------------count pai list---------------------------------------
    countHuPaiFanshu: function (pengList, gangList, paiList, huPai) {
        var fanShu = 0;
        var gameMode = Global.gameMode;
        var details = "";
        var returnArray = [];

        var caChepailist = [];
        var daDuiZiFlag = true;
        var qingYiSeFlag = true;
        var qiaoQiDuiFlag = true;
        var anGangFlag = false;
        var anGangCount = 0;
        var yaoJiuFlag = false;
        var jiangDuiFlag = true;
        var menqingFlag = true;
        var zhongZhangFlag = true;

        var huPaiDaiGang = false;


        var minPai = paiList[0];
        minPai = minPai + "";
        var minPaiType = minPai[0];
        for (var i = 0; i < paiList.length; i++) {
            var paiArrayCache = []
            var pai = paiList[i] + "";
            pai = pai.trim();
            if (pai != "2" && pai != "5" && pai != "8") {
                jiangDuiFlag = false;
            }
            var paiType = pai[0] + "";
            var count = this.countElementAccount(pai, paiList);
            paiArrayCache.push(pai);
            paiArrayCache.push(count);
            if (count == 1) {
                daDuiZiFlag = false;
                qiaoQiDuiFlag = false;
                jiangDuiFlag = false;
            }

            if (count == 3) {
                qiaoQiDuiFlag = false;
            }
            if (count == 4) {
                daDuiZiFlag = false;
                anGangFlag = true;
                jiangDuiFlag = false;
                anGangCount++;
            }
            if (paiType != minPaiType) {
                qingYiSeFlag = false;
            }
            // 1,9 check 

            if (count == 1) {
                if (pai == "4" || pai == "5" || pai == "6") {
                    yaoJiuFlag = false;
                }
            } else {
                if (pai != "1" && pai != "9") {
                    yaoJiuFlag = false;
                }
            }

            //zhongzhang flag
            if (pai == "1" || pai == "9") {
                zhongZhangFlag = false;
            }
            //console.log("paiArrayCache:" + paiArrayCache.toString());

            caChepailist.push(paiArrayCache);
        }

        //qing yi se 
        if (gangList != null && gangList != undefined && gangList.length > 0) {
            for (var i = 0; i < gangList.length; i++) {
                var pai = gangList[i] + "";
                pai = pai.trim();
                var paiType = pai[0] + "";
                if (paiType != minPaiType) {
                    qingYiSeFlag = false;
                }

                if (pai != "1" && pai != "9") {
                    yaoJiuFlag = false;
                }

                // fanShu = fanShu + 1;
                //huPaiDaiGang

                if (huPai + "" == pai) {
                    huPaiDaiGang = true;
                }
            }

            qiaoQiDuiFlag = false;
            menqingFlag = false;
        }
        console.log("1554:" + fanShu);
        console.log("2276:" + pengList);
        console.log("2277:" + minPaiType);
        if (pengList != null && pengList != undefined && pengList.length > 0) {
            for (var i = 0; i < pengList.length; i++) {
                var pai = pengList[i] + "";
                pai = pai.trim();
                var paiType = pai[0] + "";
                if (paiType != minPaiType) {
                    qingYiSeFlag = false;
                }
                if (pai != "1" && pai != "9") {
                    yaoJiuFlag = false;
                }

                if (huPai + "" == pai) {
                    huPaiDaiGang = true;
                }
            }

            qiaoQiDuiFlag = false;
            menqingFlag = false;

        }

        if (daDuiZiFlag) {
            fanShu = fanShu + 1;
            details = details + " 大对子:1番;"
        }

        if(huPaiDaiGang){
              details = details + " 胡牌带杠:1番;"
              fanShu = fanShu + 1;
        }


        if (qingYiSeFlag) {
            fanShu = fanShu + 2;
            details = details + "清一色:2番;"
        }


        if (qiaoQiDuiFlag) {
            fanShu = fanShu + 2;
            details = details + "巧七对:2番;"
        }

        if (anGangFlag) {
            fanShu = fanShu + anGangCount;
            details = details + "自杠:" + anGangCount + "番;"
        }


        if (gameMode.dai19JiangDui + "" == "1") {
            if (yaoJiuFlag) {
                fanShu = fanShu + 2;
                details = details + "带幺九:2番;"
            }
        }
        if (gameMode.mengQingZhongZhang + "" == "1") {
            if (menqingFlag) {
                fanShu = fanShu + 1;
                details = details + "门清:1番;"
            }
            if (zhongZhangFlag) {
                fanShu = fanShu + 1;
                details = details + "中张:1番;"
            }
        }

        console.log("1612:" + fanShu);
        //qiao qi dui 
        returnArray.push(fanShu);
        returnArray.push(details);
        return returnArray

    },
    /**Set the gang score for user and other exist  */
    setExistUserRoundCount: function (existUserStr, type, user) {
        console.log("existUserStr:" + existUserStr);
        var score = 0;
        if (type == "1") {
            score = 1;
        }
        if (type == "2") {
            score = 2;
        }
        var existUserList = existUserStr.split(";");
        for (var i = 0; i < existUserList.length; i++) {
            console.log("existUserList[i]:" + existUserList[i]);
            var existUser = this.getCurreentUserByOpenId(existUserList[i]);
            if (existUser.roundScoreCount == null || existUser.roundScoreCount == undefined || existUser.roundScoreCount == "") {
                existUser.roundScoreCount = 0 - score;
            } else {
                existUser.roundScoreCount = existUser.roundScoreCount - score;
            }
            if (existUser.huPaiDetails == undefined) {
                existUser.huPaiDetails = "";
            }
            existUser.huPaiDetails = existUser.huPaiDetails + "被杠失分:-" + score + ";"
            console.log(" existUser.roundScoreCount:" + existUser.roundScoreCount);
            console.log(" existUser.huPaiDetails:" + existUser.huPaiDetails);
        }

        if (user.roundScoreCount == null || user.roundScoreCount == undefined || user.roundScoreCount == "") {
            user.roundScoreCount = score * existUserList.length;
        } else {
            user.roundScoreCount = user.roundScoreCount + score * existUserList.length;
        }
        if (score == 2) {
            user.huPaiDetails = user.huPaiDetails + "自杠得分:" + score * existUserList.length + ";"
        } else {
            user.huPaiDetails = user.huPaiDetails + "杠牌得分:" + score * existUserList.length + ";"
        }
        console.log(" user.roundScoreCount:" + user.roundScoreCount);
        console.log(" user.huPaiDetails:" + user.huPaiDetails);


    },
    //----------------untils-------------------------------
    changeJsonListStringToArrayString: function (tempString) {
        var str = "";
        if (tempString != null && tempString != undefined) {
            tempString = tempString.replace("[", "");
            tempString = tempString.replace("]", "");
            var list = tempString.split(",");
            for (var i = 0; i < list.length; i++) {
                if (list[i] != null && list[i] != undefined) {
                    var s = list[i] + "";
                    s = s.trim();
                    str = str + s + ","
                }
            }
        }
        if (str.substring(str.length - 1) == ",") {
            str = str.substring(0, str.length - 1)
        }
        return str;

    },
    getCurreentUserByOpenId: function (openid) {

        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == openid) {
                user = userList[i];
            }
        }

        return user;

    },
    countElementAccount: function (pai, paiList) {
        var count = 0;
        for (var i = 0; i < paiList.length + 1; i++) {
            if (paiList[i] == pai) {
                count++
            }
        }

        return count

    },
});
