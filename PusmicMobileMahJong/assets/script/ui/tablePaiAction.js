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
    },

    // use this for initialization
    //chuPaiActionType
    onLoad: function () {

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
    playSlefChuPaiAction: function (paiNode, userPoint) {
        var user = this.getCorrectUserByPoint(userPoint);
        var name = paiNode.name;

        var tempArray = name.split("_");
        name = tempArray[1];
         cc.log("user.chupaiListX:"+user.chupaiListX );
        var x = user.chupaiListX;
        var y = user.chupaiListY;
        cc.log("x:" + x + "----" + "y:" + y);
        //, cc.removeSelf()



        //add the target pai into pai list.
        var parentNode = paiNode.parent.parent;
        cc.log("parentNode:" + parentNode.name);
        var userChuPaiListNode = cc.find("user" + userPoint + "ChuaPaiListNode", parentNode);
        cc.log("userChuPaiListNode:" + userChuPaiListNode);
        var paiPath = this.getChuPaiNameByNodeName(name, userPoint);
        cc.log("paiPath:" + paiPath);
        var pNode = cc.instantiate(this.paiChuPaiNode);


        if (user.chuPaiCount >= 10) {
            pNode.zIndex = 198;
        } else {
            pNode.zIndex = 199;
        }


        let sprite = pNode.addComponent(cc.Sprite)
        pNode.name = "pai" + userPoint + "_" + name;
        pNode.active = false;
        pNode.position = cc.p(x, y);
        //pNode.width = 42;
        //pNode.height = 61;
        sprite = pNode.getComponent(cc.Sprite);
        cc.loader.loadRes(paiPath, function (err, sp) {
            if (err) {
                cc.log("----" + err.message || err);
                return;
            }
            cc.log("85");


            sprite.spriteFrame = new cc.SpriteFrame(sp);

            cc.log("99");
            // cc.log('Result should be a sprite frame: ' + (sp instanceof cc.SpriteFrame));
            // pNode.active = true;

        });
        userChuPaiListNode.addChild(pNode);

        user = this.fixCurrentChuPaiPoint(user);
        this.updateUserListInGobal(user);

        var finished = cc.callFunc(this.playSlefChuPaiAction_addChild, this, pNode);
        var action = cc.sequence(cc.moveTo(0.15, x, y + 220), cc.scaleTo(0.15, 0.5), cc.removeSelf(), finished);

        paiNode.runAction(action);
        var spriteFrame = paiNode.getComponent(cc.Sprite).spriteFrame;
        var deps = cc.loader.getDependsRecursively(spriteFrame);
        cc.loader.release(deps);
        //add pai to correct point  

        // pNode.active = true;
        //add it to curernt 
        //  eval("this.user" + point + "PaiListNode.addChild(paiNode)");

    },

    playSlefChuPaiAction_addChild: function (target, pNode) {
        cc.log("playSlefChuPaiAction_addChild");
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

            user.chupaiListX = user.chupaiListX - 42;


        }
        if (userIndex == "2") {
            user.chupaiListY = user.chupaiListY - 49;
        }
        if (userIndex == "3") {

            if (user.chuPaiCount == 10) {
                user.chupaiListY = 15;
                user.chupaiListx = -210;
            } else {
                user.chupaiListX = user.chupaiListX + 42;
            }
        }
        if (userIndex == "1") {
            user.chupaiListY = user.chupaiListY + 49;
        }

        user.chuPaiCount = user.chuPaiCount + 1;
        cc.log("user.chupaiListX 200:"+user.chupaiListX);
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
    // after all que pai clean ,the all other pai should be enable
    enabledAllPaiAfterQuePai: function (parentNode) {
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

        if (existFlag == true) {
            this.enabledAllPai(parentNode);
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
        cc.log("enabledAllSelfPai");
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

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
