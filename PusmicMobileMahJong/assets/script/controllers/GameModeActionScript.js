var infoTextNode;
var gameMode;
var fanArray = [];
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
        modeInfoRightRichText: cc.Node,
        ziMoJiaDi: cc.Node,
        ziMoJiaFan: cc.Node,
        ziMoHu: cc.Node,
        dianPaoHu: cc.Node,
        huanSanZhang: cc.Node,
        dianGangHua_dianPao: cc.Node,
        dianGangHua_ziMo: cc.Node,
        dai19JiangDui: cc.Node,
        mengQingZhongZhang: cc.Node,
        tianDiHu: cc.Node,
        fan2: cc.Node,
        fan3: cc.Node,
        fan4: cc.Node,
        fan6: cc.Node,
        roundCount4: cc.Node,
        roundCount8: cc.Node,
        gamePeopleNumber: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        fanArray = [2, 3, 4, 6];
        infoTextNode = this.modeInfoRightRichText.getComponent(cc.RichText);
        gameMode = require("gameMode").gameMode;
        if (Global.gameMode != null) {
            gameMode = Global.gameMode

        }
        gameMode.gamePeopleNumber = 4;
        this.initalGameModeUIByModeData();


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    xueZhanDaoDi: function () {
        infoTextNode.string = "血战到底：血战麻将即指“血战到底”玩法，指1家胡了并不结束该局，而是未胡的玩家继续打，直到有3家都胡或者余下的玩家流局。";
        gameMode.gamePeopleNumber = "4";
    },
    xueLiuChengHe: function () {
        infoTextNode.string = "血流成河：此规则和血战基本一样，不允许天胡，必须换三张。";
        gameMode.gamePeopleNumber = "4";
    },
    sanRenMahJong: function () {
        infoTextNode.string = "三人麻将：此规则和血战基本一样，只是人数为三人即可开始。";
        gameMode.gamePeopleNumber = "3";
    },
    erRenMahJong: function () {
        infoTextNode.string = "二人麻将：此规则和血战基本一样，只是人数为二人即可开始。";
        gameMode.gamePeopleNumber = "2";

    },
    //-------------option select function---------------------------------------------------------
    //ziMoJiadiToggle,ziMoJiadiToggle,ziMoJiadiToggle,daiYaojiuToggle,menQingToggle,tianDiHuToggle,fan2Toggle,fan3Toggle,fan4Toggle,fan6Toggle
    //ju8Toggle,ju4Toggle,
    setGameMode: function (porpertitesName, tog) {
        if (tog != null) {
            // if (porpertitesName == "ziMoJiadiToggle") {
            if (tog.isChecked) {
                eval("gameMode." + porpertitesName + " = '1'");
                if (porpertitesName == "ziMoJiaDi") {
                    eval("gameMode.ziMoJiaFan = '0'");
                }
                if (porpertitesName == "ziMoJiaFan") {
                    eval("gameMode.ziMoJiaDi = '0'");
                }
                if (porpertitesName == "dianGangHua_dianPao") {
                    eval("gameMode.dianGangHua_ziMo = '0'");
                }
                if (porpertitesName == "dianGangHua_ziMo") {
                    eval("gameMode.dianGangHua_dianPao = '0'");
                }
                if (porpertitesName == "fan2") {
                    fanArray.splice(0, 1);
                }
                if (porpertitesName == "fan3") {
                    fanArray.splice(1, 1);
                }
                if (porpertitesName == "fan4") {
                    fanArray.splice(2, 1);
                }
                if (porpertitesName == "fan6") {
                    fanArray.splice(3, 1);
                }
                for (var i = 0; i < fanArray.length; i++) {
                    eval("gameMode.fan" + fanArray[i] + " = '0'");
                }

                if (porpertitesName == "roundCount4") {
                    eval("gameMode.roundCount8 = '0'");
                }
                if (porpertitesName == "roundCount8") {
                    eval("gameMode.roundCount4 = '0'");
                }
            } else {
                eval("gameMode." + porpertitesName + " = '0'");
            }

            //}
        }

        Global.gameMode = gameMode;

    },
    optionSelectFunction: function (event) {
        var node = event.target;
        cc.log(node.name);
        var partentNode = node.parent;
        var tog = partentNode.getComponent(cc.Toggle);
        if (tog != null) {
            cc.log("partentNode:" + partentNode.name + "-" + tog.isChecked);
            if (partentNode.name == "ziMoJiadiToggle") {
                this.setGameMode("ziMoJiaDi", tog)

            }
            if (partentNode.name == "ziMoJiaFanToggle") {
                this.setGameMode("ziMoJiaFan", tog)

            }
            if (partentNode.name == "dianGangDianPaoToggle") {
                this.setGameMode("dianGangHua_dianPao", tog)

            }
            if (partentNode.name == "huanSanZhangToggle") {
                this.setGameMode("huanSanZhang", tog)
            }
            if (partentNode.name == "dianGangZiMoToggle") {
                this.setGameMode("dianGangHua_ziMo", tog)
            }
            if (partentNode.name == "daiYaojiuToggle") {
                this.setGameMode("dai19JiangDui", tog)

            }
            if (partentNode.name == "menQingToggle") {
                this.setGameMode("mengQingZhongZhang", tog)

            }
            if (partentNode.name == "tianDiHuToggle") {
                this.setGameMode("tianDiHu", tog)

            }
            if (partentNode.name == "fan2Toggle") {
                this.setGameMode("fan2", tog)

            }
            if (partentNode.name == "fan3Toggle") {
                this.setGameMode("fan3", tog)

            }
            if (partentNode.name == "fan4Toggle") {
                this.setGameMode("fan4", tog)

            }
            if (partentNode.name == "fan6Toggle") {
                this.setGameMode("fan6", tog)

            }
            if (partentNode.name == "ju4Toggle") {
                this.setGameMode("roundCount4", tog)

            }
            if (partentNode.name == "ju8Toggle") {
                this.setGameMode("roundCount8", tog)

            }
            this.initalGameModeUIByModeData();



        }


    },

    initalGameModeUIByModeData: function () {
        if (gameMode.ziMoJiaDi + "" == "1") {
            this.ziMoJiaDi.getComponent(cc.Toggle).isChecked = true
        } else {
            this.ziMoJiaDi.getComponent(cc.Toggle).isChecked = false
        }

        if (gameMode.ziMoJiaFan + "" == "1") {
            this.ziMoJiaFan.getComponent(cc.Toggle).isChecked = true
        } else {
            this.ziMoJiaFan.getComponent(cc.Toggle).isChecked = false
        }
        // if (gameMode.ziMoHu + "" == "1") {
        //     this.ziMoHu.getComponent(cc.Toggle).isChecked = true
        // } else {
        //     this.ziMoHu.getComponent(cc.Toggle).isChecked = false
        // }
        // if (gameMode.dianPaoHu + "" == "1") {
        //     this.dianPaoHu.getComponent(cc.Toggle).isChecked = true
        // } else {
        //     this.dianPaoHu.getComponent(cc.Toggle).isChecked = false
        // }
        // if (gameMode.huanSanZhang + "" == "1") {
        //     this.huanSanZhang.getComponent(cc.Toggle).isChecked = true
        // } else {
        //     this.huanSanZhang.getComponent(cc.Toggle).isChecked = false
        // }
        if (gameMode.dianGangHua_dianPao + "" == "1") {
            this.dianGangHua_dianPao.getComponent(cc.Toggle).isChecked = true
        } else {
            this.dianGangHua_dianPao.getComponent(cc.Toggle).isChecked = false
        }
        if (gameMode.dianGangHua_ziMo + "" == "1") {
            this.dianGangHua_ziMo.getComponent(cc.Toggle).isChecked = true
        } else {
            this.dianGangHua_ziMo.getComponent(cc.Toggle).isChecked = false
        }
        if (gameMode.dai19JiangDui + "" == "1") {
            this.dai19JiangDui.getComponent(cc.Toggle).isChecked = true
        } else {
            this.dai19JiangDui.getComponent(cc.Toggle).isChecked = false
        }
        if (gameMode.mengQingZhongZhang + "" == "1") {
            this.mengQingZhongZhang.getComponent(cc.Toggle).isChecked = true
        } else {
            this.mengQingZhongZhang.getComponent(cc.Toggle).isChecked = false
        }
        if (gameMode.tianDiHu + "" == "1") {
            this.tianDiHu.getComponent(cc.Toggle).isChecked = true
        } else {
            this.tianDiHu.getComponent(cc.Toggle).isChecked = false
        }
        if (gameMode.fan2 + "" == "1") {
            this.fan2.getComponent(cc.Toggle).isChecked = true
        } else {
            this.fan2.getComponent(cc.Toggle).isChecked = false
        }
        if (gameMode.fan3 + "" == "1") {
            this.fan3.getComponent(cc.Toggle).isChecked = true
        } else {
            this.fan3.getComponent(cc.Toggle).isChecked = false
        }
        if (gameMode.fan4 + "" == "1") {
            this.fan4.getComponent(cc.Toggle).isChecked = true
        } else {
            this.fan4.getComponent(cc.Toggle).isChecked = false
        }
        if (gameMode.roundCount4 + "" == "1") {
            this.roundCount4.getComponent(cc.Toggle).isChecked = true
        } else {
            this.roundCount4.getComponent(cc.Toggle).isChecked = false
        }
        if (gameMode.roundCount8 + "" == "1") {
            this.roundCount8.getComponent(cc.Toggle).isChecked = true
        } else {
            this.roundCount8.getComponent(cc.Toggle).isChecked = false
        }

    },
    // setting all values into  gobal mode object and swtich to table sence.
    buildNewRoom: function () {
        //Global.gameMode = gameMode;
        //cc.director.loadScene('table');
    },
});
