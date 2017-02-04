
var paiListReOrderCount = "3"
var nodeMoveX = -1;
var nodeMoveY = -1;
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
        paiActionType: String,
        alertMessageNode: cc.Node,
        tableNode: cc.Node,
        selfChuPaiListNode: cc.Node,
        paiChuPaiNode: cc.Prefab,
        theMoveNode: cc.Node,
        //tableUserInfo:cc.Node,
        //paiListReOrderCount:cc.Integer,
    },

    // use this for initialization
    //chuPaiActionType
    onLoad: function () {
        var tableUserInfo = cc.find("tableUserInfo");
        tableUserInfoScript = tableUserInfo.getComponent("tableUserInfo");

    },


    setPaiListReOrderCount: function (number) {
        paiListReOrderCount = number;
    },
    //----------Data layer utils function---------------------------------
    getCorrectIndexByNumber: function (paiNumber, user) {

        var paiListArray = user.paiListArray;
        var index = -1;
        for (var i = 0; i < paiListArray.length; i++) {
            if (paiListArray[i] == paiNumber) {
                index = i;
            }
        }
        return index;
    },


    //----------Data layer utils function end---------------------------------



    //--------------------action layer utils function---------------------------

    addPaiIntoPaiListNode: function (userChuPaiListNode, name, userPoint, paiNode) {
        var user = this.getCorrectUserByPoint(userPoint);
        var x = user.chupaiListX;
        var y = user.chupaiListY;
        var paiPath = this.getChuPaiNameByNodeName(name, userPoint);
        cc.log("paiPath:" + paiPath);
        var pNode = cc.instantiate(this.paiChuPaiNode);


        if (userPoint == "3") {
            if (user.chuPaiCount >= paiListReOrderCount) {
                pNode.setLocalZOrder(10);
                pNode.zIndex = 10;
            } else {
                pNode.setLocalZOrder(20);
                pNode.zIndex = 20;
            }
        }


        if (userPoint == "4") {
            pNode.setLocalZOrder(100 - parseInt(user.chuPaiCount));
            pNode.zIndex = 100 - parseInt(user.chuPaiCount);
        }

        //let sprite = pNode.addComponent(cc.Sprite)
        pNode.name = "pai" + userPoint + "_" + name;
        pNode.active = false;
        pNode.position = cc.p(x, y);
        //pNode.width = 42;
        //pNode.height = 61;
        var sprite = pNode.getComponent(cc.Sprite);
        cc.loader.loadRes(paiPath, function (err, sp) {
            if (err) {
                //  cc.log("----" + err.message || err);
                return;
            }
            // cc.log("85");


            sprite.spriteFrame = new cc.SpriteFrame(sp);

            //  cc.log("99");
            // cc.log('Result should be a sprite frame: ' + (sp instanceof cc.SpriteFrame));
            // pNode.active = true;

        });
        userChuPaiListNode.addChild(pNode);

        var finished = cc.callFunc(this.playSlefChuPaiAction_addChild, this, pNode);
        var moveToY = 0;

        if (userPoint == "3") {
            moveToY = y + 220;
        }
        if (userPoint == "1") {
            moveToY = y - 110;
        }
        cc.log("y:" + y);
        cc.log("moveToY:" + moveToY);
        var action = cc.sequence(cc.moveTo(0.15, x, moveToY), cc.scaleTo(0.15, 0.5), cc.removeSelf(), finished);
        //it is other user chupai ,get the first child element 

        paiNode.runAction(action);
        var spriteFrame = paiNode.getComponent(cc.Sprite).spriteFrame;
        var deps = cc.loader.getDependsRecursively(spriteFrame);
        cc.loader.release(deps);
        //user.chuPaiCount = user.chuPaiCount + 1;

        //remove paiNode from partnet
        //cc.log("132:"+paiNode.parent.name);
        // paiNode.removeFromParent();
        //userChuPaiListNode.addChild(paiNode);
       
        return user

    },
    //-------------------game action-------------------------------
    slefChuPaiAction: function (paiNumber) {
        var paiNode = cc.find("user3Node", this.tableNode);
        var children = paiNode.children;
        var selfPaiList = this.getSelfPaiList();
        var userInfo = Global.userInfo;
        var openid = userInfo.openid;
        //---data layer start--------
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var temp = childredName.split("_")
            var sType = temp[1].trim();
            var index = parseInt(temp[0].trim().replace("pai", ""));
            if (paiNumber == sType) {
                selfPaiList.splice(index, 1);
                this.setUserPaiList(openid, selfPaiList);


                break;
            }
        }
        //****fix the node name for the new pai list. */

        //----data layer end-----------
        //insert pai action comic action .
        // remove the pai from self list
        //move rest pai to correct point ,and keep the blank for 14 pai
        //insert the 14 pai into correct point .



    },
    testOtherChuPai: function () {
        this.playOtherChuPaiAction("22", "1");
        this.playOtherChuPaiAction("27", "2");
        this.playOtherChuPaiAction("27", "4");
        this.disableAllSlefPaiAfterQuePai();
    },
    /**
     * This method will execute the other chupai action 
     */
    playOtherChuPaiAction: function (paiNumber, userPoint) {
        //var user = this.getCorrectUserByPoint(userPoint);
        var paiPath = this.getChuPaiNameByNodeName(paiNumber, userPoint);
        // var x = user.chupaiListX;
        //  var y = user.chupaiListY;
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + userPoint + "ChuaPaiListNode", tableNode);
        var userPaiList = cc.find("user" + userPoint + "PaiList", tableNode);
        // cc.log("userPaiList:" + userPaiList.name);
        //    cc.log("userPaiList children:" + userPaiList.children.length);
        var paiNode = userPaiList.children[0]
        //   cc.log("paiNode:" + paiNode.name);
        var user = this.addPaiIntoPaiListNode(userChuPaiListNode, paiNumber, userPoint, paiNode);

        user = this.fixCurrentChuPaiPoint(user);
        this.updateUserListInGobal(user);

    },
    /**
     * This method will execute the anication of chupai in self pai list
     */
    playSlefChuPaiAction: function (paiNode, userPoint) {
        // var user = this.getCorrectUserByPoint(userPoint);
        var name = paiNode.name;

        var tempArray = name.split("_");
        name = tempArray[1];

        // cc.log("user.chupaiListX:" + user.chupaiListX);

        // cc.log("x:" + x + "----" + "y:" + y);
        //, cc.removeSelf()



        //add the target pai into pai list.
        var parentNode = paiNode.parent.parent;
        //  cc.log("parentNode:" + parentNode.name);
        var userChuPaiListNode = cc.find("user" + userPoint + "ChuaPaiListNode", parentNode);
        //   cc.log("userChuPaiListNode:" + userChuPaiListNode);

        var user = this.addPaiIntoPaiListNode(userChuPaiListNode, name, userPoint, paiNode);
        user.chuPaiPointX = paiNode.x;
        user = this.fixCurrentChuPaiPoint(user);

        //Now, we need insert the 14 into correct point
        var chupaiIndex = parseInt(tempArray[0].replace("pai", ""));
        var mopaiInsertIndex = this.getPaiInsertIndexBy14();
        cc.log("mopaiInsertIndex:" + mopaiInsertIndex);
        cc.log("chupaiIndex:" + chupaiIndex);
        //move the other pai into correct point


        if (chupaiIndex != mopaiInsertIndex) {
            mopaiInsertIndex = this.moveOtherPaiIntoCorrectPoint(mopaiInsertIndex, chupaiIndex);
        }
        //move the 14 pai into correct point
        this.moveLastestPaiToPoint(mopaiInsertIndex);
        //datalayer -------------------------------------------

        var paiList = this.removeElementByNumberFromUser(paiNode, 1)
        cc.log("235:" + paiList);
        user.paiListArray = paiList;
        user = this.insertMoPaiIntoPaiList(user);
        user = this.synchronizationPaiList(user);
        user.userMoPai = "";
        cc.log("user openid:" + user.openid)
        this.updateUserListInGobal(user);
        cc.log("241:" + user.paiList);
        //this.fixUserSelfPaiPoinst();
        this.removeAllNodeFromSelfPaiList();
        //tableUserInfoScript.intalSelfPaiList(user.paiList);

        //add pai to correct point  

        // pNode.active = true;
        //add it to curernt 
        //  eval("this.user" + point + "PaiListNode.addChild(paiNode)");

    },

    /**
     * fix the point for self pai list
     */

    fixUserSelfPaiPoinst: function () {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var childrens = parentNode.children
        var startPoint = -520;
        cc.log("264:"+childrens.length);
        for (var i = 0; i < childrens.length; i++) {
            var child = childrens[i];
            child.position = cc.p(startPoint + i * 79, 0);
            cc.log("ponit:"+i+":"+(startPoint + i * 79)+"::"+child.name);
        }

    },

    playSlefInserterPaiAction: function (chupaiIndex, mopaiIndex) {
        //first we should decide if move the pai or not move 
        if (chupaiIndex == mopaiIndex) {

        } else if (chupaiIndex > mopaiIndex) {

        } else {
            //chupaiIndex<mopaiIndex

        }
    },
    moveOtherPaiIntoCorrectPoint: function (mopaiInsertIndex, chuPaiIndex) {

        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var children = parentNode.children;
        cc.log("288:"+children.length);
        var user = this.getCorrectUserByPoint("3");
        var chuPaiPointX = user.chuPaiPointX;
        var moveDistance = 0

        if (mopaiInsertIndex > chuPaiIndex) {
            cc.log(">>>>>:");

            for (var i = chuPaiIndex + 1; i < mopaiInsertIndex; i++) {
                var node = children[i]
                var action = cc.moveTo(0.1, node.x - 84, node.y);
                node.runAction(action);

            }
            mopaiInsertIndex--
        } else {
            cc.log("<<<<<<:");
            for (var i = chuPaiIndex - 1; i > mopaiInsertIndex - 1; i--) {
                var node = children[i]
                var action = cc.moveTo(0.1, node.x + 84, node.y);
                node.runAction(action);

            }

        }

        return mopaiInsertIndex

    },
    /**
     * Move the latest pai in to correct position 
     */
    moveLastestPaiToPoint: function (index) {
        index = parseInt(index);
        var latestPaiPoint = this.getPoinstByIndexFromSelfPaiList(13);
        var latestPaiX = latestPaiPoint.x;
        var chuPaiPoint = this.getPoinstByIndexFromSelfPaiList(index);
        var chuPaiX = chuPaiPoint.x;
        var painode = this.getPaiNodeByIndex(13);

        var contronalX = chuPaiX + Math.abs(latestPaiX - chuPaiX) / 2;
        chuPaiPoint.y = 0;

        var bezier = [latestPaiPoint, cc.p(contronalX, 30), chuPaiPoint];
        var bezierTo = cc.bezierTo(0.6, bezier);


        painode.runAction(bezierTo);
    },
    //------------------------------------------------------------------------

    playSlefChuPaiAction_addChild: function (target, pNode) {
        //    cc.log("playSlefChuPaiAction_addChild");
        pNode.active = true;


    },

    /**
     * 
     */

    updateUserListInGobal: function (user) {
        var userList = Global.userList;

        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == user.openid) {
                userList[i] = user;

            }
        }
        Global.userList = userList;

    },
    /**
     * This method will  fix the pai in the chupai list point
     */

    fixCurrentChuPaiPoint: function (user) {
        // var user = this.getCorrectUserByPoint(userPoint);
        var userIndex = user.pointIndex;
        if (userIndex == "1") {


            if (user.chuPaiCount == paiListReOrderCount) {
                user.chupaiListY = -95;
                user.chupaiListX = 210;

            } else {
                user.chupaiListX = user.chupaiListX - 42;
            }




        }
        cc.log("this.paiListReOrderCount:" + paiListReOrderCount);
        if (userIndex == "2") {
            if (user.chuPaiCount == paiListReOrderCount) {
                user.chupaiListY = 120;
                user.chupaiListX = 226;

            } else {
                user.chupaiListY = user.chupaiListY - 35;
            }

        }
        if (userIndex == "3") {

            if (user.chuPaiCount == paiListReOrderCount) {
                user.chupaiListY = 3;
                user.chupaiListX = -210;

            } else {
                user.chupaiListX = user.chupaiListX + 42;
            }
        }
        if (userIndex == "4") {
            if (user.chuPaiCount == paiListReOrderCount) {
                user.chupaiListX = -225;
                user.chupaiListY = -120;


            } else {
                user.chupaiListY = user.chupaiListY + 35;
            }

        }

        user.chuPaiCount = user.chuPaiCount + 1;
        // cc.log("user.chupaiListX 200:"+user.chupaiListX);
        return user;

    },
    /**
     * This method will get the correct image path from image folder of resourecs
     */
    getChuPaiNameByNodeName: function (paiName, userIndex) {
        var returnName = "";
        var backPrefix = "";
        var folderName = "user" + userIndex;
        var type = paiName[0];
        var number = paiName[1];
        var firstPrefix = "";
        var backPrefix2 = "";
        if (userIndex == "1") {
            backPrefix = "-u";
        }
        if (userIndex == "2") {
            backPrefix = "-l";
        }
        if (userIndex == "3") {
            backPrefix = "-d";
        }
        if (userIndex == "4") {
            backPrefix = "-r";
        }

        if (type == "1") {
            firstPrefix = "tong";
            backPrefix2 = "b";
        }
        if (type == "2") {
            firstPrefix = "tiao"
            backPrefix2 = "t";
        }
        if (type == "3") {
            firstPrefix = "wan"
            backPrefix2 = "w";
        }

        returnName = folderName + "/" + firstPrefix + backPrefix + "/" + number + backPrefix2
        return returnName;

    },
    //-------------------game action end -------------------------------
    setUserPaiList: function (openid, paiList) {
        var userList = Global.userList;
        var paiListStr = paiList.toString();
        paiListStr = paiListStr.replace("[", "");
        paiListStr = paiListStr.replace("]", "");
        //   var userInfo = Global.userInfo;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == openid) {
                userList[i].paiListArray = paiList;
                userList[i].paiList = paiListStr;
            }
        }

        Global.userList = userList;

    },
    getCorrectUserByPoint: function (pointIndex) {

        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].pointIndex == pointIndex) {
                user = userList[i];
            }
        }

        return user;

    },
    getSelfPaiList: function () {

        var userList = Global.userList;
        var userInfo = Global.userInfo;
        var paiList;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userInfo.openid) {
                paiList = userList[i].paiListArray;
            }
        }

        return paiList;

    },

    getQuePai: function () {
        var quePai;
        var userList = Global.userList;
        var userInfo = Global.userInfo;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userInfo.openid) {
                quePai = userList[i].quePai;
            }
        }

        return quePai;

    },


    chuPaiAction: function (event) {

        var actionType = Global.chuPaiActionType;
        var gameMode = Global.gameMode;
        var huanSanZhangPaiList = Global.huanSanZhangPaiList;
        var node = event.target;
        var name = node.name;
        var temp = name.split("_");
        var paiNumTxt = temp[1];
        var chuPaiIndex = -1;
        chuPaiIndex = temp[0].replace("pai");
        // var index = parseInt(name.substring(7));
        // cc.log("index:" + index);
        //var paiList = this.getSelfPaiList();
        cc.log("Global.chuPaiActionType:" + Global.chuPaiActionType);
        var parentNode = node.parent;
        if (node.y == 0) {
            //move out
            var action = cc.moveTo(0.1, node.x, node.y + 20);
            node.runAction(action);
            if (Global.chuPaiActionType == "huanSanZhang") {
                if (gameMode.huanSanZhang == "1") {
                    //cc.log("parentNode:" + parentNode.name);
                    if (huanSanZhangPaiList.length < 3) {
                        huanSanZhangPaiList.push(paiNumTxt);
                    }
                    //disable all other pai 
                    this.disableAllSlefPaiExceptSelected(parentNode, node, huanSanZhangPaiList);
                    //} 

                }
            } else {

                this.putBackAllPaiExceptClickPai(parentNode, name);

            }
        } else {


            if (Global.chuPaiActionType == "huanSanZhang") {
                //huan sanzhang move back 
                if (gameMode.huanSanZhang == "1") {
                    var action = cc.moveTo(0.1, node.x, 0);
                    node.runAction(action)
                    if (huanSanZhangPaiList == null || huanSanZhangPaiList == undefined) {
                        this.enabledAllSelfPai(parentNode);
                    } else {
                        huanSanZhangPaiList.splice(huanSanZhangPaiList.length - 1, 1)
                        if (huanSanZhangPaiList.length == 0) {
                            this.enabledAllSelfPai(parentNode);
                        } else {
                            if (huanSanZhangPaiList.length < 3) {
                                this.enabledSlefSelfPai(parentNode, huanSanZhangPaiList);
                            }
                        }
                    }
                }
            } else {
                //normal chupai 
                //enable all pai after quepai clean 
                this.playSlefChuPaiAction(node, "3");

            }
        }


        cc.log("huanSanZhangPaiList:" + huanSanZhangPaiList.toString());

    },

    getTypeByName: function (childredName) {
        var temp = childredName.split("_")
        var sType = temp[1];
        sType = sType.substring(0, 1);
        return sType;
    },

    putBackAllPaiExceptClickPai: function (parentNode, clickPaiName) {
        var children = parentNode.children;


        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            if (childredName != clickPaiName) {
                if (children[i].y > 0) {
                    var action = cc.moveTo(0.1, children[i].x, 0);
                    children[i].runAction(action);
                }

            }
        }

    },
    onEnable: function () {
        cc.log("this node :" + this.node.name + "  enabled");
    },
    onDisable: function () {
        cc.log("this node :" + this.node.name + "  disabled");
    },
    throwActionForNode: function (theNode) {
        cc.log(" throwActionForNode:");
        //  var sourceY;
        // var sourceX;
        theNode.on(cc.Node.EventType.TOUCH_START, function (event) {

            cc.log("touch start:" + theNode.name);
            this.sourceY = this.y;
            this.sourceX = this.x;
            cc.log("cc.Node.EventType.TOUCH_START:" + this.sourceY);
        }, theNode);
        theNode.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            cc.log("touch move :" + this.name);
            //var touches = event..getDeltaX();
            //var touchesLoc = touches[0].getLocation();
            //  cc.log(" touchesLoc:" + touchesLoc.toString());

            var x = event.getDeltaX();
            var y = event.getDeltaY();
            this.x += x;
            this.y += y;

            var btn = this.getComponent(cc.Button);
            if (btn != null && btn != undefined) {
                btn.interactable = false;
                btn.enableAutoGrayEffect = false;
            }


            // this.theMoveNode = theNode;
            // cc.log(" nodeMoveX:" + nodeMoveX);
            //   cc.log(" nodeMoveY:" + nodeMoveY);
            //var x = touches[0].getLocationX();
        }, theNode);
        theNode.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("cc.Node.EventType.TOUCH_END:" + theNode.sourceY);
            var endY = Math.floor(Math.abs(theNode.y - theNode.sourceY));
            cc.log("endY:" + endY);

            if (endY > 100) {
                var name = theNode.name;
                if (name.indexOf("_") > 0) {
                    var tempArray = name.split("_");
                    name = tempArray[1];
                };
                var partenName = theNode.parent.name;
                partenName = partenName.replace("PaiList", "");
                var userPoint = partenName.replace("user", "");
                var tableNode = cc.find("Canvas/tableNode");
                var userChuPaiListNode = cc.find(partenName + "ChuaPaiListNode", tableNode);
                cc.log("userChuPaiListNode:" + userChuPaiListNode.name);

                var user = this.addPaiIntoPaiListNode(userChuPaiListNode, name, userPoint, theNode);

                user = this.fixCurrentChuPaiPoint(user);
                this.updateUserListInGobal(user);

            } else {
                var btn = theNode.getComponent(cc.Button);
                btn.interactable = true;
                theNode.x = theNode.sourceX;
                theNode.y = theNode.sourceY;
            }

            //var x = touches[0].getLocationX();
        }, this);

    },
    /**
     * this.node.on('touchstart', function(event) {
var touches = event.getTouches();
var x = touches[0].getLocationX();
}, this);
     */
    //touchmove,'touchstart',touchend
    // when the mo pai action execute,it will disabled all other pai type ,if the que pai type in the pai list
    disableAllSlefPaiAfterQuePai: function () {
        cc.log("throwActionForNode disableAllSlefPaiAfterQuePai:");
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);

        var existFlag = this.checkQuePaiInSelf();
        //if (existFlag) {
        var children = parentNode.children;
        cc.log("throwActionForNode children length:" + children.length);
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            cc.log("throwActionForNode childredName:" + childredName);
            var btn = children[i].getComponent(cc.Button);
            var sType = this.getTypeByName(childredName);
            //if (sType == que) {

            btn.interactable = true;

            this.throwActionForNode(children[i]);
            //} else {
            //   btn.interactable = false;
            //  }
        }
        //}

    },
    // after all que pai clean ,the all other pai should be enable
    enabledAllPaiAfterQuePai: function (parentNode) {
        var existFlag = this.checkQuePaiInSelf();

        if (existFlag == false) {
            this.enabledAllPai(parentNode);
        } else {
            //disable other pai ,only enable the que pai

        }

    },
    enabledAllPai: function (parentNode) {
        var children = parentNode.children;
        for (var i = 0; i < children.length; ++i) {
            var btn = children[i].getComponent(cc.Button);
            btn.interactable = true;
        }
    },
    enabledSlefSelfPai: function (parentNode, huanSanZhangPaiList) {
        var firstElement1 = (huanSanZhangPaiList[0] + "").trim();
        //cc.log("firstElement:" + firstElement1);
        var type = firstElement1[0];
        var children = parentNode.children;
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var sType = this.getTypeByName(childredName);
            if (sType == type) {
                var btn = children[i].getComponent(cc.Button);
                btn.interactable = true;
            }
        }

    },
    enabledAllSelfPai: function (parentNode) {
        //  cc.log("enabledAllSelfPai");
        var v = this.getLess3NumberType(parentNode);
        var vstr = v.toString();
        //cc.log("vstr:" + vstr);
        var children = parentNode.children;
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var sType = this.getTypeByName(childredName);
            if (vstr.indexOf(sType) >= 0) {

            } else {
                var btn = children[i].getComponent(cc.Button);
                btn.interactable = true;
            }

        }

    },
    getLess3NumberType: function (parentNode) {
        var v1 = 0;
        var v2 = 0;
        var v3 = 0;
        var children = parentNode.children;
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var sType = this.getTypeByName(childredName);
            if (sType == "1") {
                v1++
            }
            if (sType == "2") {
                v2++
            }
            if (sType == "3") {
                v3++
            }

        }

        var v = [];
        if (v1 < 3) {
            v.push("1")
        }
        if (v2 < 3) {
            v.push("2")
        }
        if (v3 < 3) {
            v.push("3")
        }
        return v;
    },
    disableAllSlefPaiExceptSelected: function (parentNode, node, huanSanZhangPaiList) {
        //cc.log("disableAllSlefPaiExceptSelected");
        var children = parentNode.children;
        var firstElement1 = (huanSanZhangPaiList[0] + "").trim();
        //cc.log("firstElement:" + firstElement1);
        var type = firstElement1[0];
        // cc.log("firstElement: " + "---" + type);
        for (var i = 0; i < children.length; ++i) {
            if (children[i].y == 0) {
                if (node.name != children[i].name) {
                    var childredName = children[i].name;
                    var sType = this.getTypeByName(childredName);
                    //  cc.log("sType:" + sType + "-----" + type);
                    if (sType != type) {
                        var btn = children[i].getComponent(cc.Button);
                        btn.interactable = false;
                    } else {
                        if (huanSanZhangPaiList.length == 3) {
                            if (node.y == 0) {
                                var btn = children[i].getComponent(cc.Button);
                                btn.interactable = false;
                            }
                        }

                    }


                }

            }
        }

    },
    //------------------------utils ------------------------------------------
    insertMoPaiIntoPaiList: function (user) {
        var moPai = user.userMoPai;
        if (moPai != null && moPai != undefined) {
            moPai = parseInt(moPai.trim());
            cc.log("moPai:" + moPai);
            var paiList = user.paiListArray;
            if (paiList.length > 1) {
                var temp = [];
                var insertFlag = false;
                for (var i = 0; i < paiList.length; ++i) {
                    var pai = parseInt(paiList[i].trim());
                    cc.log("loop pai:" + pai)
                    if (moPai < pai) {
                        if (insertFlag == false) {
                            cc.log("insertFlag pai:" + moPai)
                            temp.push(moPai);
                            insertFlag = true;
                        }

                    }
                    temp.push(pai);


                }
                user.paiListArray = temp;
            } else {
                paiList.push(moPai);
                user.paiListArray = paiList;
            }

        }
        cc.log("user open:" + user.openid);
        cc.log("insertMoPaiIntoPaiList user.paiListArray:" + user.paiListArray.toString());
        return user;

    },
    /**
     * Synchronization the pai list array into user pai string 
     */

    synchronizationPaiList: function (user) {

        var paiList = user.paiListArray;
        var temp = "";
        for (var i = 0; i < paiList.length; ++i) {
            temp = temp + paiList[i] + ","
        }
        if (temp.length > 0) {
            temp = temp.substring(0, temp.length - 1)
        }
        user.paiList = temp;
        return user;
    },
    /**
     * remove a element from paiList of user self
     * b---remove element number.
     */
    removeElementByNumberFromUser: function (node, b) {
        var number = node.name;
        var c = 0;
        var temp = number.split("_");
        number = temp[1];
        var paiList = this.getSelfPaiList();
        for (var i = 0; i < paiList.length; ++i) {
            var temp = paiList[i] + "";
            temp = temp.trim();
            if (temp == number) {
                paiList.splice(i, 1);
                c++;
                if (c == b) {
                    break;
                }

            }

        }

        return paiList

    },
    /**
     * Get self pai node by index
     */
    getPaiNodeByIndex: function (index) {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var children = parentNode.children;
        if (index >= children.length) {
            index = children.length - 1;
        }
        cc.log("getPaiNodeByIndex:" + index);
        var childredNode = children[index];
        return childredNode

    },
    /**
     * Get the point from self pai list by index 
     *
     */

    getPoinstByIndexFromSelfPaiList: function (index) {
        cc.log("getPoinstByIndexFromSelfPaiList1:" + index);
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var children = parentNode.children;
        cc.log("children.length:" + children.length);
        if (index >= children.length) {
            index = children.length - 1;
        }
        cc.log("getPoinstByIndexFromSelfPaiList2:" + index);
        var childredNode = children[index];

        var point = cc.p(childredNode.x, childredNode.y);
        return point;

    },
    /**
     * Check it que pai in the self pai list
     */

    checkQuePaiInSelf: function () {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3ChuaPaiListNode", tableNode);
        var que = this.getQuePai();
        var children = parentNode.children;
        var existFlag = false;
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var sType = this.getTypeByName(childredName);
            if (sType == que) {
                existFlag == true
            }
        }

        return existFlag

    },
    removeAllNodeFromSelfPaiList: function () {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var count = parentNode.childrenCount;
cc.log("Node Children Count: " + count);
       // parentNode.removeAllChildren()
    },
    /**
     * Get the correct index by the 14 pai 
     */
    getPaiInsertIndexBy14: function () {
        var index = -1;
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var user = this.getCorrectUserByPoint("3");
        var moPai = parseInt(user.userMoPai);
        var paiList = this.getSelfPaiList();
        if (paiList.length == 1) {

            index = 1;

        } else {
            var firstPai = paiList[0] + "";
            firstPai = firstPai.trim();
            var minPai = parseInt(firstPai);
            var maxIndex = paiList.length - 1;
            if (maxIndex == 13) {
                maxIndex = 12;
            }
            var lastPai = paiList[maxIndex] + "";
            lastPai = lastPai.trim();
            var maxPai = parseInt(lastPai);
            cc.log("moPai:" + moPai);
            cc.log("minPai:" + minPai);
            cc.log("maxPai:" + maxPai);
            if (moPai < minPai) {
                index = 0;
            } else if (moPai > maxPai) {
                index = paiList.length;
            } else {


                for (var i = 0; i < maxIndex; i++) {
                    var paiGet = paiList[i] + "";
                    paiGet = paiGet.trim();
                    var pai = parseInt(paiGet);
                    var nextI = i + 1;
                    if (nextI == paiList.length) {
                        nextI = i
                    }

                    if (nextI == i) {
                        index = paiList.length;
                    } else {
                        var nextPaiStr = paiList[nextI] + "";
                        nextPaiStr = nextPaiStr.trim();
                        var nextPai = parseInt(nextPaiStr);
                        cc.log("pai:" + pai);
                        cc.log("nextPai:" + nextPai);
                        if (pai < moPai && moPai < nextPai) {
                            index = nextI;
                            break;
                        }

                    }

                }

            }
        }


        return index;

    },
    //---------------utils end----------------------------------------------------
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // if (this.theMoveNode != null && this.theMoveNode != undefined) {
        //     cc.log("update this.theMoveNode.interactable:" + this.theMoveNode.interactable);
        //     if (this.theMoveNode.interactable == true || this.theMoveNode.interactable ==undefined) {
        //         cc.log("update:" + this.theMoveNode.name);
        //         if (nodeMoveX !=0 && nodeMoveY !=0) {


        //                   this.theMoveNode.setPosition(this.theMoveNode.x+nodeMoveX,this.theMoveNode.y+nodeMoveY);


        //         }

        //     }
        // }
    },
});
