
var paiListReOrderCount = "8"
var nodeMoveX = -1;
var nodeMoveY = -1;
var tableUserInfoScript;
var tableNetWorkScript;
var tableCenterTimmerScript;
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
        tableNetWorkScriptNode: cc.Node,
        //tableUserInfo:cc.Node,
        //paiListReOrderCount:cc.Integer,
    },

    // use this for initialization
    //chuPaiActionType
    onLoad: function () {
        var tableUserInfo = cc.find("tableUserInfo");
        tableUserInfoScript = tableUserInfo.getComponent("tableUserInfo");
        var tableNwtWork = cc.find("tableNerWorkScript");
        tableNetWorkScript = tableNwtWork.getComponent("GameTableNetWork");
        var tableCenterTimmer = cc.find("tableCenterPointNode");
        tableCenterTimmerScript = tableCenterTimmer.getComponent("tableCenterPoint");
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

    addPaiIntoPaiListNode: function (userChuPaiListNode, name, userPoint, paiNode, type) {
        var user = this.getCorrectUserByPoint(userPoint);
        var userPaiList = user.paiList;
        cc.log("addPaiIntoPaiListNode userPaiList:" + userPaiList);
        var x = user.chupaiListX;
        var y = user.chupaiListY;
        var paiPath = this.getChuPaiNameByNodeName(name, userPoint);
        cc.log("paiPath:" + paiPath);
        cc.log("addPaiIntoPaiListNode user:" + user.openid);
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
        var finished;
        var paiNodeArray = [];
        paiNodeArray.push(pNode);
        paiNodeArray.push(paiNode);
        paiNodeArray.push(paiNode.parent);
        paiNodeArray.push(userPaiList);
        paiNodeArray.push(user.openid);
        cc.log("type:" + type);
        if (type == 'self') {

            finished = cc.callFunc(this.playSlefChuPaiAction_addChild, this, paiNodeArray);
        } else {
            finished = cc.callFunc(this.playOtherChuPaiAction_addChild, this, paiNodeArray);

        }
        var moveToY = 0;

        if (userPoint == "3") {
            moveToY = y + 220;
        }
        if (userPoint == "1") {
            moveToY = y - 110;
        }
        cc.log("y:" + y);
        cc.log("moveToY:" + moveToY);
        var action
        if (type == 'self') {
            action = cc.sequence(cc.moveTo(0.15, x, moveToY), cc.scaleTo(0.15, 0.5), cc.removeSelf(), finished);
        } else {
            action = cc.sequence(cc.moveTo(0.15, x, moveToY), cc.scaleTo(0.15, 0.5), finished);

        }
        //it is other user chupai ,get the first child element 
        cc.log("127:" + paiNode.parent.childrenCount);
        paiNode.runAction(action);

        //user.chuPaiCount = user.chuPaiCount + 1;

        //remove paiNode from partnet
        cc.log("132:" + paiNode.parent.name);
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
    testRmoveLast: function () {
        var user = this.getCorrectUserByPoint("1");
        this.removeLastPaiOnPaiListByUser(user);

        var index = user.pointIndex;
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + index + "PaiList", tableNode);
        // var chuPaiListNode = cc.find("user" + index + "ChuaPaiListNode",this.tableNode);
        var children = userChuPaiListNode.children;
        cc.log("testOtherChuPai:" + children.length);
    },
    /**
     * This method will execute the other chupai action 
     * 
     */
    playOtherChuPaiAction: function (paiNumber, userPoint) {
        //var user = this.getCorrectUserByPoint(userPoint);
        var paiPath = this.getChuPaiNameByNodeName(paiNumber, userPoint);
        // var x = user.chupaiListX;
        //  var y = user.chupaiListY;
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + userPoint + "ChuaPaiListNode", tableNode);
        var userPaiList = cc.find("user" + userPoint + "PaiList", tableNode);
        var children = userPaiList.children
        // cc.log("userPaiList:" + userPaiList.name);
        //    cc.log("userPaiList children:" + userPaiList.children.length);
        var paiNode = null;
        for (var i = 0; i < children.length; i++) {
          //  cc.log("removeLastPaiOnPaiListByUser lastNode:" + children[i].name);
            if (children[i].name == "autoMoPai") {
                paiNode = children[i];
            }

        }

        if (paiNode == null) {
            paiNode = userPaiList.children[0];
        }

        //   cc.log("paiNode:" + paiNode.name);
        var user = this.addPaiIntoPaiListNode(userChuPaiListNode, paiNumber, userPoint, paiNode, 'other');
        cc.log("playOtherChuPaiAction userPoint:" + userPoint);
        cc.log("playOtherChuPaiAction user:" + user.openid);
        //remove node ON GUI
        //this.removeLastPaiOnChuPaiListByUserOpenId
        //this.removeLastPaiOnPaiListByUser(user);
        // data layer fixed ;
        var paiList = user.paiListArray;
        cc.log("playOtherChuPaiAction paiNumber:" + paiNumber);
        cc.log("playOtherChuPaiAction paiList1:" + paiList.toString());
        paiList = this.removeElementByNumberFromUser(paiNumber, paiList, 1);
        cc.log("playOtherChuPaiAction paiList2:" + paiList.toString());
        user.paiListArray = paiList;

        user = this.fixCurrentChuPaiPoint(user);
        user = this.synchronizationPaiList(user);
        this.updateUserListInGobal(user);
        // this.removeAllNodeFromOtherPaiList(user.pointIndex);
        // tableUserInfoScript.initalOtherPaiList(user.paiList, user.pointIndex, "");


    },
    removeLastPaiOnPaiListByUserOpenId: function (openId) {
        cc.log("removeLastPaiOnPaiListByUser openid:" + openId);
        var user = this.getCorrectUserByOpenId(openId);
        var index = user.pointIndex;
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + index + "PaiList", tableNode);
        // var chuPaiListNode = cc.find("user" + index + "ChuaPaiListNode",this.tableNode);
        var children = userChuPaiListNode.children;
        var lastNode;
        var childrenLen = children.length
        cc.log("removeLastPaiOnPaiListByUser children1:" + userChuPaiListNode.children.length);
        // if (index == "2") {
        //     lastNode = children[0];
        // } else if (index == "1") {
        //     lastNode = children[childrenLen - 1];
        // } else if (index == "4") {
        //     lastNode = children[childrenLen - 1];
        // }

        for (var i = 0; i < children.length; i++) {
            cc.log("removeLastPaiOnPaiListByUser lastNode:" + children[i].name);
            if (children[i].name == "autoMoPai") {
                lastNode = children[i];
            }

        }
        if (lastNode != null & lastNode != undefined) {
            lastNode.removeFromParent();
            cc.log("removeLastPaiOnPaiListByUser remove:" + lastNode.name);
        }

        cc.log("removeLastPaiOnPaiListByUser children2:" + userChuPaiListNode.children.length);


        // var tableNode =this.tableNode;
        cc.log("removeLastPaiOnPaiListByUser end");

    },
    removeLastPaiOnPaiListByUser: function (user) {
        var index = user.pointIndex;
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + index + "PaiList", tableNode);
        // var chuPaiListNode = cc.find("user" + index + "ChuaPaiListNode",this.tableNode);
        var children = userChuPaiListNode.children;
        var lastNode;
        var childrenLen = children.length
        cc.log("removeLastPaiOnPaiListByUser children1:" + userChuPaiListNode.children.length);
        if (index == "2") {
            lastNode = children[0];
        } else if (index == "1") {
            lastNode = children[childrenLen - 1];
        } else if (index == "4") {
            lastNode = children[0];
        }

        // for (var i = 0; i < children.length; i++) {
        //     cc.log("removeLastPaiOnPaiListByUser lastNode:" + children[i].name);
        //     lastNode = children[i];
        // }
        if (lastNode != null & lastNode != undefined) {
            lastNode.removeFromParent();
            cc.log("removeLastPaiOnPaiListByUser remove:" + lastNode.name);
        }

        cc.log("removeLastPaiOnPaiListByUser children2:" + userChuPaiListNode.children.length);


        // var tableNode =this.tableNode;
        cc.log("removeLastPaiOnPaiListByUser end");

    },

    removeLastPaiOnChuPaiListByUserOpenId: function (userOpenid) {
        cc.log("removeLastPaiOnChuPaiListByUserOpenId");
        var user = this.getCorrectUserByOpenId(userOpenid);
        var index = user.pointIndex;
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + index + "ChuaPaiListNode", tableNode);
        // var chuPaiListNode = cc.find("user" + index + "ChuaPaiListNode",this.tableNode);
        var children = userChuPaiListNode.children;
        var lastNode;

        for (var i = 0; i < children.length; i++) {
            lastNode = children[i];
        }
        if (lastNode != null & lastNode != undefined) {
            lastNode.removeFromParent();
            cc.log("removeLastPaiOnChuPaiListByUserOpenId remove");
        }
        //Fix the user chupai list 
        children = userChuPaiListNode.children;
        user.chuPaiCount = parseInt(user.chuPaiCount - 1);
        if (index == "1") {
            user.chupaiListX = user.chupaiListX + 42;
        } else if (index == "2") {
            user.chupaiListY = user.chupaiListY + 35;

        } else if (index == "3") {
            user.chupaiListX = user.chupaiListX - 42;

        } else if (index == "4") {
            user.chupaiListY = user.chupaiListY - 35;
        }


        this.updateUserListInGobal(user);

        // var tableNode =this.tableNode;
        cc.log("removeLastPaiOnChuPaiListByUserOpenId end");

    },
    /**
     * This method will execute the anication of chupai in self pai list
     */
    playSlefChuPaiAction: function (paiNode, userPoint) {
        // var user = this.getCorrectUserByPoint(userPoint);
        var name = paiNode.name;
        var sourceName = paiNode.name;

        var tempArray = name.split("_");
        name = tempArray[1];


        //add the target pai into pai list.
        var parentNode = paiNode.parent.parent;
        //  cc.log("parentNode:" + parentNode.name);
        var userChuPaiListNode = cc.find("user" + userPoint + "ChuaPaiListNode", parentNode);
        //   cc.log("userChuPaiListNode:" + userChuPaiListNode);


        //datalayer -------------------------------------------
        var user = this.getCorrectUserByPoint(userPoint);
        cc.log("234:" + user.paiListArray);
        var paiList = this.removeElementByNodeFromUser(paiNode, 1)
        // paiList=paiList.sort();
        cc.log("235:" + paiList);
        user.paiListArray = paiList;
        user = this.synchronizationPaiList(user);

        //user.userMoPai = "";
        // cc.log("user openid:" + user.openid)
        this.updateUserListInGobal(user);
        cc.log("241:" + user.paiList);
        //----------------------------------------------------

        user = this.addPaiIntoPaiListNode(userChuPaiListNode, name, userPoint, paiNode, 'self');
        cc.log("get 243:" + userPoint);
        user.chuPaiPointX = paiNode.x;
        user = this.fixCurrentChuPaiPoint(user);

        //Now, we need insert the 14 into correct point
        //peng and gang don't need insert the 14 
        var insertLastPaiFlag = true;
        if (Global.chuPaiActionType == "peng") {
            insertLastPaiFlag = false;
        }
        cc.log("Global.chuPaiActionType:" + Global.chuPaiActionType);
        cc.log("insertLastPaiFlag:" + insertLastPaiFlag);
        if (sourceName.indexOf("mopai") < 0) {
            var chupaiIndex = parseInt(tempArray[0].replace("pai", ""));
            var mopaiInsertIndex = this.getPaiInsertIndexBy14();
            cc.log("mopaiInsertIndex:" + mopaiInsertIndex);
            cc.log("chupaiIndex:" + chupaiIndex);
            //move the other pai into correct point


            if (chupaiIndex != mopaiInsertIndex) {
                mopaiInsertIndex = this.moveOtherPaiIntoCorrectPoint(mopaiInsertIndex, chupaiIndex);
            }
            //move the 14 pai into correct point


            if (insertLastPaiFlag == true) {
                this.moveLastestPaiToPoint(mopaiInsertIndex);
                //
            }



            //this.fixUserSelfPaiPoinst();
            //this.removeAllNodeFromSelfPaiList();
            //tableUserInfoScript.intalSelfPaiList(user.paiList);

            //add pai to correct point  

            // pNode.active = true;
            //add it to curernt 
            //  eval("this.user" + point + "PaiListNode.addChild(paiNode)");
        }




        return user.paiListArray

    },

    /**
     * fix the point for self pai list
     */

    fixUserSelfPaiPoinst: function () {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var childrens = parentNode.children
        var startPoint = -520;
        cc.log("264:" + childrens.length);
        for (var i = 0; i < childrens.length; i++) {
            var child = childrens[i];
            child.position = cc.p(startPoint + i * 79, 0);
            cc.log("ponit:" + i + ":" + (startPoint + i * 79) + "::" + child.name);
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
        cc.log("288:" + children.length);
        cc.log("mopaiInsertIndex:" + mopaiInsertIndex);
        if (mopaiInsertIndex == -1) {
            mopaiInsertIndex = 0;
        }
        cc.log("chuPaiIndex:" + chuPaiIndex);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            cc.log("288 name:" + child.name);
        }
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

    playSlefChuPaiAction_addChild: function (target, pNodeArray) {
        var pNode = pNodeArray[0];
        var paiNode = pNodeArray[1];
        var parent = pNodeArray[2];
        var paiList = pNodeArray[3];
        var userOpenId = pNodeArray[4];
        cc.log("playSlefChuPaiAction_addChild:" + paiNode.name);
        cc.log("playSlefChuPaiAction_addChild parent:" + parent.name);
        cc.log("playSlefChuPaiAction_addChild parent child count1:" + parent.childrenCount);
        pNode.active = true;

        var spriteFrame = paiNode.getComponent(cc.Sprite).spriteFrame;
        var deps = cc.loader.getDependsRecursively(spriteFrame);
        cc.loader.release(deps);
        paiNode.removeFromParent();
        cc.log("playSlefChuPaiAction_addChild parent child count2:" + parent.childrenCount);
        this.removeAllNodeFromSelfPaiList();
        cc.log("paiList:" + paiList);

        var user = this.getCorrectUserByOpenId(userOpenId);
        user.paiList = paiList;
        user.userMoPai = "";
        this.updateUserListInGobal(user);
        cc.log("374:" + user.paiList);
        tableUserInfoScript.intalSelfPaiList(user.paiList);
        cc.log("375:" + user.paiList);
        this.disableAllSlefPai();


    },
    playOtherChuPaiAction_addChild: function (target, pNodeArray) {
        cc.log("playSlefChuPaiAction_addChild:");
        var pNode = pNodeArray[0];
        var paiNode = pNodeArray[1];
        var parent = pNodeArray[2];
        var paiList = pNodeArray[3];
        var userOpenId = pNodeArray[4];
        cc.log("playSlefChuPaiAction_addChild:" + paiNode.name);
        cc.log("playSlefChuPaiAction_addChild parent:" + parent.name);
        cc.log("playSlefChuPaiAction_addChild parent child count1:" + parent.childrenCount);
        pNode.active = true;

        if (paiNode.name != "autoMoPai") {
            var spriteFrame = paiNode.getComponent(cc.Sprite).spriteFrame;
            var deps = cc.loader.getDependsRecursively(spriteFrame);
            cc.loader.release(deps);
            //we should remove on next step;
            paiNode.removeFromParent();
        }

        this.removeLastPaiOnPaiListByUserOpenId(userOpenId);



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
    getCorrectUserByOpenId: function (userOpenId) {

        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userOpenId) {
                user = userList[i];
            }
        }

        return user;

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
        quePai = userInfo.quePai;


        return quePai;

    },

    /**
     * This is chu pai action 
     */
    chuPaiAction: function (event) {

        var actionType = Global.chuPaiActionType;
        var gameMode = Global.gameMode;
        var huanSanZhangPaiList = Global.huanSanZhangPaiList;
        var node = event.target;
        var name = node.name;
        var temp = name.split("_");
        var paiNumTxt = temp[1];
        var chuPaiIndex = -1;
        var userInfo = Global.userInfo;
        chuPaiIndex = temp[0].replace("pai");

        //Fix the game mode aollow huansanzhang 
        gameMode.huanSanZhang = "1";
        //************************************** */
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
                var selfPaiList = this.playSlefChuPaiAction(node, "3");
                //send chu pai action to server.
                tableNetWorkScript.sendChuPaiAction(userInfo.openid, paiNumTxt, selfPaiList);
                //close table center timer
                tableCenterTimmerScript.endTimer();
                tableCenterTimmerScript.setNumerToZero();
                Global.chuPaiActionType = "";


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

                var user = this.addPaiIntoPaiListNode(userChuPaiListNode, name, userPoint, theNode, 'self');

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
    disableAllSlefPai: function () {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var children = parentNode.children;
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            //  cc.log("throwActionForNode childredName:" + childredName);
            var btn = children[i].getComponent(cc.Button);
            if (btn != null && btn != undefined) {
                btn.enableAutoGrayEffect = false;
                btn.interactable = false;
                btn.disabledColor = new cc.Color(255, 255, 255);
                //cc.log("disableAllSlefPai:" + btn.enableAutoGrayEffect);
            }
        }
    },
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
    enabledAllPaiAfterQuePai: function () {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var existFlag = this.checkQuePaiInSelf();
        var quePaiType = this.getQuePai();

        cc.log("enabledAllPaiAfterQuePai flag:" + existFlag);
        if (existFlag == false) {
            this.enabledAllPai(parentNode);
        } else {
            //disable other pai ,only enable the que pai
            var quePaiType = this.getQuePai();
            var tableNode = cc.find("Canvas/tableNode");
            var parentNode = cc.find("user3PaiList", tableNode);
            var children = parentNode.children;
            for (var i = 0; i < children.length; ++i) {
                var childredName = children[i].name;
                cc.log("throwActionForNode childredName:" + childredName);
                var btn = children[i].getComponent(cc.Button);
                btn.enableAutoGrayEffect = true;

                var sType = this.getTypeByName(childredName);
                if (sType == quePaiType) {
                    btn.interactable = true;
                    btn.disabledColor = new cc.Color(255, 255, 255);
                } else {
                    btn.disabledColor = new cc.Color(127.5, 127.5, 127.5);
                    btn.interactable = false;
                }
            }

        }

    },
    enabledAllPai: function (parentNode, autoGray) {
        var children = parentNode.children;
        for (var i = 0; i < children.length; ++i) {
            var btn = children[i].getComponent(cc.Button);
            if (autoGray != null && autoGray != undefined) {
                btn.enableAutoGrayEffect = autoGray;
            }

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
    insertPaiIntoPaiListByPaiAndPaiList: function (paiNumber, paiList) {
        var temp = [];
        if (paiNumber != null && paiNumber != undefined) {
            paiNumber = paiNumber + "";
            paiNumber = parseInt(paiNumber.trim());
        }
        if (paiList.length > 1) {

            var insertFlag = false;
            for (var i = 0; i < paiList.length; ++i) {
                var p = paiList[i] + "";
                var pai = parseInt(p.trim());
                //  cc.log("loop pai:" + pai)
                if (paiNumber < pai) {
                    if (insertFlag == false) {
                        cc.log("insertFlag pai:" + paiNumber)
                        temp.push(paiNumber);
                        insertFlag = true;
                    }

                } else {

                }
                temp.push(pai);


            }

            if (insertFlag == false) {
                temp.push(paiNumber);
            }

            // user.paiListArray = temp;
        } else {
            temp.push(paiNumber);
            // paiList.push(paiNumber);
            // user.paiListArray = paiList;
        }

        return temp
    },

    insertPaiIntoPaiListByPaiAndOpenId: function (paiNumber, userOpenId) {
        var currentUser = this.getCorrectUserByOpenId(userOpenId);
        var paiList = currentUser.paiListArray;
        var temp = this.insertPaiIntoPaiListByPaiAndPaiList(paiNumber, paiList);
        return temp

    },
    insertMoPaiIntoPaiList: function (user) {
        var moPai = user.userMoPai;
        if (moPai != null && moPai != undefined && moPai != "") {
            moPai = moPai + "";
            moPai = parseInt(moPai.trim());
            cc.log("insertMoPaiIntoPaiList moPai:" + moPai);
            var paiList = user.paiListArray;
            if (paiList.length > 1) {
                var temp = [];
                var insertFlag = false;
                for (var i = 0; i < paiList.length; ++i) {
                    var p = paiList[i] + "";
                    var pai = parseInt(p.trim());
                    // cc.log("loop pai:" + pai)
                    if (moPai < pai) {
                        if (insertFlag == false) {
                            cc.log("insertFlag pai:" + moPai)
                            temp.push(moPai);
                            insertFlag = true;
                        }

                    }
                    temp.push(pai);


                }
                //if it always not insert ,so it must the max number ,just insert it into latest
                if (insertFlag == false) {
                    temp.push(moPai);
                    insertFlag = true;
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
    removeElementByNumberByPaiListFromUser: function (paiList, paiNumber, b) {
        var c = 0;
        // cc.log("1043:" + paiList.toString());
        while (this.contains(paiList, paiNumber) && c != b) {
            // cc.log("1044: c" +c+"---b:"+b);
            for (var i = 0; i < paiList.length; i++) {
                var temp = paiList[i] + "";
                temp = temp.trim();
                if (temp == paiNumber + "") {
                    paiList.splice(i, 1);
                    c++;
                    break;
                }
            }
        }

        //cc.log("1056:" + paiList.toString());
        return paiList.sort(function (a, b) { return a - b })
    },
    contains: function (array, obj) {
        var i = array.length;
        while (i--) {
            if (array[i] === obj) {
                return true;
            }
        }
        return false;
    },
    removeElementByNumberFromUser: function (number, paiList, b) {
        var c = 0;
        number = number + "";
        number = number.trim();
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

        return paiList.sort()
    },
    /**
     * remove a element from paiList of user self
     * b---remove element number.
     */
    removeElementByNodeFromUser: function (node, b) {
        var number = node.name;
        var c = 0;
        var temp = number.split("_");
        number = temp[1];
        var paiList = this.getSelfPaiList();
        this.removeElementByNumberFromUser(number, paiList, b);
        paiList.sort(function (a, b) { return a - b });
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
        cc.log("checkQuePaiInSelf:" + que + ":");
        que = que + "";
        que = que.trim();
        var existFlag = false;
        var paiList;
        var userList2 = Global.userList;
        var userInfo = Global.userInfo;
        var userMoPai;
        for (var i = 0; i < userList2.length; i++) {
            if (userInfo.openid == userList2[i].openid) {
                paiList = userList2[i].paiListArray;
                if (userList2[i].userMoPai != null && userList2[i].userMoPai != undefined) {
                    userMoPai = userList2[i].userMoPai;
                }

            }
        }

        cc.log("checkQuePaiInSelf userMoPai:" + userMoPai + ":");
        cc.log("checkQuePaiInSelf paiList:" + paiList.toString() + ":");
        if (paiList != null && paiList != undefined) {
            for (var i = 0; i < paiList.length; i++) {
                var pai = paiList[i];
                pai = pai + "";
                pai = pai.trim();
                // cc.log("pai" + pai);
                cc.log("pai:" + pai[0] + ":");
                var type = pai[0] + "";
                type = type.trim();
                if (que == type) {
                    existFlag = true
                }
            }
            if (userMoPai != null && userMoPai != undefined) {
                var type2 = userMoPai + "";
                type2 = type2.trim();

                cc.log("checkQuePaiInSelf type2:" + type2[0] + ":");
                if (que == type2[0]) {
                    existFlag = true
                }
            }




        }

        cc.log("checkQuePaiInSelf existFlag:" + existFlag);


        return existFlag

    },
    removeAllNodeFromSelfPaiList: function () {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var count = parentNode.childrenCount;
        cc.log("parentNode: " + parentNode.name);
        cc.log("Node Children Count 1010: " + count);
        parentNode.removeAllChildren()
    },
    removeAllNodeFromOtherPaiList: function (point) {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user" + point + "PaiList", tableNode);
        var count = parentNode.childrenCount;
        cc.log("parentNode: " + parentNode.name);
        cc.log("Node Children Count 1010: " + count);
        parentNode.removeAllChildren()
    },

    cleanAllPaiListForAllUser: function () {

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
            if (moPai <= minPai) {
                index = 0;
            } else if (moPai >= maxPai) {
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
                        if (pai == moPai) {
                            index = nextI;
                            break;
                        } else if (pai == nextPai) {
                            // nextI = nextI + 1;
                            // if (nextI >= paiList.length) {
                            //     nextI = paiList.length + 1
                            // }
                            index = nextI;
                            break;
                        }
                        // if (pai <= moPai && moPai <= nextPai) {
                        //     index = nextI;
                        //     break;
                        // }

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
