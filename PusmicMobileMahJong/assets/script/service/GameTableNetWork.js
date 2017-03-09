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



    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        actionUIScriptNode = self.actionNodeScript.getComponent("gameConfigButtonListAction");
        alertMessageUI = self.alertMessageNodeScirpt.getComponent("alertMessagePanle");
        userInfoScript = self.userInfoScriptNode.getComponent("tableUserInfo");
        moPaiScript = self.moPaiActionNode.getComponent("tableMoPaiAction");
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
    },
    connectByPrivateChanel: function () {
        if (client == null || client == undefined) {
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
        client.subscribe("/queue/privateUserChanel" + thisRooNumber, function (message) {
            var bodyStr = message.body;
            cc.log("######################");
            cc.log(bodyStr);
            var obj = JSON.parse(bodyStr);
            if (obj != undefined && obj != null) {
                for (var p in obj) {
                    messageDomain[p] = obj[p]
                }
                actionUIScriptNode.closeLoadingIcon();
                // actionUIScriptNode.showGameTalbe();
                if (messageDomain.messageAction == "buildNewRoundLun") {
                    cc.log(messageDomain.messageBody);
                    var userObj = JSON.parse(messageDomain.messageBody);
                    var userList = [];
                    userObj.pointIndex = "3";
                    userObj.zhuang = "1";
                    userList.push(userObj);
                    Global.userList = userList;
                    actionUIScriptNode.showGameTalbe("1");
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
                        cc.log("%%%%%%Obj:" + Obj.messageExecuteResult);
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
                        cc.log("Global.userList:" + Global.userList.toString())
                        userInfoScript.intalUserInfoReadyIcon();
                    } else {
                        alertMessageUI.text = Obj.messageExecuteResult;
                        alertMessageUI.setTextOfPanel();
                    }

                };
                //--------------------------------------------------
                if (messageDomain.messageAction == "joinExistRoom") {
                    var Obj = JSON.parse(messageDomain.messageBody);
                    var gobalUser = Global.userInfo
                    //Obj=JSON.parse(Obj.messageBody);
                    cc.log("messageBody1:" + messageDomain.messageBody);
                    //cc.log("messageBody2:"+obj.messageBody);

                    var joinRoomJson = JSON.parse(messageDomain.messageBody);
                    var gameUserList = JSON.parse(joinRoomJson.userList);
                    var joinMode = JSON.parse(joinRoomJson.gameMode);

                    if (joinMode != null && joinMode != undefined) {
                        Global.gameMode = joinMode;
                        cc.log("joinMode:" + Global.gameMode.toString());
                    }

                    var userList = [];
                    for (var j = 0; j < gameUserList.length; j++) {
                        var getUser = gameUserList[j]
                        if (getUser.paiList != null && getUser.paiList != undefined) {
                            getUser.paiListArray = getUser.paiList.split(",");

                        }
                        if (getUser.openid == gobalUser.openid) {
                            getUser.pointIndex = "3";
                        }

                        // userObj.pointIndex = "3";
                        userList.push(getUser);
                    }
                    Global.userList = userList;

                    var paiRestCount = 13 * gameUserList.length + 1;
                    paiRestCount = 108 - paiRestCount;
                    var paiListLable = this.paiRestNode.getComponent(cc.Label)
                    paiListLable.string = paiRestCount + "";
                    Global.restPaiCount = paiRestCount;
                    actionUIScriptNode.showGameTalbe("0");
                    userInfoScript.initalUserPai("inital", "joinExist");

                }
                //--------------------------------------------------
                if (messageDomain.messageAction == "joinRoom") {
                    var Obj = JSON.parse(messageDomain.messageBody);
                    cc.log("%%%%%%Obj.messageExecuteFlag:" + Obj.messageExecuteFlag);
                    if (Obj.messageExecuteFlag == "success") {
                        Global.joinRoomNumber = messageDomain.messageBelongsToPrivateChanleNumber;
                        var joinRoomJson = JSON.parse(Obj.messageExecuteResult);
                        var gameUserList = JSON.parse(joinRoomJson.userList);
                        var joinMode = JSON.parse(joinRoomJson.gameMode);
                        if (joinMode != null && joinMode != undefined) {
                            Global.gameMode = joinMode;
                            cc.log("joinMode:" + Global.gameMode.toString());
                        }
                        var existFlag = false;

                        cc.log("%%%%%%Obj:" + Obj.messageExecuteResult);
                        cc.log("%%%%%%gameUserList:" + gameUserList.length);
                        // cc.log("%%%%%%gameUser:"+gameUser.toString());
                        var userList = [];
                        for (var j = 0; j < gameUserList.length; j++) {
                            var getUser = gameUserList[j]
                            cc.log("%%%%%%gamegetUser:" + getUser.openid);
                            userList.push(getUser);
                        }

                        cc.log("userList 1:" + userList.toString());
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
                    }
                }

                if (messageDomain.messageAction == "faPai") {

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
                                cc.log("gameUser.paiList:" + paiListString);
                                user.paiList = paiListString;
                            }

                            //   if (user.openid == userInfo.openid) {
                            //       cc.log("found 3:"+user.openid);
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
                                cc.log("gameUser.paiList:" + paiListString);
                                user.paiList = paiListString;
                            }

                            //   if (user.openid == userInfo.openid) {
                            //       cc.log("found 3:"+user.openid);
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

                //quepai sendQuePai
                if (messageDomain.messageAction == "sendQuePai") {
                    var quePaiUser = JSON.parse(messageDomain.messageBody);
                    cc.log("quePaiUser.quePai:" + quePaiUser.quePai);
                    cc.log("quePaiUser.openid:" + quePaiUser.openid);
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
                        // cc.log("userList2[i].zhuang:" + userList2[i].zhuang);
                        // cc.log("userList2[i].pointIndex:" + userList2[i].pointIndex);
                        if (userList2[i].zhuang == "1") {
                            zhuangOpenId = userList2[i].openid;
                            zhuangInde = userList2[i].pointIndex;
                        }

                        if (userList2[i].openid == userInfo.openid) {
                            currentUser = userList2[i]
                        }
                    }

                    //close all wait Panle .
                    quePaiScript.closeWaitPanel();
                    //show center table
                    cc.log("zhuangInde:" + zhuangInde);
                    tableCenterScript.index = zhuangInde;
                    tableCenterScript.showCenterPoint();
                    //enable self pai list 
                    if (currentUser.openid == zhuangOpenId) {
                        tablePaiActionScript.enabledAllPaiAfterQuePai();
                    }

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

                        //get next user openid 
                        var nextUserOpenId = this.getNextUserByOpenId(fromUserOpenid);
                        if (fromUserOpenid != userInfo.openid) {
                            //reset user action status for each user 
                            for (var i = 0; i < userList.length; i++) {
                                //play chupai action on other side
                                if (obj.fromUserOpenid == userList[i].openid) {
                                    //show the chu pai action on animation
                                    var index = userList[i].pointIndex;
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
                        //only work on the next user 
                        if (nextUserOpenId == userInfo.openid) {
                            for (var i = 0; i < userList.length; i++) {
                                var actionArray = paiActionScript.getActionBarArrayByOpenId(paiNumber, userList[i].openid)
                                cc.log("actionArray:" + actionArray.length);
                                if (actionArray.length > 1) {
                                    userList[i].actionBarFlag = "1";
                                    //
                                } else {
                                    userList[i].actionBarFlag = "0";
                                }
                            }

                            //check if already have action in the other user 
                            var alreadyExistFlag = false;
                            for (var i = 0; i < userList.length; i++) {
                                if (userList[i].actionBarFlag == "1") {
                                    //show 
                                    alreadyExistFlag = true;
                                    this.sendShowActionBarOnOtherUser(userList[i].openid, paiNumber);
                                }
                            }

                            if (alreadyExistFlag == false) {
                                //mopai
                                this.sendMoPaiAction();
                            }
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
                    //---------------gangpai-----------------------------------------------
                    if (obj.actionName == "gangPai") {
                        userInfo = Global.userInfo;
                        var pengFromUserOpenId = obj.fromUserOpenid;
                        var pengPaiNumber = o.paiNumber;
                        var toUserOpenid = o.toUserOpenid;
                        paiActionScript.fromUserOpenId = pengFromUserOpenId;
                        paiActionScript.paiNumber = pengPaiNumber;
                        paiActionScript.gangAction();
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

                        //2.enable all pai
                        var userInfo = Global.userInfo;
                        if (userInfo.openid == toUserOpenid) {
                            moPaiScript.moPaiAction(paiNumber, toUserOpenid);
                            tablePaiActionScript.enabledAllPaiAfterQuePai();
                        } else {
                            moPaiScript.moPaiOnDataLayer(paiNumber, toUserOpenid);
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
                        cc.log("showActionBar action resive ")
                        var fromUserOpenId = obj.fromUserOpenid;
                        var userInfo = Global.userInfo;
                        if (userInfo.openid == fromUserOpenId) {
                            var actionArray = paiActionScript.getSelfActionBarArray(paiNumber);
                            paiActionScript.fromUserOpenId = fromUserOpenId;
                            paiActionScript.paiNumber = paiNumber;
                            paiActionScript.showAction(actionArray);
                        }

                    }

                    //----------------cancleAction-----------------------------------------------

                    if (obj.actionName == "cancleAction") {
                        var userInfo = Global.userInfo;
                        var moPaiUserId = this.getNextUserFromCurentIndex();
                        fromUserOpenId = obj.fromUserOpenid;
                        cc.log("moPaiUserId:" + moPaiUserId);
                        if (moPaiUserId == userInfo.openid) {

                            var userList = Global.userList;
                            for (var i = 0; i < userList.length; i++) {
                                if (userList[i].openid == fromUserOpenId) {
                                    userList[i].actionBarFlag = "0";
                                    cc.log("moPaiUserId actionBarFlag:" + userList[i].openid);
                                }
                            }

                            var alreadyExistFlag = false;
                            for (var i = 0; i < userList.length; i++) {
                                if (userList[i].actionBarFlag == "1") {
                                    //show 
                                    alreadyExistFlag = true;
                                    //this.sendShowActionBarOnOtherUser(userList[i].openid, paiNumber);
                                }
                            }
                            cc.log("moPaiUserId alreadyExistFlag:" + alreadyExistFlag);
                            if (alreadyExistFlag == false) {
                                //mopai
                                this.sendMoPaiAction();
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
            cc.log("websocket connect subscribe Error:233");
            //client.disconnect();
        });
    },
    subscribeToPrivateChanel: function (thisRooNumber) {
        client.connect({}, function () {
            this.subscribeToPrivateChanelNoConnetAgain(thisRooNumber);
        }.bind(this), function () {
            cc.log("websocket connect  Error:234");
            //client.disconnect();
        });

    },
    initalClient: function () {
        if (client == null || client == undefined) {
            this.connectByPrivateChanel();
            this.subscribeToPrivateChanel(roomNumber);

        }

    },
    //-------------------------------chu pai action---------------------------------------------
    sendShowActionBarOnOtherUser: function (showUserOpenid, paiNumber) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = showUserOpenid;
        o.actionName = "showActionBar";
        o.paiNumber = paiNumber;
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
    sendCacleToMoPaiAction: function (userOpenid) {
        var moPaiUserOpenId = this.getNextUserFromCurentIndex();
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = userOpenid;
        o.actionName = "cancleAction";
        o.toUserOpenid = userOpenid;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);

    },
    sendCacleHuPaiAction: function () {

    },
    sendHuPaiAction: function (fromUserOpenId, toUserOpenId, paiNumber, paiType) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        //var gameStep = require("gameStep").gameStep;

        o.fromUserOpenid = fromUserOpenId;
        o.actionName = "pengPai";
        o.paiNumber = paiNumber;
        o.toUserOpenid = toUserOpenId;

        //o.chuPaiType = Global.chuPaiActionType;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
        tableCenterScript.endTimer();
    },
    sendPengPaiAction: function (fromUserOpenId, paiNumber) {
        cc.log("sendPengPaiAction");
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
    sendGangPaiAction: function (fromUserOpenId, toUserOpenId, paiNumber) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        //var gameStep = require("gameStep").gameStep;

        o.fromUserOpenid = fromUserOpenId;
        o.actionName = "gangPai";
        o.paiNumber = paiNumber;
        o.toUserOpenid = toUserOpenId;

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


    sendMoPaiAction: function () {
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

        currentIndex = parseInt(currentIndex);
        if (currentIndex == userList.length) {
            nextIndex = 1
        } else {
            nextIndex = currentIndex + 1
        }

        for (var j = 0; j < userList.length; j++) {
            if (userList[j].pointIndex == nextIndex) {
                nextOpenId = userList[j].openid;
            }
        }

        return nextOpenId

    },

    getNextUserFromCurentIndex: function () {
        var userList = Global.userList;
        var currentIndex = tableCenterScript.index;
        var nextIndex = 0;
        var nextOpenId = "";


        currentIndex = parseInt(currentIndex);
        if (currentIndex == 4) {
            nextIndex = 1
        } else {
            nextIndex = currentIndex + 1
        }

        for (var j = 0; j < userList.length; j++) {
            if (userList[j].pointIndex == nextIndex) {
                nextOpenId = userList[j].openid;
            }
        }

        return nextOpenId

    },

    //--------------------------------------------------------------------------------------------------------
    joinRoom: function (joinRoomNumber) {
        Global.joinRoomNumber = joinRoomNumber;
        client.unsubscribe("sub-" + Global.subid);

        //client.disconnect();
        //this.connectByPrivateChanel();
        this.subscribeToPrivateChanelNoConnetAgain(joinRoomNumber);
        Global.subid = Global.subid + 1;
        cc.log("Global.subid:" + Global.subid);
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
        cc.log("buildNewGameRound-----------------------");
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
            cc.log("buildNewGameRound2-----------------------");
            var messageObj = this.buildSendMessage(JSON.stringify(o), roomNumber, "buildNewRoundLun");

            this.sendMessageToServer(messageObj);
            cc.log("buildNewGameRound3-----------------------");
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
        cc.log("sendQuePai");


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
        cc.log("sendHuanSanZhang userOpenId:" + userOpenId);
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "userHuanSanZhang");
        this.sendMessageToServer(messageObj);

    },
    //-------------------User ready action-------------------------------------------------
    sendUserReadyToServer: function (event) {
        var node = event.target;
        var readyStatu = "0";
        cc.log("node:" + node.name);
        var s = node.getComponent(cc.Sprite);
        cc.log("s:" + s.spriteFrame.name);
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

    //--------------------------------------------------------------------------------------------------------

    sendMessageToServer: function (messageObj) {

        client.send("/app/user_private_message", {}, JSON.stringify(messageObj));

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

    }
});
