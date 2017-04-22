require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AudioMessage":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c2d6boGgepKbIDPUSF/t0Zk', 'AudioMessage');
// script/audio/AudioMessage.js

'use strict';

var tableNetWorkScript;
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
        micButtonNode: cc.Node,
        micPicNode: cc.Node,
        micProcessNode: cc.Node,

        tableNetWorkNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        //cc.sys.OS_IOS  
        //cc.sys.OS_ANDROID 
        //cc.sys.os
        // var clickEventHandler = new cc.Component.EventHandler();
        // clickEventHandler.target = this.micButtonNode; //这个 node 节点是你的事件处理代码组件所属的节点
        // clickEventHandler.component = "AudioMessage";//这个是代码文件名
        // clickEventHandler.handler = "callback";
        // clickEventHandler.customEventData = "foobar";

        this.micButtonNode.on(cc.Node.EventType.TOUCH_START, this.startRecored, this);
        this.micButtonNode.on(cc.Node.EventType.TOUCH_END, this.stopRecord, this);

        //var button = this.micButtonNode.getComponent(cc.Button);
        //button.clickEvents.push(clickEventHandler);
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {}
        }
    },

    setProcessBar: function setProcessBar(number) {
        var processBar = this.micProcessNode.getComponent(cc.ProgressBar);
        processBar.progress = number;
    },

    startRecored: function startRecored(event) {
        this.micPicNode.active = true;
        cc.audioEngine.pauseAll();
        //cc.audioEngine.pauseAllEffects();
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {

                jsb.reflection.callStaticMethod('AudioFunc', 'startOrResumeRecord');
            }
        }
    },

    stopRecord: function stopRecord(event) {
        cc.audioEngine.resumeAll();
        this.micPicNode.active = false;
        var processBar = this.micProcessNode.getComponent(cc.ProgressBar);
        processBar.progress = 0;

        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                var isinstall = jsb.reflection.callStaticMethod('AudioFunc', 'stopRecord');
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"AudioMng":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c3d868opm9BB4LH+VYKqsqc', 'AudioMng');
// script/audio/AudioMng.js

"use strict";

var gameConfigSetting;
var manPaiListArray = new Map();
var womenPaiListArray = new Map();
var manActionListArray = new Map();
var womenActionListArray = new Map();
cc.Class({
    extends: cc.Component,

    properties: {
        gameStartAudio: {
            default: null,
            url: cc.AudioClip
        },
        winAudio: {
            default: null,
            url: cc.AudioClip
        },

        loseAudio: {
            default: null,
            url: cc.AudioClip
        },

        cardAudio: {
            default: null,
            url: cc.AudioClip
        },

        buttonAudio: {
            default: null,
            url: cc.AudioClip
        },

        chipsAudio: {
            default: null,
            url: cc.AudioClip
        },

        bgm: {
            default: null,
            url: cc.AudioClip
        },
        chuPai: {
            default: null,
            url: cc.AudioClip
        },
        moPai: {
            default: null,
            url: cc.AudioClip
        },

        paiAudiolistMan: [cc.AudioClip],
        paiAudiolistWomen: [cc.AudioClip],
        paiAudiolistManAction: [cc.AudioClip],
        paiAudiolistWomenAction: [cc.AudioClip]
    },

    // use this for initialization
    onLoad: function onLoad() {

        var o = cc.sys.localStorage.getItem("gameConfig");

        if (o != null && o != undefined && o != "" && o != "\"\"") {
            Global.gameConfigSetting = JSON.parse(o);
        }

        if (Global.gameConfigSetting == null || Global.gameConfigSetting == undefined || Global.gameConfigSetting == "") {
            Global.gameConfigSetting = require("gameConfigSetting").gameConfigSetting;
        }
        gameConfigSetting = Global.gameConfigSetting;

        manPaiListArray.set(11, [0, 1, 2]);
        manPaiListArray.set(12, [3]);
        manPaiListArray.set(13, [4]);
        manPaiListArray.set(14, [5]);
        manPaiListArray.set(15, [7, 8]);
        manPaiListArray.set(11, [0, 1, 2]);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    playMusic: function playMusic() {
        gameConfigSetting = Global.gameConfigSetting;
        if (gameConfigSetting.music == "1") {
            cc.audioEngine.playMusic(this.bgm, true);
        }
    },
    stopMusic: function stopMusic() {
        cc.audioEngine.stopMusic();
    },

    pauseMusic: function pauseMusic() {
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function resumeMusic() {
        cc.audioEngine.resumeMusic();
    },

    _playSFX: function _playSFX(clip) {
        cc.audioEngine.playEffect(clip, false);
    },

    playWin: function playWin() {
        this._playSFX(this.winAudio);
    },

    playLose: function playLose() {
        this._playSFX(this.loseAudio);
    },

    playCard: function playCard() {
        this._playSFX(this.cardAudio);
    },

    playChips: function playChips() {
        this._playSFX(this.chipsAudio);
    },

    playButton: function playButton() {
        this._playSFX(this.buttonAudio);
    },
    playChuPai: function playChuPai(paiNum) {
        //musicEffect
        gameConfigSetting = Global.gameConfigSetting;
        if (gameConfigSetting.musicEffect == "1") {
            //pai effect
            var userInfo = Global.userInfo;
            var soundPai;
            var soundList = [];
            if (userInfo.sex + "" == "1") {
                soundPai = this.paiAudiolistMan;
            } else {
                soundPai = this.paiAudiolistWomen;
            }

            for (var i = 0; i < soundPai.length; i++) {
                //cc.log("soundPai "+i+":" + soundPai[i]);

                if (soundPai[i].indexOf(paiNum) >= 0) {
                    soundList.push(soundPai[i]);
                }
            }

            if (soundList.length > 0) {
                cc.log("soundList:" + soundList.length);
                var k = Math.floor(Math.random() * soundList.length);
                cc.log("soundList k:" + k);
                this._playSFX(soundList[k]);
                this._playSFX(this.chuPai);
            }
        }
    },
    playMoPai: function playMoPai() {
        gameConfigSetting = Global.gameConfigSetting;
        if (gameConfigSetting.musicEffect == "1") {
            this._playSFX(this.moPai);
        }
    },
    playAction: function playAction(actionName) {
        if (actionName == "zimo") {
            actionName = "hu1";
        }

        if (actionName == "hu") {}

        gameConfigSetting = Global.gameConfigSetting;
        if (gameConfigSetting.musicEffect == "1") {
            //pai effect
            var userInfo = Global.userInfo;
            var soundPai;
            var soundList = [];
            if (userInfo.sex + "" == "1") {
                soundPai = this.paiAudiolistManAction;
            } else {
                soundPai = this.paiAudiolistWomenAction;
            }

            for (var i = 0; i < soundPai.length; i++) {
                //cc.log("soundPai "+i+":" + soundPai[i]);

                if (soundPai[i].indexOf(actionName) >= 0) {
                    if (actionName == "hu") {
                        if (soundPai[i].indexOf("hu1") < 0) {
                            soundList.push(soundPai[i]);
                        }
                    } else {
                        soundList.push(soundPai[i]);
                    }
                }
            }

            if (soundList.length > 0) {
                cc.log("soundList:" + soundList.length);
                var k = Math.floor(Math.random() * soundList.length);
                cc.log("soundList k:" + k);
                this._playSFX(soundList[k]);
                //this._playSFX(this.chuPai);
            }
        }
    }

});

cc._RFpop();
},{"gameConfigSetting":"gameConfigSetting"}],"ButtonScaler":[function(require,module,exports){
"use strict";
cc._RFpush(module, '56194H6FxlN4piguuTlYo5J', 'ButtonScaler');
// script/ui/ButtonScaler.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        pressedScale: 1,
        transDuration: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        var audioMng = cc.find('ScriptPlayBgm/AudioMng') || cc.find('Script/AudioMng');
        if (audioMng) {
            audioMng = audioMng.getComponent('AudioMng');
        }
        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);
        function onTouchDown(event) {
            this.stopAllActions();
            if (audioMng) audioMng.playButton();
            this.runAction(self.scaleDownAction);
        }
        function onTouchUp(event) {
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
});

cc._RFpop();
},{}],"DataTime":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bd2dfiGkfxCEbgrnkUlYWi0', 'DataTime');
// script/ui/DataTime.js

"use strict";

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

        timeLable: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        //show time
        var dateTimeUpte = function dateTimeUpte() {
            var currentdate = new Date();
            var hour = currentdate.getHours() + ":";
            var min = currentdate.getMinutes() + "";
            var second = currentdate.getSeconds() + "";

            if (min.length == 1) {
                min = "0" + min;
            }
            if (second.length == 1) {
                second = "0" + second;
            }
            var currentTiem = hour + min;

            var lable = this.timeLable.getComponent(cc.Label);
            lable.string = currentTiem;
        };

        this.schedule(dateTimeUpte, 1);
    }

});

cc._RFpop();
},{}],"GameModeActionScript":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e8878ueXLJLUY1LZpUPZdES', 'GameModeActionScript');
// script/controllers/GameModeActionScript.js

"use strict";

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
        gamePeopleNumber: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        fanArray = [2, 3, 4, 6];
        infoTextNode = this.modeInfoRightRichText.getComponent(cc.RichText);
        gameMode = require("gameMode").gameMode;
        if (Global.gameMode != null) {
            gameMode = Global.gameMode;
        }
        gameMode.gamePeopleNumber = 4;
        this.initalGameModeUIByModeData();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    xueZhanDaoDi: function xueZhanDaoDi() {
        infoTextNode.string = "血战到底：血战麻将即指“血战到底”玩法，指1家胡了并不结束该局，而是未胡的玩家继续打，直到有3家都胡或者余下的玩家流局。";
        gameMode.gamePeopleNumber = "4";
    },
    xueLiuChengHe: function xueLiuChengHe() {
        infoTextNode.string = "血流成河：此规则和血战基本一样，不允许天胡，必须换三张。";
        gameMode.gamePeopleNumber = "4";
    },
    sanRenMahJong: function sanRenMahJong() {
        infoTextNode.string = "三人麻将：此规则和血战基本一样，只是人数为三人即可开始。";
        gameMode.gamePeopleNumber = "3";
    },
    erRenMahJong: function erRenMahJong() {
        infoTextNode.string = "二人麻将：此规则和血战基本一样，只是人数为二人即可开始。";
        gameMode.gamePeopleNumber = "2";
    },
    //-------------option select function---------------------------------------------------------
    //ziMoJiadiToggle,ziMoJiadiToggle,ziMoJiadiToggle,daiYaojiuToggle,menQingToggle,tianDiHuToggle,fan2Toggle,fan3Toggle,fan4Toggle,fan6Toggle
    //ju8Toggle,ju4Toggle,
    setGameMode: function setGameMode(porpertitesName, tog) {
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
                if (porpertitesName.indexOf("fan") >= 0) {
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
    optionSelectFunction: function optionSelectFunction(event) {
        var node = event.target;
        cc.log(node.name);
        var partentNode = node.parent;
        var tog = partentNode.getComponent(cc.Toggle);
        if (tog != null) {
            cc.log("partentNode:" + partentNode.name + "-" + tog.isChecked);
            if (partentNode.name == "ziMoJiadiToggle") {
                this.setGameMode("ziMoJiaDi", tog);
            }
            if (partentNode.name == "ziMoJiaFanToggle") {
                this.setGameMode("ziMoJiaFan", tog);
            }
            if (partentNode.name == "dianGangDianPaoToggle") {
                this.setGameMode("dianGangHua_dianPao", tog);
            }
            if (partentNode.name == "huanSanZhangToggle") {
                this.setGameMode("huanSanZhang", tog);
            }
            if (partentNode.name == "dianGangZiMoToggle") {
                this.setGameMode("dianGangHua_ziMo", tog);
            }
            if (partentNode.name == "daiYaojiuToggle") {
                this.setGameMode("dai19JiangDui", tog);
            }
            if (partentNode.name == "menQingToggle") {
                this.setGameMode("mengQingZhongZhang", tog);
            }
            if (partentNode.name == "tianDiHuToggle") {
                this.setGameMode("tianDiHu", tog);
            }
            if (partentNode.name == "fan2Toggle") {
                this.setGameMode("fan2", tog);
            }
            if (partentNode.name == "fan3Toggle") {
                this.setGameMode("fan3", tog);
            }
            if (partentNode.name == "fan4Toggle") {
                this.setGameMode("fan4", tog);
            }
            if (partentNode.name == "fan6Toggle") {
                this.setGameMode("fan6", tog);
            }
            if (partentNode.name == "ju4Toggle") {
                this.setGameMode("roundCount4", tog);
            }
            if (partentNode.name == "ju8Toggle") {
                this.setGameMode("roundCount8", tog);
            }
            this.initalGameModeUIByModeData();
        }
    },

    initalGameModeUIByModeData: function initalGameModeUIByModeData() {
        if (gameMode.ziMoJiaDi + "" == "1") {
            this.ziMoJiaDi.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.ziMoJiaDi.getComponent(cc.Toggle).isChecked = false;
        }

        if (gameMode.ziMoJiaFan + "" == "1") {
            this.ziMoJiaFan.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.ziMoJiaFan.getComponent(cc.Toggle).isChecked = false;
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
            this.dianGangHua_dianPao.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.dianGangHua_dianPao.getComponent(cc.Toggle).isChecked = false;
        }
        if (gameMode.dianGangHua_ziMo + "" == "1") {
            this.dianGangHua_ziMo.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.dianGangHua_ziMo.getComponent(cc.Toggle).isChecked = false;
        }
        if (gameMode.dai19JiangDui + "" == "1") {
            this.dai19JiangDui.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.dai19JiangDui.getComponent(cc.Toggle).isChecked = false;
        }
        if (gameMode.mengQingZhongZhang + "" == "1") {
            this.mengQingZhongZhang.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.mengQingZhongZhang.getComponent(cc.Toggle).isChecked = false;
        }
        if (gameMode.tianDiHu + "" == "1") {
            this.tianDiHu.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.tianDiHu.getComponent(cc.Toggle).isChecked = false;
        }
        if (gameMode.fan2 + "" == "1") {
            this.fan2.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.fan2.getComponent(cc.Toggle).isChecked = false;
        }
        cc.log("gameMode.fan3:" + gameMode.fan3);
        if (gameMode.fan3 + "" == "1") {
            this.fan3.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.fan3.getComponent(cc.Toggle).isChecked = false;
        }
        if (gameMode.fan4 + "" == "1") {
            this.fan4.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.fan4.getComponent(cc.Toggle).isChecked = false;
        }
        if (gameMode.roundCount4 + "" == "1") {
            this.roundCount4.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.roundCount4.getComponent(cc.Toggle).isChecked = false;
        }
        if (gameMode.roundCount8 + "" == "1") {
            this.roundCount8.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.roundCount8.getComponent(cc.Toggle).isChecked = false;
        }
    },
    // setting all values into  gobal mode object and swtich to table sence.
    buildNewRoom: function buildNewRoom() {
        //Global.gameMode = gameMode;
        //cc.director.loadScene('table');
    }
});

cc._RFpop();
},{"gameMode":"gameMode"}],"GameModeOptionController":[function(require,module,exports){
"use strict";
cc._RFpush(module, '857f0feyVtAi6xSUtNGTFCX', 'GameModeOptionController');
// script/controllers/GameModeOptionController.js

"use strict";

var gameModeModel = require('gameMode').gameMode;
var checkLableColor = new cc.Color(231, 28, 77);
var noCheckLableColor = new cc.Color(121, 81, 44);
var gameModeLayer;
var btnListLayer;
var topInfoLayer;
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
    noCheckBoxBg: cc.SpriteFrame,
    CheckBoxBg: cc.SpriteFrame
  },

  // use this for initialization
  onLoad: function onLoad() {
    gameModeLayer = cc.find("Canvas/gameModeSelectLayer/mainSelectMode/mainModeOption/GameModeOption1/ListLayout");
    btnListLayer = cc.find("Canvas/gameModeSelectLayer/mainSelectMode/BtnList");
    topInfoLayer = cc.find("Canvas/topInfoLayer");
    gameModeModel.ziMoJiaDi = 1;
    gameModeModel.ziMoHu = 0;
    gameModeModel.huanSanZhang = 0;
    gameModeModel.ziMoJiaFan = 0;
    gameModeModel.dianPaoHu = 0;
    gameModeModel.dianGangHua_dianPao = 0;
    gameModeModel.dianGangHua_ziMo = 0;
    gameModeModel.dai19JiangDui = 0;
    gameModeModel.mengQingZhongZhang = 0;
    gameModeModel.tianDiHu = 0;
    gameModeModel.fan2 = 0;
    gameModeModel.fan3 = 0;
    gameModeModel.fan4 = 0;
    gameModeModel.roundCount4 = 0;
    gameModeModel.roundCount8 = 0;
    //
    this.initlZiMoJiaDi();
  },

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
  /*
  normalSprite SpriteFrame
  普通状态下按钮所显示的 Sprite 。
  pressedSprite SpriteFrame
  按下状态时按钮所显示的 Sprite 。
  hoverSprite SpriteFrame
  悬停状态下按钮所显示的 Sprite 。
  disabledSprite SpriteFrame
    */
  initlZiMoJiaDi: function initlZiMoJiaDi() {

    //var btn= gameModeLayer.getChildByName("zibojiadiBtn");
    var btn = cc.find("rowOption1/zibojiadiBtn", gameModeLayer);
    var btnBtn = btn.getComponent(cc.Button);
    var btnLable = cc.find("rowOption1/ziMoJiaDiLabel", gameModeLayer);
    if (gameModeModel.ziMoJiaDi == 1) {
      btnBtn.normalSprite = this.CheckBoxBg;
      btnBtn.pressedSprite = this.CheckBoxBg;
      btnBtn.hoverSprite = this.CheckBoxBg;
      btnLable.color = checkLableColor;
    };

    for (var i = 2; i < 6; i++) {
      var btnLayerName = "BtnLay" + i;
      var arrowName = "Arrow" + i;
      var arrow = cc.find("" + btnLayerName + "/" + arrowName, btnListLayer);
      //console.log("arrow:"+"Canvas/gameModeSelectLayer/mainSelectMode/BtnList/"+btnLayerName+"/"+arrowName);
      arrow.active = false;
    }
    //disable dianPaoHu
    var dianPaoHubtn = cc.find("rowOption1/dianPaoHuBtn", gameModeLayer);
    var dianPaoHuLable = cc.find("rowOption1/dianPaoHuLabel", gameModeLayer);
    this.disableBtnAndLable(dianPaoHubtn, dianPaoHuLable);
    dianPaoHubtn = cc.find("rowOption2/ziMoHuBtn", gameModeLayer);
    dianPaoHuLable = cc.find("rowOption2/ziMoHuLabel", gameModeLayer);
    this.disableBtnAndLable(dianPaoHubtn, dianPaoHuLable);
  },
  //自摸加底 option 
  updateZiMoJiaDi: function updateZiMoJiaDi() {
    console.log("gameModeModel:" + gameModeModel.ziMoJiaDi);
    //cc.log(comp.uuid);
    var btn = cc.find("rowOption1/zibojiadiBtn", gameModeLayer);
    var btnBtn = btn.getComponent(cc.Button);

    // var parent=btn.getpa
    var btnLable = cc.find("rowOption1/ziMoJiaDiLabel", gameModeLayer);
    gameModeModel.ziMoJiaDi = this.updateUtilsBtnAndLable(btnBtn, btnLable, gameModeModel.ziMoJiaDi);
  },
  updateZiMoJiaFan: function updateZiMoJiaFan() {
    console.log("gameModeModel:" + gameModeModel.ziMoJiaFan);
    //cc.log(comp.uuid);
    var btn = cc.find("rowOption1/zibojiafanBtn", gameModeLayer);
    var btnBtn = btn.getComponent(cc.Button);
    var btnLable = cc.find("rowOption1/ziMoJiaFanLabel", gameModeLayer);
    gameModeModel.ziMoJiaFan = this.updateUtilsBtnAndLable(btnBtn, btnLable, gameModeModel.ziMoJiaFan);
  },
  updateDianGangHua_dianPao: function updateDianGangHua_dianPao() {},
  updateDianGangHua_ziMo: function updateDianGangHua_ziMo() {},
  updateDai19JiangDui: function updateDai19JiangDui() {},
  updateMengQingZhongZhang: function updateMengQingZhongZhang() {},
  updateTianDiHu: function updateTianDiHu() {},
  updateFan2: function updateFan2() {},
  updateFan3: function updateFan3() {},
  updateFan4: function updateFan4() {},
  updateRoundCount4: function updateRoundCount4() {},
  updateRoundCount8: function updateRoundCount8() {},
  updateHuanSanZhang: function updateHuanSanZhang() {},
  updateZiMoHu: function updateZiMoHu() {},
  updateDianPaoHu: function updateDianPaoHu() {},

  //----------------------------Utils function--------------------------------------------------------
  updateUtilsBtnAndLable: function updateUtilsBtnAndLable(btnBtn, btnLable, confValue) {
    if (confValue == 1) {
      btnBtn.normalSprite = this.noCheckBoxBg;
      btnBtn.pressedSprite = this.noCheckBoxBg;
      btnBtn.hoverSprite = this.noCheckBoxBg;
      btnLable.color = noCheckLableColor;
      return 0;
    } else {
      btnBtn.normalSprite = this.CheckBoxBg;
      btnBtn.pressedSprite = this.CheckBoxBg;
      btnBtn.hoverSprite = this.CheckBoxBg;
      btnLable.color = checkLableColor;
      return 1;
    }
  },
  disableBtnAndLable: function disableBtnAndLable(btnBtn, btnLable) {
    btnBtn.active = false;
    btnLable.active = false;
  },
  //----------------------------Utils function end--------------------------------------------------------
  //Left button mode click function...........
  //zibojiadiBtn,ziMoJiaDiLabel,zibojiafanBtn,ziMoJiaFanLabel,dianPaoHuBtn,dianPaoHuLabel
  //dianGangHuaDianPaoBtn,dianGangHuaDianPaoLabel
  xueZhanDaoDiButtonClick: function xueZhanDaoDiButtonClick() {},
  xueLiuChengHeButtonClick: function xueLiuChengHeButtonClick() {},
  DaoDaoHuButtonClick: function DaoDaoHuButtonClick() {},
  NeiJiangMaJiangButtonClick: function NeiJiangMaJiangButtonClick() {},
  SanRenLiangFangButtonClick: function SanRenLiangFangButtonClick() {}

});

cc._RFpop();
},{"gameMode":"gameMode"}],"GameTableController":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3e9f5gjELJBgpz05ThUKn9O', 'GameTableController');
// script/controllers/GameTableController.js

"use strict";

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
    onLoad: function onLoad() {
        this.user1Node.active = false;
        this.user2Node.active = false;
        this.user3Node.active = false;
        this.user4Node.active = false;
    },

    showUserInfo: function showUserInfo() {
        var userList = Global.userList;
        if (userList != null && userList != undefined) {
            for (var i = 0; i < userList.length; i++) {
                var user = userList[i];
            }
        }
    },

    initalUserInfoFromGobalList: function initalUserInfoFromGobalList() {
        var numberOrder = [3, 4, 1, 2];
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
                    s.spriteFrame = this.userReadyOK;
                } else {
                    s.spriteFrame = this.userReadyNotOk;
                }
            }
        }
    }
});

cc._RFpop();
},{}],"GameTableNetWork":[function(require,module,exports){
"use strict";
cc._RFpush(module, '76eeauiX4dOwp5EyKPFN5lL', 'GameTableNetWork');
// script/service/GameTableNetWork.js

"use strict";

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
        roundScoreNode: cc.Node

    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        actionUIScriptNode = self.actionNodeScript.getComponent("gameConfigButtonListAction");
        alertMessageUI = self.alertMessageNodeScirpt.getComponent("alertMessagePanle");
        userInfoScript = self.userInfoScriptNode.getComponent("tableUserInfo");
        moPaiScript = self.moPaiActionNode.getComponent("tableMoPaiAction");
        messageDomain = require("messageDomain").messageDomain;
        Global.subid = 0;
        connect_callback = function connect_callback(error) {
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
    },
    connectByPrivateChanel: function connectByPrivateChanel() {
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
    subscribeToPrivateChanelNoConnetAgain: function subscribeToPrivateChanelNoConnetAgain(thisRooNumber) {
        if (client == null || client == undefined) {}
        client.subscribe("/queue/privateUserChanel" + thisRooNumber, function (message) {
            var bodyStr = message.body;
            cc.log("######################");
            cc.log(bodyStr);
            var obj = JSON.parse(bodyStr);
            if (obj != undefined && obj != null) {
                for (var p in obj) {
                    messageDomain[p] = obj[p];
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
                        cc.log("Global.userList:" + Global.userList.toString());
                        userInfoScript.intalUserInfoReadyIcon();
                    } else {
                        alertMessageUI.text = Obj.messageExecuteResult;
                        alertMessageUI.setTextOfPanel();
                    }
                };
                //--------------------------------------------------
                if (messageDomain.messageAction == "joinExistRoom") {
                    var Obj = JSON.parse(messageDomain.messageBody);
                    var gobalUser = Global.userInfo;
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
                        var getUser = gameUserList[j];
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
                    var paiListLable = this.paiRestNode.getComponent(cc.Label);
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
                            var getUser = gameUserList[j];
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
                                paiListString = this.changeJsonListStringToArrayString(paiListString);
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
                    var paiListLable = this.paiRestNode.getComponent(cc.Label);
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

                                paiListString = this.changeJsonListStringToArrayString(paiListString);
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

                //set current round count
                if (messageDomain.messageAction == "setCurrentRoundCount") {
                    var currentRoundCount = messageDomain.messageBody;
                    if (currentRoundCount != null && currentRoundCount != undefined) {
                        Global.gameRoundCount = parseInt(currentRoundCount);
                        cc.log("set gameRoundCount:" + Global.gameRoundCount);
                    }
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
                            currentUser = userList2[i];
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
                        var paiLast = currentUser.paiListArray[currentUser.paiListArray.length - 1];
                        cc.log("First mopai:" + paiLast);
                        currentUser.userMoPai = paiLast;
                        tablePaiActionScript.updateUserListInGobal(currentUser);

                        var tableNode = cc.find("Canvas/tableNode");
                        var parentNode = cc.find("user3PaiList", tableNode);
                        var children = parentNode.children;
                        cc.log("First Name:" + children[children.length - 1].name);
                        children[children.length - 1].name = "mopai_" + paiLast;
                        cc.log("Last Name:" + children[children.length - 1].name);

                        //check if user have gang
                        var actionArray = paiActionScript.checkActionArrayInSelfPaiList(currentUser.openid);
                        cc.log("actionArray:" + actionArray.length);
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
                }
                if (messageDomain.messageAction == "endGameRoundLun") {
                    this.countUserRoundScore();
                    this.testScoreOutput();
                    var userInfo = Global.userInfo;
                    var currentUser = this.getCurreentUserByOpenId(userInfo.openid);
                    this.sendRoundScoreToServer(currentUser);
                    roundScoreScript.initalRoundScore();
                    roundScoreScript.endLunFlag = "1";
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
                }
                //--------------------------------------Game Action  -----------------------------------------------
                if (messageDomain.messageAction == "gameAction") {
                    var userList = Global.userList;
                    var userInfo = Global.userInfo;
                    var obj = JSON.parse(messageDomain.messageBody);
                    var fromUserOpenid = obj.fromUserOpenid;
                    var paiNumber = obj.paiNumber;

                    //---------------chupai------------------------
                    if (obj.actionName == "chuPai") {
                        paiActionScript.chuPaiUserOpenId = fromUserOpenid;
                        tableCenterScript.endTimer();
                        var paiList = obj.paiList;
                        if (paiList.indexOf(",") > 0) {
                            paiList = paiList.split(",");
                        } else {
                            paiList = [paiList];
                        }

                        var u = this.getCurreentUserByOpenId(fromUserOpenid);

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
                            userList = Global.userList;
                            var huActionListCache = [];
                            var noHuActionListCache = [];
                            for (var i = 0; i < userList.length; i++) {
                                if (fromUserOpenid != userList[i].openid) {
                                    if (userList[i].huPai == null || userList[i].huPai == undefined || userList[i].huPai == "") {
                                        var actionArray = paiActionScript.getActionBarArrayByOpenId(paiNumber, userList[i].openid, "");
                                        cc.log("openid :" + userList[i].openid);
                                        cc.log("paiList:" + userList[i].paiListArray.toString());
                                        cc.log("actionArray:" + actionArray.length);
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

                            if (huActionListCache.length > 0) {

                                /**
                                 * Here have a bug ,if two user already to hu pai ,but the other user already to peng or gang 
                                 * The correct way should need wait the two user to do decide.
                                 * But now ,it only support one user to do decide.
                                 * 
                                 */

                                //TODO we still need send the noHuActionListCache after the huActoin close the action bar.
                                var othreActionString = "";
                                if (noHuActionListCache.length > 0) {
                                    othreActionString = JSON.stringify(noHuActionListCache[0]);
                                }
                                for (var j = 0; j < huActionListCache.length; j++) {
                                    var obj = huActionListCache[j];
                                    this.sendShowActionBarOnOtherUser(obj.userOpenId, obj.actionArray.toString(), obj.paiNumber, othreActionString);
                                }
                            } else {
                                if (noHuActionListCache.length > 0) {
                                    for (var j = 0; j < noHuActionListCache.length; j++) {
                                        var obj = noHuActionListCache[j];
                                        this.sendShowActionBarOnOtherUser(obj.userOpenId, obj.actionArray.toString(), obj.paiNumber, "");
                                    }
                                }
                            }

                            //check if already have action in the other user 
                            var alreadyExistFlag = false;
                            for (var i = 0; i < userList.length; i++) {
                                if (userList[i].actionBarFlag == "1") {
                                    //show 
                                    alreadyExistFlag = true;
                                }
                            }
                            cc.log("alreadyExistFlag:" + alreadyExistFlag);

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
                            var user = this.getCurreentUserByOpenId(pengFromUserOpenId);
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

                            var user = this.getCurreentUserByOpenId(gangFromUserOpenId);
                            tableCenterScript.index = user.pointIndex;
                            tableCenterScript.showCenterPoint();
                        }
                    }
                    //-------------------------------------------------------------------
                    if (obj.actionName == "sendMessage") {
                        var sendUserOpendId = obj.openid;
                        var messageBody = obj.messageString;
                        messageScript.showMessage(messageBody);
                    }

                    //---------------moPai-----------------------------------------------


                    if (obj.actionName == "moPai") {
                        var paiNumber = obj.paiNumber;
                        var pengFromUserOpenId = obj.fromUserOpenid;
                        var pengPaiNumber = obj.nextMoPai;
                        var toUserOpenid = obj.toUserOpenid;
                        //0, open table center point
                        var user = this.getCurreentUserByOpenId(toUserOpenid);
                        tableCenterScript.index = user.pointIndex;
                        tableCenterScript.showCenterPoint();
                        //1, remove rest pai number in the table 
                        var paiRestCount = Global.restPaiCount;
                        if (paiRestCount != null && paiRestCount != undefined) {
                            paiRestCount = parseInt(paiRestCount) - 1;
                            Global.restPaiCount = paiRestCount;
                            var paiListLable = this.paiRestNode.getComponent(cc.Label);
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
                        var pai = obj.paiNumber;
                        var actionArray = paiActionScript.getSelfActionBarArray(pai, nextUserOpenid, "chupai");
                        if (actionArray.length > 1) {
                            this.sendCheckActionOnOtherUser(nextUserOpenid, "1");
                        } else {
                            this.sendCheckActionOnOtherUser(nextUserOpenid, "0");
                        }
                        var continueFlag = false;
                        var userList = Global.userList;
                        var userInfo = Global.userInfo;
                        for (var i = 0; i < userList.length; i++) {
                            if (userList[i].actionBarFlag == "-1") {}
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
                                count++;
                            }
                        }

                        if (sendMoPai == "0" && count == userList.length - 1) {
                            //no any action bar or it already send the mopai action 
                            this.sendMoPaiAction();
                        }
                    }
                    //showActionBar
                    if (obj.actionName == "showActionBar") {
                        cc.log("showActionBar action resive ");
                        var fromUserOpenId = obj.fromUserOpenid;
                        var arrayString = obj.actionArrayStr;
                        var otherUserActionString = obj.otherActionStr;
                        paiNumber = obj.paiNumber;
                        var userInfo = Global.userInfo;
                        if (userInfo.openid == fromUserOpenId) {
                            var actionArray = arrayString.split(",");
                            paiActionScript.fromUserOpenId = fromUserOpenId;
                            paiActionScript.paiNumber = paiNumber;
                            paiActionScript.otherUserActionString = otherUserActionString;
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
                                if (userInfo.openid != fromUserOpenId) {
                                    this.sendMoPaiAction();
                                }
                            }
                        }
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
                        //Global.huGangShangHuaChuPaiUserOpenId = gangFromUserOpenId;
                        //---set hu pai user center point 
                        var huuser = this.getCurreentUserByOpenId(fromUserOpenId);
                        tableCenterScript.index = huuser.pointIndex;
                        //update the hupai for the hu user
                        huuser.huPai = paiNumber;
                        huuser.huPaiFromUser = chuPaiUserOpenId;
                        huuser.huChuPaiType = huChuPaiType;
                        huuser.existUserString = existUserString;
                        // huuser.huGangPai = gangPai;
                        huuser.huGangShangHuaChuPaiUserOpenId = chuPaiUserOpenId; // gangFromUserOpenId;
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
                        var moPaiUserId = this.getNextUserFromCurentIndex();
                        //check if game round end
                        userList = Global.userList;
                        var huPeople = 0;
                        var endGameFlag = false;
                        for (var i = 0; i < userList.length; i++) {

                            if (userList[i].huPai != null && userList[i] != undefined && userList[i] != "") {
                                huPeople++;
                            }
                        }
                        cc.log("huPeople:" + huPeople);
                        cc.log("userList.length:" + userList.length);
                        if (huPeople == userList.length - 1) {
                            endGameFlag = true;
                        }
                        cc.log("endGameFlag:" + endGameFlag);
                        if (Global.restPaiCount == 0) {
                            // endGameFlag = true;
                        }

                        if (endGameFlag == false) {
                            if (moPaiUserId == userInfo.openid) {
                                //  this.sendMoPaiAction();
                            }
                        } else {
                            cc.log("**sendCheckRoundEnd**");
                            this.sendCheckRoundEnd();
                            //check the round end 
                            // var gameMode = Global.gameMode;
                            // var gameRoundCount = 0;
                            // if (gameMode.roundCount4 + "" == "1") {
                            //     gameRoundCount = 4
                            // }
                            // if (gameMode.roundCount8 + "" == "1") {
                            //     gameRoundCount = 8
                            // }
                            // if (Global.gameRoundCount == gameRoundCount) {
                            //     //show all round end interface
                            //     this.allGameRoundEndNode.active = true;

                            // } else {
                            //     //show round end interface 
                            //     this.gameRoundEndNode.active = true;

                            // }
                            //send to server to check if it already end the round and round lun 
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
    subscribeToPrivateChanel: function subscribeToPrivateChanel(thisRooNumber) {
        client.connect({}, function () {
            this.subscribeToPrivateChanelNoConnetAgain(thisRooNumber);
            //after reconect ,send the location infomation
            this.sendLocationInfoToServer();
        }.bind(this), function () {
            cc.log("websocket connect  Error:234");
            //client.disconnect();
        });
    },
    initalClient: function initalClient() {
        if (client == null || client == undefined) {
            this.connectByPrivateChanel();
            this.subscribeToPrivateChanel(roomNumber);
        }
    },
    //-------------------------------save location to user info -----------------
    saveLocationInfoToGobalInfo: function saveLocationInfoToGobalInfo(longitude, latitude) {
        var userInfo = Global.userInfo;

        userInfo.longitude = longitude;
        userInfo.latitude = latitude;
        Global.userInfo = userInfo;
    },
    //-------------------------------chu pai action---------------------------------------------
    sendUserAuthTokenAndRefreshTokenToServer: function sendUserAuthTokenAndRefreshTokenToServer(authToken, refreshToken, openid) {},

    sendLocationInfoToServer: function sendLocationInfoToServer() {

        var joinRoomNumber = Global.joinRoomNumber;
        var userInfo = Global.userInfo;
        var o = new Object();
        o.openid = userInfo.openid;
        o.longitude = userInfo.longitude;
        o.latitude = userInfo.latitude;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "updateLocation");
        this.sendMessageToServer(messageObj);
    },

    sendRoundScoreToServer: function sendRoundScoreToServer(user) {
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

    sendStartNewRound: function sendStartNewRound() {

        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        //o.fromUserOpenid = userOpenId;
        o.actionName = "startNewRound";
        //o.toUserOpenid = userOpenId;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },

    sendCheckRoundEnd: function sendCheckRoundEnd() {

        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        //o.fromUserOpenid = userOpenId;
        o.actionName = "checkRoundEnd";
        //o.toUserOpenid = userOpenId;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },

    sendCenterIndex: function sendCenterIndex(userOpenId) {

        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = userOpenId;
        o.actionName = "setCenterIndex";
        o.toUserOpenid = userOpenId;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },

    sendShowActionBarOnOtherUser: function sendShowActionBarOnOtherUser(showUserOpenid, arrayString, paiNumber, otherActionString) {
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
    sendCheckNextFlagActionOnOtherUser: function sendCheckNextFlagActionOnOtherUser(nextUserOpenid, paiNumber) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = nextUserOpenid;
        o.actionName = "checkActionBarFlag";
        o.paiNumber = paiNumber;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },
    sendCheckActionOnOtherUser: function sendCheckActionOnOtherUser(fromUserOpenid, flag) {
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = fromUserOpenId;
        o.actionName = "checkActionBar";
        o.actionFlag = flag;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },
    sendCacleToMoPaiAction: function sendCacleToMoPaiAction(userOpenid) {
        var moPaiUserOpenId = this.getNextUserFromCurentIndex();
        var joinRoomNumber = Global.joinRoomNumber;
        var o = new Object();
        o.fromUserOpenid = userOpenid;
        o.actionName = "cancleAction";
        o.toUserOpenid = userOpenid;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
    },
    sendCacleHuPaiAction: function sendCacleHuPaiAction() {},
    sendHuPaiAction: function sendHuPaiAction(fromUserOpenId, chuPaiUserOpenId, paiNumber, huChuPaiType, preStep, existUserString, gangFromUserOpenId) {
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

        //o.chuPaiType = Global.chuPaiActionType;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
        tableCenterScript.endTimer();
    },
    sendPengPaiAction: function sendPengPaiAction(fromUserOpenId, paiNumber) {
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
    sendGangPaiAction: function sendGangPaiAction(chuPaiUserOpenId, fromUserOpenId, paiNumber, gangTypeList) {
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
    sendChuPaiAction: function sendChuPaiAction(userOpenId, paiNumber, paiList, paiType) {
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
        o.nextMoPai = "";

        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "gameAction");
        this.sendMessageToServer(messageObj);
        //tableCenterScript.endTimer();
    },

    sendMoPaiOnSelecAction: function sendMoPaiOnSelecAction(openId) {
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
    sendMoPaiAction: function sendMoPaiAction() {
        cc.log("sendMoPaiAction");
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

    getNextUserByOpenId: function getNextUserByOpenId(openid) {
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
        cc.log("getNextUserByOpenId currentIndex:" + currentIndex);
        var user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
        // cc.log("1018 user.huPai:" + user.huPai);
        if (user.huPai != null && user.huPai != undefined & user.huPai != "") {
            currentIndex = this.getNextIndex(currentIndex);
            user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
            // cc.log("1022 user.huPai:" + user.huPai);
            if (user.huPai != null && user.huPai != undefined & user.huPai != "") {
                currentIndex = this.getNextIndex(currentIndex);
                user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
                //cc.log("1026 user.huPai:" + user.huPai);
                if (user.huPai != null && user.huPai != undefined & user.huPai != "") {
                    //show end round 
                }
            }
        }
        nextOpenId = user.openid;
        return nextOpenId;
    },

    getNextUserFromCurentIndex: function getNextUserFromCurentIndex() {
        var userList = Global.userList;
        var currentIndex = tableCenterScript.index;
        var nextIndex = 0;
        var nextOpenId = "";

        //cc.log("1013 currentIndex:" + currentIndex);
        currentIndex = this.getNextIndex(currentIndex);
        //tableActionScript.getNextUserFromCurentIndex
        cc.log("1096 currentIndex:" + currentIndex);
        var user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
        // cc.log("1018 user.huPai:" + user.huPai);
        if (user.huPai != null && user.huPai != undefined & user.huPai != "") {
            currentIndex = this.getNextIndex(currentIndex);
            user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
            // cc.log("1022 user.huPai:" + user.huPai);
            if (user.huPai != null && user.huPai != undefined & user.huPai != "") {
                currentIndex = this.getNextIndex(currentIndex);
                user = tablePaiActionScript.getCorrectUserByPoint(currentIndex);
                //cc.log("1026 user.huPai:" + user.huPai);
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
        cc.log("getNextUserFromCurentIndex:" + nextOpenId);
        return nextOpenId;
    },

    getNextIndex: function getNextIndex(currentIndex) {
        var nextIndex = 0;
        currentIndex = currentIndex + "";
        currentIndex = currentIndex.trim();
        currentIndex = parseInt(currentIndex);
        // cc.log("currentIndex:" + currentIndex);
        // cc.log("Global.userList.length:" + Global.userList.length);
        if (currentIndex == Global.userList.length) {
            // cc.log("1050:" + currentIndex);
            nextIndex = 1;
        } else {

            nextIndex = currentIndex + 1;
            //cc.log("1053:" + nextIndex);
        }
        //cc.log("1057:" + nextIndex);
        return nextIndex;
    },

    //--------------------------------------------------------------------------------------------------------
    testJoinRoom: function testJoinRoom(joinRoomNumber) {
        Global.joinRoomNumber = joinRoomNumber;
        // client.unsubscribe("sub-" + Global.subid);


        var userInfo = Global.userInfo;

        userInfo.roomNumber = joinRoomNumber;
        Global.userInfo = userInfo;
        //client.disconnect();
        this.connectByPrivateChanel();
        this.subscribeToPrivateChanelNoConnetAgain(joinRoomNumber);
        Global.subid = Global.subid + 1;
        cc.log("Global.subid:" + Global.subid);
        userInfo = Global.userInfo;
        var openId = userInfo.openid;
        //var messageObj = this.buildSendMessage(openId, joinRoomNumber, "joinRoom");
        //this.sendMessageToServer(messageObj);
    },

    joinRoom: function joinRoom(joinRoomNumber) {
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
    checkRoomNumber: function checkRoomNumber() {},
    //--------------------------------------------------------------------------------------------------------
    buildNewGameRound: function buildNewGameRound() {
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
                gameMode.publicIpLimit = "0";
                gameMode.gpsLimit = "0";
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
    closeGameRoundLun: function closeGameRoundLun() {
        userInfo = Global.userInfo;
        if (userInfo != null) {
            roomNumber = userInfo.roomNumber;
            var messageObj = this.buildSendMessage(roomNumber, roomNumber, "closeGameRoundLun");
            this.sendMessageToServer(messageObj);
        }
    },
    getFaPai: function getFaPai() {
        var messageObj = this.buildSendMessage("", roomNumber, "faPai");
        this.sendMessageToServer(messageObj);
    },
    //-------------------send huan sanzhang -----------------------------------------------
    //Global.huanSanZhangPaiList
    sendQuePai: function sendQuePai(quePaiCount, peopleCount) {

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
    //-------------------send Audio message -----------------------------------------------
    sendAudioMessage: function sendAudioMessage(mp3Base64EncodeString) {
        var joinRoomNumber = Global.joinRoomNumber;
        userInfo = Global.userInfo;
        var userCode = userInfo.userCode;
        var o = new Object();
        o.audioMessage = mp3Base64EncodeString;
        o.userCode = userCode;
        var messageObj = this.buildSendMessage(JSON.stringify(o), joinRoomNumber, "sendMp3Message");
        this.sendMessageToServer(messageObj);
    },
    //-------------------send huan sanzhang -----------------------------------------------
    //Global.huanSanZhangPaiList
    sendHuanSanZhang: function sendHuanSanZhang() {
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
    sendUserReadyToServer: function sendUserReadyToServer(event) {
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

    //--------------- Game chat room 
    sendMessageToUser: function sendMessageToUser(messageString) {

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

    sendMessageToServer: function sendMessageToServer(messageObj) {

        client.send("/app/user_private_message", {}, JSON.stringify(messageObj));
    },

    buildSendMessage: function buildSendMessage(messageBody, roomNum, action) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNum;
        messageDomain.messageAction = action;
        messageDomain.messageBody = messageBody;

        return messageDomain;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    //----------------Count round socre--------------------
    checkUserIfTingPai: function checkUserIfTingPai(user) {
        var paiList = user.paiListArray;
        cc.log("1276:" + paiList.toString());
        var gangPaiList = user.gangPaiList;
        var pengList = user.pengList;

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
        cc.log("checkUserIfTingPai quePai:" + quePai);
        for (var i = 0; i < paiTypeList.length; i++) {
            var pai = paiTypeList[i];
            if (quePai + "" != pai) {
                temp.push(pai);
            }
        }
        cc.log("checkUserIfTingPai temp:" + temp.toString());
        var testPaiList = [];
        for (var i = 0; i < temp.length; i++) {
            for (var j = 1; j <= 9; j++) {
                var paiNumber = temp[i] + "" + j;
                testPaiList.push(paiNumber);
            }
        }
        cc.log("testPaiList:" + testPaiList.toString());
        var huFlag = false;
        if (user.maxFanShu == undefined || user.maxFanShu == null) {
            user.maxFanShu = 0;
        }
        for (var i = 0; i < testPaiList.length; i++) {
            cc.log("1311:" + paiList.toString());
            huFlag = huPaiScript.hupaiLogic(testPaiList[i], user.openid, tempPaiList, "");
            cc.log("1312:" + tempPaiList.toString());
            cc.log("1313 pai:" + paiList.toString());
            if (huFlag == true) {
                user.tingJiao = true;
                paiList.push(testPaiList[i]);
                cc.log("1317:" + paiList.toString());
                paiList.sort(function (a, b) {
                    return a - b;
                });
                var returnArray = this.countHuPaiFanshu(pengList, gangPaiList, paiList);
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
        cc.log("checkUserIfTingPai user:" + user.openid);
        cc.log("checkUserIfTingPai:" + huFlag);
        return huFlag;
    },
    countUserRoundScore: function countUserRoundScore() {
        cc.log("countUserRoundScore starting ");
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
        cc.log("maxFan:" + maxFan);
        var roundScore = 0;
        var fanshu = 0;
        var details = "";
        //First set the ting jiao 
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            if (user.huPaiDetails == undefined || user.huPaiDetails == null) {
                user.huPaiDetails = "";
            }
            if (user.huPai != null && user.huPai != undefined && user.huPai != "") {} else {
                this.checkUserIfTingPai(user);

                cc.log("user.tingJiao:" + user.tingJiao);
                cc.log("user.tingJiao user:" + user.openid);
            }
        }

        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            user.huPaiFanShu = 0;
            var zimoJiaDiFalg = false;

            //First ----gang count ---only on hu pai and ting pai 
            if (user.huPai != null && user.huPai != undefined && user.huPai != "" || user.tingJiao == true) {

                var gangPaiList = user.gangPaiList;
                var paiList = user.paiListArray;
                var gangFromUserListOpenId = user.gangFromUserListOpenId;
                var userGangExistUser = user.gangExistUser;
                var existUserString = user.existUserString;
                var gangTypeList = user.gangTypeList;
                var gangExistUserCache = user.gangExistUserCache;
                cc.log("user gangTypeList1306:" + gangTypeList);
                cc.log("user :" + user.openid);
                cc.log("user existUserString:" + existUserString);
                if (gangPaiList != null && gangPaiList != undefined && gangPaiList.length > 0) {
                    for (var j = 0; j < gangPaiList.length; j++) {

                        if (user.huPaiFanShu <= maxFan) {
                            user.huPaiFanShu = user.huPaiFanShu + 1;
                        }
                        var userGangExistUser = userGangExistUser[j];
                        var userGangList = [];
                        if (userGangExistUser != undefined && userGangExistUser != null) {
                            userGangList = userGangExistUser.split(";");
                        }
                        this.setExistUserRoundCount(userGangExistUser, gangTypeList[j], user);
                        cc.log("gangTypeList[j]:" + gangTypeList[j]);
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
                var pengList = user.pengList;
                var paiList = user.paiListArray;

                //-----------hu pai  fanshu count -----------------------------------
                var returnArray = this.countHuPaiFanshu(pengList, gangPaiList, paiList);
                fanshu = returnArray[0];

                details = details + returnArray[1];
                user.huPaiFanShu = user.huPaiFanShu + fanshu;
                cc.log(" user.huPaiFanShu:" + user.huPaiFanShu);
                cc.log(" user.details:" + details);
                if (user.huPaiFanShu > maxFan) {
                    user.huPaiFanShu = maxFan;
                }

                //-----------zi mo check ----------------------------
                if (user.huPaiFanShu < maxFan) {
                    if (user.huPaiFromUser == user.openid) {
                        if (gameMode.ziMoJiaDi + "" == "1") {
                            //roundScore = roundScore + 1;
                            details = details + "自摸加底1;";
                            zimoJiaDiFalg = true;
                        }

                        if (gameMode.ziMoJiaFan + "" == "1") {
                            //fanshu = fanshu + 1;
                            user.huPaiFanShu = user.huPaiFanShu + 1;
                            details = details + "自摸加1番;";
                        }
                    }
                }

                cc.log(" user.huPaiFanShu 1355:" + user.huPaiFanShu);
                //-----------gang shang hua check --------------------
                if (user.huchuPaiType == "gang") {
                    if (user.huPaiFanShu < maxFan) {
                        user.huPaiFanShu = user.huPaiFanShu + 1;
                        details = details + "点杠加1番;";
                        //var huGangPai = user.huGangPai;
                        var gangFromUserList = user.gangFromUserListOpenId;
                    }
                }

                //existUserString
                if (gameMode.dianGangHua_ziMo + "" == "1") {}

                if (gameMode.dianGangHua_dianPao + "" == "1") {}

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
                    cc.log("1384 user.huPaiFanShu:" + user.huPaiFanShu);
                    cc.log("1384 user.roundScore:" + roundScore);
                    if (user.huPaiFanShu == undefined || user.huPaiFanShu == null || user.huPaiFanShu == 0 || user.huPaiFanShu == "") {} else {
                        for (var n = 1; n <= user.huPaiFanShu; n++) {
                            a = a * 2;
                        }
                    }

                    roundScore = a;
                    cc.log("1389 a:" + a);
                }

                if (zimoJiaDiFalg) {
                    roundScore = roundScore + 1;
                }

                cc.log("roundScore:" + roundScore);
                //start count for each user 

                if (user.huchuPaiType == "gang" && gameMode.dianGangHua_dianPao + "" == "1") {
                    cc.log("1388:" + user.huGangShangHuaChuPaiUserOpenId);
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
                    cc.log("user.roundScoreCount0:" + user.roundScoreCount);
                    if (user.roundScoreCount == null || user.roundScoreCount == undefined) {
                        user.roundScoreCount = roundScore * existUserList.length;
                    } else {
                        user.roundScoreCount = user.roundScoreCount + roundScore * existUserList.length;
                    }
                    user.huPaiDetails = details + " 胡牌得分:" + roundScore * existUserList.length + ";";
                    cc.log("user.roundScoreCount1:" + roundScore);
                    cc.log("user.roundScoreCount2:" + roundScore * existUserList.length);
                    cc.log("user.roundScoreCount3:" + user.roundScoreCount);
                    cc.log("user.huPaiDetails:" + user.huPaiDetails);
                    for (var k = 0; k < existUserList.length; k++) {
                        cc.log("existUserList[k]:" + existUserList[k]);
                        if (existUserList[k] != null && existUserList[k] != undefined && existUserList[k] != "") {
                            var tempUser = this.getCurreentUserByOpenId(existUserList[k]);
                            if (tempUser.roundScoreCount == null || tempUser.roundScoreCount == undefined) {
                                tempUser.roundScoreCount = -roundScore;
                            } else {
                                tempUser.roundScoreCount = tempUser.roundScoreCount - roundScore;
                            }
                            if (tempUser.huPaiDetails == undefined || tempUser.huPaiDetails == null) {
                                tempUser.huPaiDetails = "";
                            }

                            tempUser.huPaiDetails = tempUser.huPaiDetails + " 胡牌失分:-" + roundScore + ";";
                            cc.log("tempUser.roundScoreCount:" + tempUser.roundScoreCount);
                        }
                    }
                }

                //呼叫转移
                if (user.huchuPaiType == "gang") {
                    var firstGangUserOpenId = user.huGangShangHuaChuPaiUserOpenId;
                    var firstGangUser = this.getCurreentUserByOpenId(firstGangUserOpenId);
                    //var firstXiaJiaoFlag = this.checkUserIfTingPai(firstGangUser);
                    if (firstGangUser.huPai != null && firstGangUser.huPai != undefined && firstGangUser.huPai != "" || firstGangUser.tingJiao == true) {

                        //only firstGangUser xia jiao 
                        var firstGangUserPaiList = firstGangUser.gangPaiList;
                        cc.log("firstGangUserPaiList:" + firstGangUserPaiList);
                        var resultScoreceHuJiao = 0;
                        if (firstGangUserPaiList != null && firstGangUserPaiList != undefined && firstGangUserPaiList.length > 0) {
                            var firstUserGangExistUser = firstGangUser.gangExistUser;
                            cc.log("firstUserGangExistUser:" + firstUserGangExistUser);
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
                                            resultScoreceHuJiao = score;
                                        } else {
                                            resultScoreceHuJiao = tempUserCacheList.length * score;
                                        }
                                    }
                                }
                            }
                            if (user.roundScoreCount == undefined || user.roundScoreCount == null) {
                                user.roundScoreCount = 0;
                            }
                            user.roundScoreCount = user.roundScoreCount + resultScoreceHuJiao;
                            user.huPaiDetails = user.huPaiDetails + " 呼叫转移 " + resultScoreceHuJiao + ";";
                            firstGangUser.roundScoreCount = firstGangUser.roundScoreCount - resultScoreceHuJiao;
                            firstGangUser.huPaiDetails = firstGangUser.huPaiDetails + " 呼叫转移 -" + resultScoreceHuJiao + ";";
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
        //cc.log("xiaJiaoUserList:" + xiaJiaoUserList.toString());
        //cc.log("noXiaJiaoUserList:" + noXiaJiaoUserList.toString());
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
                            noXiaJiaoUserList[j].huPaiDetails = noXiaJiaoUserList[j].huPaiDetails + "查花猪 ";
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

                    noXiaJiaoUserList[j].huPaiDetails = noXiaJiaoUserList[j].huPaiDetails + " 赔叫失分:-" + peiFuFenShu + ";";
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
    checkHuaZhu: function checkHuaZhu(user) {
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
    testScoreOutput: function testScoreOutput() {

        var userList = Global.userList;
        for (var i = 0; i < userList.length; i++) {
            var score = userList[i].roundScoreCount;
            var details = userList[i].huPaiDetails;
            cc.log("user:" + userList[i].openid + "--" + score);
            cc.log("user details:" + details);
        }
    },
    //--------------count pai list---------------------------------------
    countHuPaiFanshu: function countHuPaiFanshu(pengList, gangList, paiList) {
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

        var minPai = paiList[0];
        minPai = minPai + "";
        var minPaiType = minPai[0];
        for (var i = 0; i < paiList.length; i++) {
            var paiArrayCache = [];
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
            // cc.log("paiArrayCache:" + paiArrayCache.toString());

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
            }

            qiaoQiDuiFlag = false;
            menqingFlag = false;
        }
        cc.log("1554:" + fanShu);
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
            }

            qiaoQiDuiFlag = false;
            menqingFlag = false;
        }

        if (daDuiZiFlag) {
            fanShu = fanShu + 1;
            details = details + " 大对子:1番;";
        }

        if (qingYiSeFlag) {
            fanShu = fanShu + 2;
            details = details + "清一色:2番;";
        }

        if (qiaoQiDuiFlag) {
            fanShu = fanShu + 2;
            details = details + "巧七对:2番;";
        }

        if (anGangFlag) {
            fanShu = fanShu + anGangCount;
            details = details + "自杠:" + anGangCount + "番;";
        }

        if (gameMode.dai19JiangDui + "" == "1") {
            if (yaoJiuFlag) {
                fanShu = fanShu + 2;
                details = details + "带幺九:2番;";
            }
        }
        if (gameMode.mengQingZhongZhang + "" == "1") {
            if (menqingFlag) {
                fanShu = fanShu + 1;
                details = details + "门清:1番;";
            }
            if (zhongZhangFlag) {
                fanShu = fanShu + 1;
                details = details + "中张:1番;";
            }
        }

        cc.log("1612:" + fanShu);
        //qiao qi dui 
        returnArray.push(fanShu);
        returnArray.push(details);
        return returnArray;
    },
    /**Set the gang score for user and other exist  */
    setExistUserRoundCount: function setExistUserRoundCount(existUserStr, type, user) {
        cc.log("existUserStr:" + existUserStr);
        var score = 0;
        if (type == "1") {
            score = 1;
        }
        if (type == "2") {
            score = 2;
        }
        var existUserList = existUserStr.split(";");
        for (var i = 0; i < existUserList.length; i++) {
            cc.log("existUserList[i]:" + existUserList[i]);
            var existUser = this.getCurreentUserByOpenId(existUserList[i]);
            if (existUser.roundScoreCount == null || existUser.roundScoreCount == undefined || existUser.roundScoreCount == "") {
                existUser.roundScoreCount = 0 - score;
            } else {
                existUser.roundScoreCount = existUser.roundScoreCount - score;
            }
            if (existUser.huPaiDetails == undefined) {
                existUser.huPaiDetails = "";
            }
            existUser.huPaiDetails = existUser.huPaiDetails + "被杠失分:-" + score + ";";
            cc.log(" existUser.roundScoreCount:" + existUser.roundScoreCount);
            cc.log(" existUser.huPaiDetails:" + existUser.huPaiDetails);
        }

        if (user.roundScoreCount == null || user.roundScoreCount == undefined || user.roundScoreCount == "") {
            user.roundScoreCount = score * existUserList.length;
        } else {
            user.roundScoreCount = user.roundScoreCount + score * existUserList.length;
        }
        if (score == 2) {
            user.huPaiDetails = user.huPaiDetails + "自杠得分:" + score * existUserList.length + ";";
        } else {
            user.huPaiDetails = user.huPaiDetails + "杠牌得分:" + score * existUserList.length + ";";
        }
        cc.log(" user.roundScoreCount:" + user.roundScoreCount);
        cc.log(" user.huPaiDetails:" + user.huPaiDetails);
    },
    //----------------untils-------------------------------
    changeJsonListStringToArrayString: function changeJsonListStringToArrayString(tempString) {
        var str = "";
        if (tempString != null && tempString != undefined) {
            tempString = tempString.replace("[", "");
            tempString = tempString.replace("]", "");
            var list = tempString.split(",");
            for (var i = 0; i < list.length; i++) {
                if (list[i] != null && list[i] != undefined) {
                    var s = list[i] + "";
                    s = s.trim();
                    str = str + s + ",";
                }
            }
        }
        if (str.substring(str.length - 1) == ",") {
            str = str.substring(0, str.length - 1);
        }
        return str;
    },
    getCurreentUserByOpenId: function getCurreentUserByOpenId(openid) {

        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == openid) {
                user = userList[i];
            }
        }

        return user;
    },
    countElementAccount: function countElementAccount(pai, paiList) {
        var count = 0;
        for (var i = 0; i < paiList.length + 1; i++) {
            if (paiList[i] == pai) {
                count++;
            }
        }

        return count;
    }
});

cc._RFpop();
},{"gameMode":"gameMode","messageDomain":"messageDomain","userInfoDomain":"userInfoDomain"}],"GameTableRoom":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6644burEGRNWp50bOhkoa6a', 'GameTableRoom');
// script/service/GameTableRoom.js

"use strict";

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
        quePaiNode: cc.Node,
        huanPaiNode: cc.Node,
        tableCenterNode: cc.Node,
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
        a9: cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function onLoad() {
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
    createRoom_clearTableInitalUserInfo: function createRoom_clearTableInitalUserInfo() {
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
    endToRoom: function endToRoom() {
        this.backRoomBtn.action = false;
        //build remove all online room from server
        // this.buildCanleUserMessageAndSendIt(userListArray[2].roomNumber);

    },
    //back to room by preRoomNumber
    backToRoom: function backToRoom() {
        if (privateClient != null || privateClient != undefined) {
            privateClient.unsubscribe();
        }
        socket = new SockJS(serverUrl + "/stomp");
        this.initalPrivateChanleForUser(preRoomNumber, "send");
    },
    //create a new room 
    createRoomAndEnterTable: function createRoomAndEnterTable() {

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
    closeRoomNumberLayer: function closeRoomNumberLayer() {
        var listButton = this.gameMainMenu.getChildByName("ListButton");
        var topInfoUser = this.gameMainMenu.getChildByName("topInfoUserLayer");
        listButton.active = true;
        topInfoUser.active = true;
        this.roomNumberLayer.active = false;
        //this.roomNumberLayer.opacity = 255;
    },
    showRoomNumberLayer: function showRoomNumberLayer() {
        //this.showGameTable();
        //close the private wesokect
        var listButton = this.gameMainMenu.getChildByName("ListButton");
        var topInfoUser = this.gameMainMenu.getChildByName("topInfoUserLayer");
        listButton.active = false;
        topInfoUser.active = false;
        this.roomNumberLayer.active = true;
        this.roomNumberLayer.opacity = 255;
    },
    joinRoomAndEnterTable: function joinRoomAndEnterTable() {

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
    showGameTable: function showGameTable() {
        this.gameMainMenu.active = false;
        this.gameModeNode.active = false;
        this.tableNode.active = true;
        this.tableNode.opacity = 255;
        //hide other UI .
        this.quePaiNode.active = false;
        this.tableCenterNode.active = false;
        this.createRoom_clearTableInitalUserInfo();
        //this.initalUserReadyLayer();
    },
    showGameMenu: function showGameMenu() {
        this.gameMainMenu.active = true;
        this.gameModeNode.active = false;
        this.tableNode.active = false;
        this.roomNumberLayer.active = false;
        this.userReadyLayer.active = false;
    },
    //TODO
    userBackToMainMeau: function userBackToMainMeau() {
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
            preRoomNumber = null;
        }
        this.buildCanleUserMessageAndSendIt(userListArray[2].roomNumber);

        //preRoomNumber
        //4. hide the ready icon for empry user

    },
    //This function will commit a private room number to server
    //Server public a message to the private chanle ,any active client will send back active message and key to server
    //Server public the active client in the private chanle again ,client get which client is active
    checkOnlineUserInThePrivateChanle: function checkOnlineUserInThePrivateChanle() {},

    //change user statu to ready or canle the ready
    changeUserStatu: function changeUserStatu() {
        var useropenid = userListArray[2].openid;
        var roomNumber = userListArray[2].roomNumber;
        var status = parseInt(userListArray[2].gameingStatu);
        cc.log("send status1:" + status);
        //status 0-offline ,1-online ,2-not ready, 3-ready,4-gameing,5-other 
        if (status == 1) {
            status = 3;
        } else if (status == 2) {
            status = 3;
        } else if (status == 3) {
            status = 2;
        }

        cc.log("send status2:" + status);
        this.buildChangeUserStatusMessageAndSendIt(useropenid, roomNumber, status);
    },
    checkUserStatu: function checkUserStatu() {},

    //-------------------------------------------Game Table function End-----------------------------------------------------
    showGameMode: function showGameMode() {
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
    initalUserInfoLayer: function initalUserInfoLayer(userInfoNode) {
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
    initalUserInfoLayerById: function initalUserInfoLayerById(userInfoNode, id) {
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
    initalUserReadyLayer: function initalUserReadyLayer() {
        this.userReadyLayer.active = true;
        this.userReady1Node.active = false;
        this.userReady2Node.active = false;
        this.userReady3Node.active = false;
        this.userReady4Node.active = false;
    },
    //----------------------------------web sokec connect and subscribe and handle resive message------------------------
    initalPrivateChanleForUser: function initalPrivateChanleForUser(roomNumber, action) {
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
                        messageDomain[p] = obj[p];
                    }
                }
                //1. join new user to room-------------------------------------------------------------------------
                if (messageDomain.messageAction == "addNewUserToPrivateChanle") {
                    var userListJsonStr = messageDomain.messageBody;
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
                    var userPaiList = obj.userPaiList;
                    for (var i = 0; i < userPaiList.length; i++) {
                        for (var j = 0; j < userListArray.length; j++) {
                            if (userPaiList[i].openid == userListArray[j].openid) {}
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
    sendWebSokectMessageToServer: function sendWebSokectMessageToServer(messageObj) {
        // var o = new Object();
        // o.token = "test word"
        privateClient.send("/app/resiveAllUserChanlePusmicGame", {}, JSON.stringify(messageObj));
    },
    //-----------------------------------------------------------------------------------------------------------------
    removeOnlineUserById: function removeOnlineUserById() {
        var xhr = new XMLHttpRequest();
        var url = serverUrl + "/user/removeOnlinUserById?userId=" + Global.userInfo.id;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },
    checkOnlineRoomNumber: function checkOnlineRoomNumber(roomNumber, self) {
        var xhr = new XMLHttpRequest();
        var url = serverUrl + "/room/checkOnlineRoomNumberCorrect?roomNumber=" + roomNumber + "&openunid=" + Global.userInfo.openid;
        //url = serverUrl + "/user/getLoginUserIP";
        xhr.onreadystatechange = function () {
            cc.log("xhr.status:" + xhr.status);
            cc.log("xhr.readyState:" + xhr.readyState);

            cc.log("-----------");

            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
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
    onDestroy: function onDestroy() {
        var self = this;
        self.removeOnlineUserById();
        cc.log("remove success");
        //colse the websokect
        privateClient.disconnect();
    },
    //------------------------------------until function in this classs---------------------------------------------
    //add the new user to private chanle
    buildAddNewUserMessageAndSendIt: function buildAddNewUserMessageAndSendIt(roomNumber) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNumber;
        messageDomain.messageAction = "addNewUserToPrivateChanle";
        messageDomain.messageBody = "";
        this.sendWebSokectMessageToServer(messageDomain);
    },
    //change the user status
    buildChangeUserStatusMessageAndSendIt: function buildChangeUserStatusMessageAndSendIt(useropenid, roomNumber, stauts) {
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
    buildGameModeMessageAndSendIt: function buildGameModeMessageAndSendIt(roomNumber) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNumber;
        messageDomain.messageAction = "publicGameMode";
        messageDomain.messageBody = JSON.stringify(gameModeModel);
        this.sendWebSokectMessageToServer(messageDomain);
    },
    //send the canle user openid to server and public to other
    buildCanleUserMessageAndSendIt: function buildCanleUserMessageAndSendIt(roomNumber) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNumber;
        messageDomain.messageAction = "userCanleRoom";
        messageDomain.messageBody = userListArray[2].openid;
        this.sendWebSokectMessageToServer(messageDomain);
    },
    //build update room number for user message
    buildUpdateRoomNumberOfOnlineUserMessage: function buildUpdateRoomNumberOfOnlineUserMessage(roomNumber, myopenid) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNumber;
        messageDomain.messageAction = "updateOnlineUserRoomNumber";
        messageDomain.messageBody = myopenid;
        this.sendWebSokectMessageToServer(messageDomain);
    },
    setUserStautsAndImage: function setUserStautsAndImage(i, userStatus) {
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
        } else {}

        var s = userReadNode.getComponent(cc.Sprite);
        if (userStatus == 2) {
            s.spriteFrame = this.userStatusNoImage;
        }
        if (userStatus == 3) {
            s.spriteFrame = this.userStatusYesImage;
        }

        userListArray[i].gameingStatu = userStatus;
    }
});

cc._RFpop();
},{"gameMode":"gameMode","messageDomain":"messageDomain"}],"Global":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8df21LbC7VA97Co/90BONyx', 'Global');
// script/domainClass/Global.js

"use strict";

window.Global = {
    userInfo: null,
    gameConfig: null,
    gameConfigSetting: null,
    gameMode: null,
    hostServerIp: "192.168.0.100",
    hostServerPort: "9001",
    hostHttpProtocol: "http",
    privateClientChanle: null,
    joinRoomNumber: null,
    userList: [],
    subid: 0,
    chuPaiActionType: "",
    huanSanZhangPaiList: [],
    restPaiCount: 0,
    gameRoundCount: 1,
    chuPaiUserOpenId: "",
    gangHuPai: "",
    gangFromUserOpenId: "",
    huGangShangHuaChuPaiUserOpenId: "",
    huPreStep: ""
};

cc._RFpop();
},{}],"HuPaiAction":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7e9d7MFvrlCA5I+AZQVunqv', 'HuPaiAction');
// script/ui/HuPaiAction.js

"use strict";

var tableActionScript;
var tableUserInfoScript;
var tableMoPaiActionScript;
var sourcePaiList;
var sourcePaiCount;
var huFlag = false;
var jiangFlag = false;
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
        tableAction: cc.Node,
        moPaiPrefab: cc.Prefab,
        user3PaiListNode: cc.Node,
        tableUserInfo: cc.Node,
        tableMoPaiNode: cc.Node,
        huPaiScriptFrame: cc.SpriteFrame,
        user1HuNode: cc.Node,
        user2HuNode: cc.Node,
        user3HuNode: cc.Node,
        user4HuNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        tableActionScript = this.tableAction.getComponent("tablePaiAction");
        tableUserInfoScript = this.tableUserInfo.getComponent("tableUserInfo");
        tableMoPaiActionScript = this.tableMoPaiNode.getComponent("tableMoPaiAction");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    testHuPai: function testHuPai() {
        this.huPaiAction("19", "testUser2");
        this.huPaiAction("19", "testUser0");
        this.huPaiAction("19", "testUser1");
        this.huPaiAction("19", "testUser3");
    },

    testHuLoginc: function testHuLoginc() {
        var paiStr = "22,23,24,27,27,31,31,32,32,34,35,36,36,36";
        var paiList = paiStr.split(",");
        var huFlagDetails = this.startDecideHu(paiList);
        cc.log("huFlagDetails:" + huFlagDetails);
        //12,14,14,16,18,18,18,35,35,35,37,39,39
        paiStr = "12,14,14,16,18,18,18,35,35,35,37,39,39";
        paiList = paiStr.split(",");
        huFlagDetails = this.startDecideHu(paiList);
        cc.log("huFlagDetails1:" + huFlagDetails);
        for (var i = 0; i < 18; i++) {
            paiStr = "22,22,22,26,26,26,27,28,33,33,33,36,36,36";
            paiList = paiStr.split(",");
            huFlagDetails = this.startDecideHu(paiList);
            cc.log("huFlagDetails2:" + i + "--" + huFlagDetails);
        }
    },

    huPaiAction: function huPaiAction(paiNumber, userOpenId, preStep) {
        var currentUser = tableActionScript.getCorrectUserByOpenId(userOpenId);
        var paiList = currentUser.paiListArray;
        var latstIndex = 0;
        if (paiList.length == 13) {
            latstIndex = 13;
        } else {
            latstIndex = paiList.length;
        }
        var userPoint = currentUser.pointIndex;
        var paiPath = tableActionScript.getChuPaiNameByNodeName(paiNumber, userPoint);

        var paiNode = cc.instantiate(this.moPaiPrefab);
        var sprite = paiNode.getComponent(cc.Sprite);
        paiNode.name = "hupai" + latstIndex + "_" + paiNumber;
        //paiNode.active = false;
        var sprite = paiNode.getComponent(cc.Sprite);
        cc.loader.loadRes(paiPath, cc.SpriteFrame, function (err, sp) {
            cc.log("61:" + paiPath);
            if (err) {
                cc.log("Error:" + err);
                return;
            }
            cc.log("65:");
            sprite.spriteFrame = sp;
            paiNode.active = true;
        });
        paiNode = this.getCureentPostionFromUserPointAndPaiList(paiList, userPoint, paiNode);
        var userNodeName = "user" + userPoint + "PengPaiListNode";
        cc.log("userNodeName:" + userNodeName);
        //var userNodePaiList = cc.find(userNodeName, this.tableNode);
        //userNodePaiList.addChild(paiNode);
        //---data layer-----------------
        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userOpenId) {
                user = userList[i];
                break;
            }
        }
        user.userMoPai = paiNumber;
        user.huPai = paiNumber;
        // if (preStep == "zigang") {
        //     user.huPaiType = "gangshanghua"
        // } else if (preStep == "gang") {
        //     user.huPaiType = "gangshangpao"
        // } else {
        //     user.huPaiType = ""
        // }

        // tableActionScript.insertMoPaiIntoPaiList(user);
        tableMoPaiActionScript.updateUserListInGobal(user);
        tableActionScript.disableAllSlefPai();

        //show HU pai on the current user 

        userPoint = userPoint + "";

        // var huPaiNode = cc.instantiate(this.moPaiPrefab);
        // var huSprite = huPaiNode.getComponent(cc.Sprite);
        // huSprite.spriteFrame = this.huPaiScriptFrame;
        if (userPoint == "1") {
            this.user1HuNode.active = true;
            this.user1HuNode.addChild(paiNode);
        } else if (userPoint == "2") {
            this.user2HuNode.active = true;
            this.user2HuNode.zIndex = 400;
            this.user2HuNode.addChild(paiNode);
        } else if (userPoint == "3") {
            this.user3HuNode.active = true;
            this.user3HuNode.addChild(paiNode);
        } else {
            this.user4HuNode.active = true;
            this.user4HuNode.zIndex = 400;
            this.user4HuNode.children[0].zIndex = 40;
            this.user4HuNode.addChild(paiNode);
        }

        //  userNodePaiList.addChild(huPaiNode);

    },
    hupaiLogicNoInsert: function hupaiLogicNoInsert(paiList) {
        var huFlagDetails = false;
        if (this.checkQiaoQiDui(paiList)) {
            return true;
        } else {
            huFlagDetails = this.startDecideHu(paiList);
            cc.log("huFlagDetails:" + huFlagDetails);
            return huFlagDetails;
        }
    },
    //decide the painumber if hu or not hu .
    hupaiLogic: function hupaiLogic(paiNumber, userOpenId, paiList, type) {
        jiangFlag = false;
        huFlag = false;
        sourcePaiCount = 0;
        var tempList = [];
        for (var i = 0; i < paiList.length; i++) {
            tempList.push(paiList[i]);
        }
        //var currentUser = tableActionScript.getCorrectUserByOpenId(userOpenId);
        var huFlagDetails = false;
        //var paiList = tableActionScript.insertPaiIntoPaiListByPaiAndOpenId(paiNumber, userOpenId)
        //if pai from other user ,it need insert into pai list 
        //if it from self it noe need insert the pai again.
        if (type != "mopai") {
            cc.log("No is mopai insert the paiNumber");
            tempList = tableActionScript.insertPaiIntoPaiListByPaiAndPaiList(paiNumber, tempList);
        }
        if (this.checkQiaoQiDui(tempList)) {
            return true;
        } else {
            huFlagDetails = this.startDecideHu(tempList);
            cc.log("huFlagDetails:" + huFlagDetails);
            return huFlagDetails;
        }
    },

    analyze: function analyze(paiList) {
        if (paiList.length == 0) {
            return true;
        };
        var ahuflag = false;
        for (var i = 0; i < paiList.length; i++) {

            var pai = paiList[i];
            //check pai is  san zhang 
            var count = this.countElementAccount(pai, paiList);
            cc.log("pai:" + pai);
            cc.log("paiList:" + paiList);
            if (count >= 3) {
                var oldPaiList = [];
                oldPaiList = this.deepCopyArray(paiList, oldPaiList);
                oldPaiList = tableActionScript.removeElementByNumberByPaiListFromUser(oldPaiList, pai, 3);
                //  cc.log("oldPaiList:" + oldPaiList.toString())
                ahuflag = this.analyze(oldPaiList);
                return ahuflag;
            }
            //check pai is san lian zhang 
            // cc.log("count:" + count);
            var oldPaiList2 = [];
            oldPaiList2 = this.deepCopyArray(paiList, oldPaiList2);
            // cc.log("oldPaiList2-0:" + oldPaiList2.toString());
            oldPaiList2 = this.checkLianSanZhan(pai, oldPaiList2);
            // cc.log("oldPaiList2-1:" + oldPaiList2.toString());
            //  cc.log("oldPaiList2-paiList:" + paiList.length);
            if (oldPaiList2.length != paiList.length) {
                //    cc.log("oldPaiList2:" + oldPaiList2.toString())
                ahuflag = this.analyze(oldPaiList2);
                return ahuflag;
            }

            //all not is ,return false 
            return false;
        }
    },
    startDecideHu: function startDecideHu(paiList) {
        cc.log("106 paiList:" + paiList.toString());
        var caChepailist = [];
        for (var i = 0; i < paiList.length; i++) {
            var paiArrayCache = [];
            var pai = paiList[i] + "";
            pai = pai.trim();
            var count = this.countElementAccount(pai, paiList);
            paiArrayCache.push(pai);
            paiArrayCache.push(count);
            // cc.log("paiArrayCache:" + paiArrayCache.toString());

            caChepailist.push(paiArrayCache);
        }
        var noJiangpaiList = [];
        for (var i = 0; i < caChepailist.length; i++) {
            var arr = caChepailist[i];
            //cc.log("arr:" + arr.toString());
            //  cc.log("arr`:" + arr[1]);
            if (arr[1] >= 2) {
                var oldPaiList = [];
                oldPaiList = this.deepCopyArray(paiList, oldPaiList);
                oldPaiList = tableActionScript.removeElementByNumberByPaiListFromUser(oldPaiList, arr[0], 2);

                if (noJiangpaiList.indexOf(oldPaiList) < 0) {
                    //  cc.log("oldPaiList:" + oldPaiList.toString());
                    noJiangpaiList.push(oldPaiList);
                }
            }
        }

        if (noJiangpaiList.length == 0) {
            return false;
        } else {
            for (var i = 0; i < noJiangpaiList.length; i++) {
                var p = noJiangpaiList[i];
                // cc.log("no jiang p:" + p.toString())
                var phuflag = this.analyze(p);
                //cc.log("no jiang phuflag:" + phuflag)
                if (phuflag == true) {
                    return true;
                }
            }
        }

        // jiangFlag = false;

        return false;
    },
    checkLianSanZhan: function checkLianSanZhan(pai, paiList) {
        pai = parseInt(pai);
        var paiNumber = pai[1];
        var prePai = -1;
        var nextPai = -1;
        var executeFlag = false;
        if (paiNumber + "" == "1") {
            prePai = pai + 1;
            nextPai = pai + 2;
        } else if (paiNumber + "" == "9") {
            prePai = pai - 1;
            nextPai = pai - 2;
        } else {
            prePai = pai - 1;
            nextPai = pai + 1;
        }
        if (this.contains(paiList, prePai) && this.contains(paiList, nextPai)) {
            executeFlag = true;
        } else {
            prePai = pai + 1;
            nextPai = pai + 2;
            cc.log("prePai:" + prePai + "--" + "nextPai:" + nextPai);
            if (this.contains(paiList, prePai) && this.contains(paiList, nextPai)) {
                executeFlag = true;
            } else {
                prePai = pai - 1;
                nextPai = pai - 2;
                if (this.contains(paiList, prePai) && this.contains(paiList, nextPai)) {
                    executeFlag = true;
                } else {
                    executeFlag = false;
                }
            }
        }
        cc.log("executeFlag:" + executeFlag);
        cc.log("prePai2:" + prePai + "--" + "nextPai:" + nextPai);
        if (executeFlag == true) {
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, prePai, 1);
            cc.log("paiList0:" + paiList.toString());
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, nextPai, 1);
            cc.log("paiList1:" + paiList.toString());
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, pai, 1);
        }

        return paiList;
    },
    removeLianSanZhang: function removeLianSanZhang(pai, paiList) {},
    liangZhang: function liangZhang(pai, paiList) {
        var count = this.countElementAccount(pai, paiList);
        if (count == 2 || count == 4) {
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, pai, 2);
        }
        return paiList;
    },
    checkSanZhang: function checkSanZhang(pai, paiList) {
        var count = this.countElementAccount(pai, paiList);
        if (count >= 3) {
            paiList = tableActionScript.removeElementByNumberByPaiListFromUser(paiList, pai, 3);
        }

        return paiList;
    },
    checkQiaoQiDui: function checkQiaoQiDui(paiList) {
        cc.log("checkQiaoQiDui pailist:" + paiList.toString());
        var tempList = [];
        var flag = false;
        if (paiList.length >= 13) {
            tempList = this.deepCopyArray(paiList, tempList);
            for (var i = 0; i < tempList.length; i++) {
                var sourceLen = tempList.length;
                tempList = this.liangZhang(tempList[i], tempList);
                cc.log("paiList:" + tempList);
                var oldLen = tempList.length;
                if (sourceLen != oldLen) {
                    i = 0;
                }
            }

            if (tempList.length == 0) {
                flag = true;
            } else {
                flag = false;
            }
        }

        cc.log("paiList:" + tempList.toString());
        return flag;
    },

    testQiaoQiDui: function testQiaoQiDui() {

        var paiList = [15, 15, 18, 18, 22, 22, 25, 25, 25, 25, 29, 29, 38, 38];

        var f = this.checkQiaoQiDui(paiList);
        cc.log("check qiaoqidui:" + f);
    },
    testHu: function testHu() {
        var paiList = [15, 15, 16, 16, 17, 17, 18, 18, 18, 36, 36];
        sourcePaiCount = 0;
        huFlag = false;
        jiangFlag = false;

        cc.log("testHU 1:" + this.startDecideHu(paiList));
        huFlag = false;
        jiangFlag = false;
        paiList = [15, 16, 17, 19, 19, 19, 23, 23, 35, 36, 37];
        cc.log("testHU 2:" + this.startDecideHu(paiList));
        huFlag = false;
        jiangFlag = false;
        paiList = [11, 11, 17, 17, 17, 18, 19, 20, 35, 36, 37];
        cc.log("testHU 3:" + this.startDecideHu(paiList));
        huFlag = false;
        jiangFlag = false;
        paiList = [15, 16, 17, 17, 17, 18, 19, 20, 21, 36, 36];
        cc.log("testHU 4:" + this.startDecideHu(paiList));
    },
    //------------------------------------Untils----------------------------------------------------
    deepCopyArray: function deepCopyArray(soureArray, descArray) {
        if (soureArray != null && soureArray.length > 0) {
            for (var i = 0; i < soureArray.length + 1; i++) {
                if (soureArray[i] != null && soureArray[i] != undefined)
                    //soureArray[i] = soureArray[i] + ""
                    descArray.push(soureArray[i]);
            }
        }

        return descArray;
    },

    countElementAccount: function countElementAccount(pai, paiList) {
        var count = 0;
        for (var i = 0; i < paiList.length + 1; i++) {
            if (paiList[i] == pai) {
                count++;
            }
        }

        return count;
    },
    contains: function contains(array, obj) {
        var i = array.length;
        while (i--) {
            if (array[i] + "" === obj + "") {
                return true;
            }
        }
        return false;
    },
    //currentUser
    getCurrentPostinbyCurrentUser: function getCurrentPostinbyCurrentUser(currentUser) {},
    getCureentPostionFromUserPointAndPaiList: function getCureentPostionFromUserPointAndPaiList(paiArray, point, paiNode) {
        var startX = 0;
        var startY = 0;
        var latestX = 0;
        var latestY = 0;
        var startPoint = -520;
        var userNodeName = "user" + point + "PaiList";
        var userNodePaiList = cc.find(userNodeName, this.tableNode);
        var chilrenList = userNodePaiList.children;
        //getCorrectUserByOpenId

        if (point == "1") {
            paiNode.position = cc.p(0, -70);
        } else if (point == "2") {
            paiNode.position = cc.p(70, 0);
        } else if (point == "4") {
            //paiNode.position = cc.p(chilrenList[0].x, chilrenList[chilrenList.length-1].y );
            paiNode.position = cc.p(-70, 0);
            paiNode.setLocalZOrder(30);
            paiNode.zIndex = 30;
        } else if (point == "3") {
            paiNode.position = cc.p(0, 80);

            paiNode.width = 75;
            paiNode.height = 110;
        }
        cc.log("paiNode position:" + paiNode.position);
        return paiNode;
    }
});

cc._RFpop();
},{}],"InitalGameMain":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e0dbfCHWtZLuJIN+fRPPsM8', 'InitalGameMain');
// script/controllers/InitalGameMain.js

"use strict";

var userInfo;
var userInfoLayer;
var gameModeLayer;
var topInfoLayer;
var mainListButtonLayer;
var serverUrl;
var socket;
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
        audioMng: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;

        serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        socket = new SockJS(serverUrl + "/stomp");

        //play bgm
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.audioMng.playMusic();
        //hide the game mode 
        gameModeLayer = cc.find("Canvas/GameModeSelect");
        gameModeLayer.active = false;

        topInfoLayer = cc.find("Canvas/topInfoUserLayer");
        mainListButtonLayer = cc.find("Canvas/ListButton");
        //inital user info in the gameMain sence
        if (Global.userInfo == undefined || Global.userInfo == null) {
            console.log("Error: no found correct user ,please check server or network.");
        } else {
            userInfo = Global.userInfo;
            //intal the user info text 
            //userInfoLayer = cc.find("Canvas/topInfoLayer/userInfoLayout/userInfoTxtLayout");
            self.initalPrivateChanleForUser(userInfo.roomNumber);
        }

        //
    },
    showGameModeNode: function showGameModeNode() {
        gameModeLayer.active = true;
        topInfoLayer.active = false;
        mainListButtonLayer.active = false;
    },
    hideGameModeNode: function hideGameModeNode() {
        gameModeLayer.active = false;
        topInfoLayer.active = true;
        mainListButtonLayer.active = true;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    initalPrivateChanleForUser: function initalPrivateChanleForUser(roomNumber) {
        cc.log("roomNumber:" + roomNumber);
        var privateClient = Stomp.over(socket);

        privateClient.connect({}, function () {
            privateClient.subscribe("/queue/privateRoomChanle" + roomNumber, function (message) {
                var bodyStr = message.body;
                cc.log("get meesge from private chanle:privateRoomChanle" + roomNumber);
            });
        }, function () {
            cc.log("connect private chanle error !");
        });
    }

});

cc._RFpop();
},{}],"JoinRoomController":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9bcd3hPGGlK35uCEiuNEOJq', 'JoinRoomController');
// script/controllers/JoinRoomController.js

"use strict";

var roomNumberLableList = [];
var gameAction;
var tableNetWork;
var alertMessageUI;
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
        roomInputLableNode: cc.Node,
        keyBoardNode: cc.Node,
        loadingIconNode: cc.Node,
        gameoConfigScriptNode: cc.Node,
        tableNetworkNode: cc.Node,
        alertMessageNodeScirpt: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        gameAction = this.gameoConfigScriptNode.getComponent("gameConfigButtonListAction");
        tableNetWork = this.tableNetworkNode.getComponent("GameTableNetWork");
        alertMessageUI = this.alertMessageNodeScirpt.getComponent("alertMessagePanle");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    keyBoradClickEvent: function keyBoradClickEvent(event) {
        if (roomNumberLableList.length <= 5) {
            var node = event.target;
            var name = node.name;
            name = name.replace("Num", "");
            name = name.replace("Node", "");
            roomNumberLableList.push(name);
            this.intalTheNumberLableByList();
        }
        cc.log(roomNumberLableList.toString());
    },
    intalTheNumberLableByList: function intalTheNumberLableByList() {
        var node = this.roomInputLableNode;
        for (var i = 0; i < roomNumberLableList.length; i++) {
            var lableName = "input" + (i + 1) + "Node";
            var lableNode = cc.find(lableName, node);
            if (lableNode != null && lableNode !== undefined) {
                var lable = lableNode.getComponent(cc.Label);
                lable.string = roomNumberLableList[i];
            }
        }
    },
    deleteNumber: function deleteNumber() {
        roomNumberLableList.splice(-1, 1);
        cc.log(roomNumberLableList.toString());
        this.cleanLable();
        this.intalTheNumberLableByList();
    },
    getRoomNumber: function getRoomNumber() {
        var roomNumber = "";
        if (roomNumberLableList.length < 6) {
            alertMessageUI.text = "你必须输入6位数的房间号！";
            alertMessageUI.setTextOfPanel();
            return false;
        } else {

            for (var i = 0; i < roomNumberLableList.length; i++) {
                roomNumber = roomNumber + roomNumberLableList[i];
            }
        }
        return roomNumber;
    },

    cleanLable: function cleanLable() {
        var node = this.roomInputLableNode;
        for (var i = 0; i < 6; i++) {
            var lableName = "input" + (i + 1) + "Node";
            var lableNode = cc.find(lableName, node);
            if (lableNode != null && lableNode !== undefined) {
                var lable = lableNode.getComponent(cc.Label);
                lable.string = "";
            }
        }
    },
    joinRoomAction: function joinRoomAction() {
        var roomNumber = "";
        if (roomNumberLableList.length < 6) {
            alertMessageUI.text = "你必须输入6位数的房间号！";
            alertMessageUI.setTextOfPanel();
            return false;
        } else {

            for (var i = 0; i < roomNumberLableList.length; i++) {
                roomNumber = roomNumber + roomNumberLableList[i];
            }
            gameAction.showLoadingIcon();
            tableNetWork.joinRoom(roomNumber);
        }
        /*
        if (roomNumber == "") {
            alertMessageUI.text = "你必须输入6位数的房间号！";
            alertMessageUI.setTextOfPanel();
            return false
        }*/
    }

});

cc._RFpop();
},{}],"NewScript":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6f7a1uDT9VLZ7hZEteeEpiT', 'NewScript');
// script/service/NewScript.js

"use strict";

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
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RFpop();
},{}],"PersistRootNode":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2d5f7V4inZIbpEKEgWPGubS', 'PersistRootNode');
// script/service/PersistRootNode.js

"use strict";

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

        scriptNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        cc.game.addPersistRootNode(self.scriptNode);
    }

});

cc._RFpop();
},{}],"PlayBgm":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fc3efM4yNBMRJmwKAynE/fU', 'PlayBgm');
// script/audio/PlayBgm.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        audioMng: cc.Node,
        alertMessage: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.audioMng.playMusic();
    },

    playGame: function playGame() {
        cc.director.loadScene('table');
    },

    // called every frame
    update: function update(dt) {}
});

cc._RFpop();
},{}],"SwitchScene":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2f01dgus7tKwbntjWDlwS9h', 'SwitchScene');
// script/controllers/SwitchScene.js

'use strict';

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

        scene: {
            default: null,
            type: cc.Scene
        }

    },

    // use this for initialization
    onLoad: function onLoad() {},
    gotoGameCenter: function gotoGameCenter() {
        cc.director.loadScene('gameCenter');
    },
    gotoGameMain: function gotoGameMain() {
        cc.director.loadScene('gameMain2');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    gotoGameCenterScene: function gotoGameCenterScene() {}
});

cc._RFpop();
},{}],"actionMesageDomain":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b8016Av/9ZN54zYr0NRWMsw', 'actionMesageDomain');
// script/domainClass/actionMesageDomain.js

"use strict";

var actionMessageDomain = {
	messageAction: "",
	messageExecuteFlag: "",
	messageExecuteResult: "",
	useropenid: ""
};
module.exports = {
	actionMessageDomain: actionMessageDomain
};

cc._RFpop();
},{}],"alertMessagePanle":[function(require,module,exports){
"use strict";
cc._RFpush(module, '931179MAbNBzr/O4NfnmRjO', 'alertMessagePanle');
// script/ui/alertMessagePanle.js

"use strict";

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
        text: String,
        alertPanelNode: cc.Node,
        textNode: cc.Node,
        buttonNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.alertPanelNode.active = false;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    setTextOfPanel: function setTextOfPanel() {
        this.alertPanelNode.active = true;
        var r = this.textNode.getComponent(cc.RichText);
        r.string = this.text;
    },

    closePanel: function closePanel() {
        this.alertPanelNode.active = false;
    },

    closeButton: function closeButton() {
        this.buttonNode.active = false;
    },

    showButton: function showButton() {
        this.buttonNode.active = true;
    }
});

cc._RFpop();
},{}],"caCheScript":[function(require,module,exports){
"use strict";
cc._RFpush(module, '928c2g7oABC36efzPKVkOkg', 'caCheScript');
// script/lib/caCheScript.js

"use strict";

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
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

/**
 * 动态加载图片后释放
 * 
 * var spriteFrame = node.getComponent(cc.Sprite).spriteFrame;
var deps = cc.loader.getDependsRecursively(spriteFrame);
cc.loader.release(deps);
 * 
 */

/**
 * 
 * loadNative = function(url, callback){
    var dirpath =  jsb.fileUtils.getWritablePath() + 'img/';
    var filepath = dirpath + MD5(url) + '.png';

    function loadEnd(){
        cc.loader.load(filepath, function(err, tex){
            if( err ){
                cc.error(err);
            }else{
                var spriteFrame = new cc.SpriteFrame(tex);
                if( spriteFrame ){
                    spriteFrame.retain();
                    callback(spriteFrame);
                }
            }
        });

    }

    if( jsb.fileUtils.isFileExist(filepath) ){
        cc.log('Remote is find' + filepath);
        loadEnd();
        return;
    }

    var saveFile = function(data){
        if( typeof data !== 'undefined' ){
            if( !jsb.fileUtils.isDirectoryExist(dirpath) ){
                jsb.fileUtils.createDirectory(dirpath);
            }

            if( jsb.fileUtils.writeDataToFile(  new Uint8Array(data) , filepath) ){
                cc.log('Remote write file succeed.');
                loadEnd();
            }else{
                cc.log('Remote write file failed.');
            }
        }else{
            cc.log('Remote download file failed.');
        }
    };
    
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        cc.log("xhr.readyState  " +xhr.readyState);
        cc.log("xhr.status  " +xhr.status);
        if (xhr.readyState === 4 ) {
            if(xhr.status === 200){
                xhr.responseType = 'arraybuffer';
                saveFile(xhr.response);
            }else{
                saveFile(null);
            }
        }
    }.bind(this);
    xhr.open("GET", url, true);
    xhr.send();
};
 */

cc._RFpop();
},{}],"gameConfigButtonListAction":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1a841fq2F5L8q3KUAaQS+wi', 'gameConfigButtonListAction');
// script/controllers/gameConfigButtonListAction.js

"use strict";

var boyBtn = null;
var grilBtn = null;
var tableNetWork = null;
var showGameMode = null;
var gameConfigScript = null;
var tableUserInfo = null;
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

        indexNode: cc.Node,
        mainMenuNode: cc.Node,
        mainMenuGrailBtn: cc.Node,
        mainMenuBoyBtn: cc.Node,
        gameModeNode: cc.Node,
        joinRoomNumberUINode: cc.Node,
        gameConfigNode: cc.Node,
        alertMessageNode: cc.Node,

        gameTable: cc.Node,
        gameTableHead: cc.Node,
        gameTableModeBarNode: cc.Node,

        userNickNameNode: cc.Node,
        userCodeNode: cc.Node,
        userImageNode: cc.Node,

        tableNetWorkNode: cc.Node,

        loadingNode: cc.Node,
        loadIconNode: cc.Node,
        showGameModeScript: cc.Node,

        //table room
        closeRoomBtn: cc.Node,
        //mainMenu 
        backRoomBtn: cc.Node,
        newRoomBtn: cc.Node,

        gameConfigSettingScript: cc.Node,
        tableUserInfoScript: cc.Node

    },

    // use this for initialization
    onLoad: function onLoad() {

        grilBtn = this.mainMenuGrailBtn.getComponent(cc.Button);
        boyBtn = this.mainMenuBoyBtn.getComponent(cc.Button);
        tableNetWork = this.tableNetWorkNode.getComponent("GameTableNetWork");
        this.loadingNode.active = false;
        this.backRoomBtn.active = false;
        this.newRoomBtn.active = true;

        showGameMode = this.showGameModeScript.getComponent("showGameMode");
        gameConfigScript = this.gameConfigSettingScript.getComponent("gameConfigController");
        tableUserInfo = this.tableUserInfoScript.getComponent("tableUserInfo");
    },
    //----------Join room--------------------------------------------------------------------
    showJoinRoomNode: function showJoinRoomNode() {
        this.joinRoomNumberUINode.active = true;
        boyBtn.enabled = false;
        grilBtn.enabled = false;
    },
    closeJoenRoomNode: function closeJoenRoomNode() {
        this.joinRoomNumberUINode.active = false;
        boyBtn.enabled = true;
        grilBtn.enabled = true;
    },
    showUserNickNameAndCode: function showUserNickNameAndCode() {
        var userInfo = Global.userInfo;
        if (userInfo != null && userInfo != undefined) {
            var userNickname = this.userNickNameNode.getComponent(cc.Label);
            var userCode = this.userCodeNode.getComponent(cc.Label);

            userNickname.string = userInfo.nickName;
            userCode.string = userInfo.userCode;
        }
        var serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;

        var testHeaImageurl = serverUrl + "/webchatImage/" + userInfo.headImageFileName;
        cc.log("testHeaImageurl:" + testHeaImageurl);
        var userImage = this.userImageNode.getComponent(cc.Sprite);
        cc.loader.load(testHeaImageurl, function (err, texture) {
            var frame = new cc.SpriteFrame(texture);
            userImage.spriteFrame = frame;
        });
    },

    // action 1,build a  new room ,0, back to room
    enterMainEntry: function enterMainEntry(action) {
        tableNetWork.initalClient();
        this.indexNode.active = false;
        this.mainMenuNode.active = true;
        grilBtn.enabled = true;
        boyBtn.enabled = true;
        if (action == "1") {
            this.backRoomBtn.active = false;
            this.newRoomBtn.active = true;
        } else {
            this.backRoomBtn.active = true;
            this.newRoomBtn.active = false;
        }
    },
    showGameConfig: function showGameConfig() {
        this.gameConfigNode.active = true;
        gameConfigScript.initalGameConfig();
        boyBtn.enabled = false;
        grilBtn.enabled = false;
    },
    closeGameConfig: function closeGameConfig() {
        if (Global.gameConfigSetting != null && Global.gameConfigSetting != undefined && Global.gameConfigSetting != "") {
            cc.sys.localStorage.setItem('gameConfig', JSON.stringify(Global.gameConfigSetting));
        }

        this.gameConfigNode.active = false;
        boyBtn.enabled = true;
        grilBtn.enabled = true;

        cc.log("closeGameConfig:" + Global.gameConfigSetting);
    },
    showGameModePanel: function showGameModePanel() {
        if (this.backRoomBtn.active == true) {
            this.backTableAction();
        } else {
            this.gameModeNode.active = true;
            boyBtn.enabled = false;
            grilBtn.enabled = false;
        }
    },
    closeGameModePanel: function closeGameModePanel() {
        this.gameModeNode.active = false;
        boyBtn.enabled = true;
        grilBtn.enabled = true;
    },

    existGame: function existGame() {
        cc.game.end();
    },

    //read the game user from Gobal user list and inital the user 
    showGameTalbeRound: function showGameTalbeRound() {
        this.gameTable.active = true;
        this.joinRoomNumberUINode.active = false;
        this.gameModeNode.active = false;
        this.indexNode.active = false;
        this.mainMenuNode.active = false;

        this.gameTableHead.active = false;
        this.gameTableModeBarNode.active = true;
        this.closeRoomBtn.active = false;
        showGameMode.showGameMode();
    },

    showGameTalbe: function showGameTalbe(roomOwner) {
        this.gameTable.active = true;
        this.joinRoomNumberUINode.active = false;
        this.gameModeNode.active = false;
        this.indexNode.active = false;
        this.mainMenuNode.active = false;

        this.gameTableHead.active = false;
        this.gameTableModeBarNode.active = true;

        if (roomOwner == "1") {
            this.closeRoomBtn.active = true;
        } else {
            this.closeRoomBtn.active = false;
        }

        showGameMode.showGameMode();
        //now we need instal the user info for each user
        tableUserInfo.initalUserInfoFromGobalList();
    },
    closeGameTable: function closeGameTable() {
        this.gameTable.active = false;
        //this.mainMenuNode.active = true;
        tableNetWork.closeGameRoundLun();
        Global.joinRoomNumber = "";
        this.enterMainEntry("1");
    },

    endGameRoundLun: function endGameRoundLun() {
        this.gameTable.active = false;
        //this.mainMenuNode.active = true;
        //tableNetWork.closeGameRoundLun();
        Global.joinRoomNumber = "";
        this.enterMainEntry("1");
    },

    showLoadingIcon: function showLoadingIcon() {
        this.loadingNode.active = true;
        var seq = cc.repeatForever(cc.rotateBy(3, 360));
        this.loadIconNode.runAction(seq);
        cc.log("showLoadingIcon");
    },
    closeLoadingIcon: function closeLoadingIcon() {
        this.loadIconNode.stopAllActions();
        this.loadingNode.active = false;
    },

    backRoomAction: function backRoomAction() {
        this.gameTable.active = false;
        this.enterMainEntry("0");
    },

    backTableAction: function backTableAction() {
        var userInfo = Global.userInfo;
        var roomNumber = userInfo.roomNumber;
        if (Global.joinRoomNumber == roomNumber) {
            this.showGameTalbe("1");
        } else {
            this.showGameTalbe("0");
        }
    }

});

cc._RFpop();
},{}],"gameConfigController":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bbbf26brTpIEIxUOXXB/RWL', 'gameConfigController');
// script/controllers/gameConfigController.js

"use strict";

var gameConfigSetting;
var alertMessageUI;
var musicScript;
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
        musicToggle: cc.Node,
        musicEffectToggle: cc.Node,
        publicIpLimitToggele: cc.Node,
        gpsLimitNode: cc.Node,
        alertMessageNode: cc.Node,
        musicNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        alertMessageUI = this.alertMessageNode.getComponent("alertMessagePanle");
        //this.initalGameConfig();
        musicScript = this.musicNode.getComponent("AudioMng");
    },

    togglerClick: function togglerClick(event) {
        gameConfigSetting = Global.gameConfigSetting;
        if (gameConfigSetting == null || gameConfigSetting == undefined) {
            gameConfigSetting = require("gameConfigSetting").gameConfigSetting;
        }
        var node = event.target;
        var parent = node.parent;
        var toggle = parent.getComponent(cc.Toggle);
        //musicEffectToggle,musicToggle,publicIpToggle
        if (parent.name == "musicEffectToggle") {
            if (toggle.isChecked) {
                gameConfigSetting.musicEffect = "1";
            } else {
                gameConfigSetting.musicEffect = "0";
            }
        }

        if (parent.name == "musicToggle") {
            if (toggle.isChecked) {
                gameConfigSetting.music = "1";
                musicScript.playMusic();
            } else {
                gameConfigSetting.music = "0";
                musicScript.stopMusic();
            }
        }

        if (parent.name == "publicIpToggle") {
            if (toggle.isChecked) {
                gameConfigSetting.publicIpLimit = "1";
            } else {
                gameConfigSetting.publicIpLimit = "0";
            }
        }

        cc.log(JSON.stringify(Global.gameConfigSetting));
    },

    editBoxChange: function editBoxChange() {

        gameConfigSetting = Global.gameConfigSetting;
        //var node = event.target;
        //cc.log("editBoxChange name:" + node.name);
        var edit = this.gpsLimitNode.getComponent(cc.EditBox);
        if (edit.string.length > 0) {
            if (isNaN(edit.string)) {
                alertMessageUI.text = "你必须在GPS距离限制中输入数字，请检查后重新输入！";
                alertMessageUI.setTextOfPanel();
            } else {
                gameConfigSetting.gpsLimit = edit.string;
            }
        }

        Global.gameConfigSetting = gameConfigSetting;
    },

    initalGameConfig: function initalGameConfig() {
        //cc.sys.localStorage.setItem('gameConfig', null);
        var o = cc.sys.localStorage.getItem("gameConfig");
        //cc.log("initalGameConfig o:" + (o) + ":");
        if (o != null && o != undefined && o != "" && o != "\"\"") {
            Global.gameConfigSetting = JSON.parse(o);
        }
        // JSON.parse(bodyStr)

        gameConfigSetting = Global.gameConfigSetting;
        if (gameConfigSetting == null || gameConfigSetting == undefined || gameConfigSetting == "") {
            gameConfigSetting = require("gameConfigSetting").gameConfigSetting;
        }

        cc.log("initalGameConfig:" + gameConfigSetting + ":");
        var musictoggle = this.musicToggle.getComponent(cc.Toggle);
        var musciEffectToggle = this.musicEffectToggle.getComponent(cc.Toggle);
        var publicIpToggle = this.publicIpLimitToggele.getComponent(cc.Toggle);
        if (gameConfigSetting.music == "1") {
            musictoggle.isChecked = true;
        } else {
            musictoggle.isChecked = false;
        }

        if (gameConfigSetting.musicEffect == "1") {
            musciEffectToggle.isChecked = true;
        } else {
            musciEffectToggle.isChecked = false;
        }

        if (gameConfigSetting.publicIpLimit == "1") {
            publicIpToggle.isChecked = true;
        } else {
            publicIpToggle.isChecked = false;
        }
        var edit = this.gpsLimitNode.getComponent(cc.EditBox);
        if (gameConfigSetting.gpsLimit != undefined && gameConfigSetting.gpsLimit != null) {
            if (gameConfigSetting.gpsLimit != "0" && gameConfigSetting.gpsLimit.length > 0) {
                edit.string = gameConfigSetting.gpsLimit;
            }
        }
        Global.gameConfigSetting = gameConfigSetting;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{"gameConfigSetting":"gameConfigSetting"}],"gameConfigSetting":[function(require,module,exports){
"use strict";
cc._RFpush(module, '89dfbS5ihZHIZmZ0IY625wG', 'gameConfigSetting');
// script/domainClass/gameConfigSetting.js

"use strict";

var gameConfigSetting = {
	music: "1",
	musicEffect: "1",
	publicIpLimit: "0",
	gpsLimit: "0"
};
module.exports = {
	gameConfigSetting: gameConfigSetting
};

cc._RFpop();
},{}],"gameConfig":[function(require,module,exports){
"use strict";
cc._RFpush(module, '04c3c9hL21BfpcYmeJK6KmP', 'gameConfig');
// script/ui/gameConfig.js

"use strict";

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
        alertMessage: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {},

    helpButn: function helpButn() {
        this.alertMessage = this.alertMessage.getComponent("alertMessagePanle");
        this.alertMessage.text = "  GPS距离限制指的是你可以设置一个数字，这个数字代表了玩家之间的GPS距离，如果该距离小于你设定的值，那么将拒绝玩家加入你创建的房间。<br/>";
        this.alertMessage.text = this.alertMessage.text + "  每个新玩家加入此房间将根据GPS自动测算与房间中已有玩家之间的实际距离，如果距离小于你设置的值，将拒绝该玩家加入！";
        this.alertMessage.setTextOfPanel();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"gameMode":[function(require,module,exports){
"use strict";
cc._RFpush(module, '93e5dsxrulPuY66y0C8yi17', 'gameMode');
// script/domainClass/gameMode.js

"use strict";

var gameMode = {
  ziMoJiaDi: 1,
  ziMoJiaFan: 0,
  ziMoHu: 1,
  dianPaoHu: 0,
  huanSanZhang: 1,
  dianGangHua_dianPao: 1,
  dianGangHua_ziMo: 0,
  dai19JiangDui: 1,
  mengQingZhongZhang: 0,
  tianDiHu: 0,
  fan2: 0,
  fan3: 0,
  fan4: 1,
  fan6: 0,
  roundCount4: 1,
  roundCount8: 0,
  gamePeopleNumber: 0,
  publicIpLimit: 0,
  gpsLimit: 0
};
module.exports = {
  gameMode: gameMode
};

cc._RFpop();
},{}],"gameStep":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5e1156K9w1DRJRcTEQQXtx0', 'gameStep');
// script/domainClass/gameStep.js

"use strict";

var gameStep = { id: 0,
  fromUserOpenid: "",
  actionName: "",
  paiNumber: "",
  toUserOpenid: "",
  joinRoomNumber: ""

};
module.exports = {
  gameStep: gameStep
};

cc._RFpop();
},{}],"gameUser":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e951drcp2lI/qFmJzkvDAoS', 'gameUser');
// script/domainClass/gameUser.js

"use strict";

var gameUser = { id: 0,
  nickName: "",
  headimgurl: "",
  country: "",
  diamondsNumber: 0,
  openid: "",
  unionid: "",
  userCode: "",
  //userGameingStatu:"",
  publicIp: "",
  paiList: "",
  gameReadyStatu: "",
  gameRoundScore: "",
  gameScoreCount: "",
  pointIndex: "",
  headImageFileName: "",
  zhuang: "",
  //follow propertity only work on client
  paiListArray: [],
  huanSanZhangPaiList: [],
  pengPaiList: [],
  gangExistUser: [],
  gangExistUserCache: [],
  gangFromUserListOpenId: [],
  gangPaiList: [],
  gangTypeList: [],
  pengGangPaiPoint: 0,
  quePai: "",
  chupaiListX: 0,
  chupaiListY: 0,
  chuPaiCount: 0,
  chuPaiPointX: 0,
  userMoPai: "",
  //hupai  
  huPai: "",
  //ziMo,normalHu,gangShangHua,gangShangPao ,haiDi,tianHu,diHu
  huPaiType: "",
  //round socre count 
  huPaiDetails: "",
  roundScoreCount: "",

  existUserString: "",
  huGangPai: "",
  huPaiFromUser: "",
  huChuPaiType: "",
  huPaiFanShu: 0,
  huGangShangHuaChuPaiUserOpenId: "",
  huGangPaiInOtherUserFromOpenId: "",

  tingJiao: "",
  maxFanShu: 0,

  longitude: 0.0,
  latitude: 0.0

};
module.exports = {
  gameUser: gameUser
};

cc._RFpop();
},{}],"huanPaiUI":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5f8b3i4e8lGlYu1dUS5hhW2', 'huanPaiUI');
// script/ui/huanPaiUI.js

"use strict";

var timerUpate;
var timeCount;
var tableUserInfo;
var alerMessage;
var gameTableNetWork;
var sendFlag = false;
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
        huanPaiNode: cc.Node,
        huanPaiTimeLable: cc.Node,
        tableUserInfoNode: cc.Node,
        alertMessageNode: cc.Node,
        gameTableNetWorkNode: cc.Node,
        waitPanleNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {

        tableUserInfo = this.tableUserInfoNode.getComponent("tableUserInfo");
        alerMessage = this.alertMessageNode.getComponent("alertMessagePanle");
        gameTableNetWork = this.gameTableNetWorkNode.getComponent("GameTableNetWork");

        timeCount = 14;
        timerUpate = function timerUpate() {

            var showTimerStr = "(" + timeCount + ")";
            var lable = this.huanPaiTimeLable.getComponent(cc.Label);
            lable.string = showTimerStr;
            timeCount--;

            if (timeCount == -1) {
                this.endTimer();
            }
        };
    },

    showHuanPaiNode: function showHuanPaiNode() {
        this.huanPaiNode.active = true;
        this.stratTimer();
        tableUserInfo.disabledHuanSanZhangPai();
        Global.chuPaiActionType = "huanSanZhang";
    },

    stratTimer: function stratTimer() {
        //timeCount = 10;
        var self = this;
        self.schedule(timerUpate, 1);
        //
    },
    endTimer: function endTimer() {
        Global.chuPaiActionType = "";
        var self = this;
        self.unschedule(timerUpate);
        // Global.chuPaiActionType = ""
        //auto select latest pai
        if (sendFlag == false) {
            tableUserInfo.forceFillHuanSanZhangList();
            this.sendHuanSanZhang();
        }
    },

    sendHuanSanZhang: function sendHuanSanZhang() {
        sendFlag = false;
        if (Global.huanSanZhangPaiList.length < 3) {
            alerMessage.text = "你必须选择三张牌！";
            alerMessage.setTextOfPanel();
            alerMessage.alertPanelNode.active = true;
        } else {
            //Global.chuPaiActionType = ""
            this.waitPanleNode.active = true;
            gameTableNetWork.sendHuanSanZhang();
            tableUserInfo.disableAllPai();
            this.unschedule(timerUpate);
            sendFlag = true;
        }
    },

    closeWaitPanle: function closeWaitPanle() {
        this.waitPanleNode.active = false;
    },
    closeHuanSanZhang: function closeHuanSanZhang() {
        this.huanPaiNode.active = false;
    }
});

cc._RFpop();
},{}],"iniGameTable":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ea520g3DaVCNIEueX4OHm2n', 'iniGameTable');
// script/service/iniGameTable.js

"use strict";

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
        audioMng: cc.Node,
        tableNode: cc.Node,
        gameModeNode: cc.Node,
        gameMainMenu: cc.Node,
        userNickNameLableNode: cc.Node,
        userCodeLable: cc.Node,
        userDemondNumberLable: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {

        var self = this;

        //serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        //socket = new SockJS(serverUrl + "/stomp");

        var messageUser = require("messageDomain").messageDomain;
        //var messageUser;
        //-----------music :play bgm-------------------------------------------------------------------------------
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.audioMng.playMusic();
        //hide the game mode 
        self.gameModeNode.active = false;
        self.tableNode.active = false;
        self.gameMainMenu.active = true;
        self.gameMainMenu.opacity = 255;
        //----------------------------------------------------------------------------------------------------------

        //inital user info in the gameMain sence
        if (Global.userInfo == undefined || Global.userInfo == null) {
            console.log("Error: no found correct user ,please check server or network.");
        } else {
            var userInfo = Global.userInfo;

            //intal user Text
            self.intalUserInfoOnGameMainLayer();
            //self.initalUserInfoLayer(userInfo);
            //inital the user message
            messageUser.messageBelongsToPrivateChanleNumber = userInfo.roomNumber;
            //messageAction
            messageUser.messageAction = "sendToOther";
            messageUser.messageType = "user";
            messageUser.messageBody = JSON.stringify(userInfo);
            //self.sendWebSokectMessageToServer(messageUser)

        };

        // cc.game.onStop = function () {
        //     cc.log("stopApp");
        // }
    },

    //----------------------------------Create room button event---------------------------------------------------------


    joinRoom_initalUserInfo: function joinRoom_initalUserInfo() {
        this.initalUserInfoLayer();
    },

    //----------------------------------inital user info layer-----------------------------------------------------------
    intalUserInfoOnGameMainLayer: function intalUserInfoOnGameMainLayer() {
        // var topUserLayer = this.gameMainMenu.getChildByName("topInfoUserLayer");
        // var topUserInfoLayer = topUserLayer.getChildByName("userInfoLayer");
        // var topUserLayout = topUserInfoLayer.getChildByName("userInfoLayout");
        // var topUserLayout2 = topUserLayout.getChildByName("userInfoTextLayout");

        // var userNameLableNode = topUserLayout2.getChildByName("userNickNameLable");
        // var userCodeLableNode = topUserLayout2.getChildByName("userCodeLable");
        // var userDemondLableNode = topUserLayout2.getChildByName("userDemondNumber");

        var userNameLable = this.userNickNameLableNode.getComponent(cc.Label);
        var userCodeLable = this.userCodeLable.getComponent(cc.Label);
        var userDemondLable = this.userDemondNumberLable.getComponent(cc.Label);

        userNameLable.string = Global.userInfo.nickName;
        userDemondLable.string = Global.userInfo.diamondsNumber;
        userCodeLable.string = Global.userInfo.userCode;
    },

    //----------------------------------web sokec connect and subscribe and handle resive message------------------------


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    //------------------------------- when tha table sence end ,it will need remove online user and close websokect---------


    //open user ip login url

    //--------------------------------update user ip---------------------------
    updateUserIP: function updateUserIP(id) {
        var xhr = new XMLHttpRequest();
        var url = serverUrl + "/user/getLoginUserIP?userId=" + id;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                Global.userInfo.publicIPAddress = response;
                cc.director.loadScene('table');
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }
});

cc._RFpop();
},{"messageDomain":"messageDomain"}],"iniIndex":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f811fBatU1FtajDrq8CeSU5', 'iniIndex');
// script/service/iniIndex.js

'use strict';

var client;
var privateClient;
var userInfo;
var serverUrl;
var socket;
var gameActionListGet;
var onlineCheckUser;
var messageScript;
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
        gameActionList: cc.Node,
        checkOnlineUser: cc.Node,
        messageNode: cc.Node

    },

    // use this for initialization
    onLoad: function onLoad() {
        //------------
        if (cc.sys.os == cc.sys.OS_IOS) {
            console.log("ios platam:");
            jsb.reflection.callStaticMethod('LocationFunc', 'initalLocation');
        }

        //-----------------------
        cc.game.on(cc.game.EVENT_HIDE, function () {
            // cc.audioEngine.pauseMusic();
            // cc.audioEngine.pauseAllEffects();
            // cc.eventManager.removeCustomListeners(cc.game.EVENT_HIDE);
            cc.game.pause();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            // cc.audioEngine.pauseMusic();
            // cc.audioEngine.pauseAllEffects();


            cc.game.resume();
        });
        messageScript = this.messageNode.getComponent("alertMessagePanle");
        //window.iniIndex = require("iniIndex");
        //webchat head img test-------------------------------
        /*
        var url = "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log("xhr readyState:" + xhr.readyState);
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                 console.log("xhr:" + response);
                console.log("xhr responseType:" + xhr.responseType);
             }
        };
        xhr.open("GET", url, true);
        xhr.send();*/
        //----------------------------------------------------
        gameActionListGet = this.gameActionList.getComponent("gameConfigButtonListAction");
        onlineCheckUser = this.checkOnlineUser.getComponent("onlineUserCheck");
        userInfo = require("userInfoDomain").userInfoDomain;
        serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        socket = new SockJS(serverUrl + "/stomp");
        console.log("conect to server");
        client = Stomp.over(socket);
        // var csrfHeaderName = "Set-Cookie";
        // var csrfToken = "session=B227654DB13B28329F96DB2959FAE26B";
        var headers = {};
        // headers["user-agent"] = "test";
        client.connect(headers, function () {
            client.subscribe("/queue/pusmicGamePushLoginUserInfoChanle", function (message) {
                var bodyStr = message.body;
                cc.log("######################");
                cc.log(bodyStr);
                if (bodyStr.length == 0) {
                    this.reforceLogin();
                } else {

                    var obj = JSON.parse(bodyStr);
                    if (obj != undefined && obj != null) {
                        for (var p in obj) {
                            userInfo[p] = obj[p];
                        }

                        //************we must check user in here*******************************
                        //NEED TO DO ********************

                        if (Global.userInfo == null || Global.userInfo == undefined) {

                            console.log("userInfo.nickname:" + userInfo.nickName);
                            console.log("userInfo.headImageFileName:" + userInfo.headImageFileName);
                            cc.sys.localStorage.setItem('userOpenId', userInfo.openid);
                            Global.userInfo = userInfo;
                            //update the user public ip from url call
                            //self.updateUserIP(userInfo.id);
                            //
                            //self.initalPrivateChanleForUser(userInfo.roomNumber);

                            //user login success ,go to game main sence
                            //cc.director.loadScene('table');

                            //
                            var userCode = cc.sys.localStorage.getItem('webChatCode');
                            console.log("user code equ:" + userCode);
                            console.log("obj user code equ:" + obj.webChatUserCode);
                            if (userCode == obj.webChatUserCode) {
                                client.disconnect();
                                client = null;
                                gameActionListGet.enterMainEntry("1");
                                gameActionListGet.showUserNickNameAndCode();
                                gameActionListGet.closeLoadingIcon();

                                //get location 

                                if (cc.sys.os == cc.sys.OS_IOS) {
                                    console.log("ios platam:");
                                    jsb.reflection.callStaticMethod('LocationFunc', 'getCurrentLocation');
                                }
                            }
                        }
                    } else {

                        console.log("No found correct user info return from server ,please check .");
                    }
                }

                //self.testLabel.string = message.body;
                //$("#helloDiv").append(message.body);

                //cc.director.loadScene('gameMain2');
            }.bind(this), function () {
                cc.log("websocket connect subscribe Error:233");
                //client.disconnect();
            });
        }.bind(this), function () {
            cc.log("websocket connect  Error:234");
            //client.disconnect();
        });

        //onlineCheckUser.client = client;
        onlineCheckUser.checkonlineUser(client);

        cc.game.onStop = function () {
            cc.log("stopApp$$$$$$$$$$$$$$$$$");
            // client.disconnect();
        };

        //----------------------------

        var nowTime = new Date("2017", "4", "12");
        //nowTime=this.dateFormat(nowTime);
        var oldTiem = new Date("2017", "3", "12");
        var cha = (nowTime - oldTiem) / 3600 / 1000 / 24;
        cc.log("nowTime:" + cha);
    },

    dateFormat: function dateFormat(date) {
        var year = date.getFullYear();
        var Month = date.getMonth() + 1;
        var Day = date.getDate();
        return year + "-" + Month + "-" + Day;
    },

    compareDayWithNow: function compareDayWithNow(oldTime) {
        var now = new Date();
        var year = now.getFullYear();
        var Month = now.getMonth() + 1;
        var Day = now.getDate();

        var nowTime = new Date(year, Month, Day);

        var cache = oldTime.split("-");
        var oldTime = new Date(cache[0], cache[1], cache[2]);
        var cha = (nowTime - oldTime) / 3600 / 1000 / 24;
        return cha;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onDestroy: function onDestroy() {
        //colse the websokect
        client.disconnect();
        cc.log("onDestroy");
    },
    //----------------------inital private chanle----------------------------------
    // initalPrivateChanleForUser: function (roomNumber) {
    //     cc.log("roomNumber:"+roomNumber);
    //     privateClient = Stomp.over(socket);

    //         privateClient.connect({}, function () {
    //             privateClient.subscribe("/queue/privateRoomChanle" + roomNumber, function (message) {
    //                 var bodyStr = message.body;
    //                 cc.log("get meesge from private chanle:privateRoomChanle"+roomNumber);
    //             });
    //         },function(){
    //              cc.log("connect private chanle error !");
    //         });

    // privateClientChanle
    // },
    //----------------------game stop-----------------------------------------------
    gameStop: function gameStop() {},
    testSaveToken: function testSaveToken() {
        this.sendUserAuthTokenAndRefreshTokenToServer("testAuth", "refreshToken", "test5");
    },
    buildSendMessage: function buildSendMessage(messageBody, roomNum, action) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNum;
        messageDomain.messageAction = action;
        messageDomain.messageBody = messageBody;

        return messageDomain;
    },
    sendUserAuthTokenAndRefreshTokenToServer: function sendUserAuthTokenAndRefreshTokenToServer(authToken, refreshToken, openid) {
        var o = new Object();
        o.authToken = authToken;
        o.refreshToken = refreshToken;
        o.openid = openid;
        var messageObj = this.buildSendMessage(JSON.stringify(o), "", "saveAuthToken");

        client.send("/app/usercode_resive_message", {}, JSON.stringify(messageObj));
    },
    sendUserCodetest: function sendUserCodetest() {
        var messageObj = this.buildSendMessage("2233", "", "refreshToken");
        client.send("/app/usercode_resive_message", {}, JSON.stringify(messageObj));
    },

    reinstalClient: function reinstalClient() {
        var serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        socket = new SockJS(serverUrl + "/stomp");
        console.log("conect to server");
        client = Stomp.over(socket);
        var headers = {};
        client.connect(headers, function () {});
        //return client
    },

    reforceLogin: function reforceLogin() {
        var nowTime = new Date();
        cc.log("nowTime 218:" + nowTime);
        var isinstall = false;
        if (cc.sys.os == cc.sys.OS_IOS) {
            isinstall = jsb.reflection.callStaticMethod('WXApiManager', 'isWXInstalled');
        }

        if (isinstall) {
            //check openid if in the client
            var authLoginTime = cc.sys.localStorage.getItem("authLoginTime");
            var reLoginFlag = false;

            cc.log("reLoginFlag:" + reLoginFlag);

            //open webchat to auth user
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('WXApiManager', 'sendAuthRequestWX');
            }
        } else {
            specialModule._loginfun = null;
            messageScript.text = "未安装微信!";
            messageScript.setTextOfPanel();
            cc.log('未安装微信!');
        }
    },

    sendUserCode: function sendUserCode() {
        //client.send("/app/usercode_resive_message", {}, JSON.stringify("test"));
        //gameActionListGet.showLoadingIcon();
        //client.send("/app/usercode_resive_message", {}, "test");


        //  cc.sys.localStorage.setItem('gameConfig', JSON.stringify(Global.gameConfigSetting));

        var nowTime = new Date();
        cc.log("nowTime 218:" + nowTime);
        var isinstall = false;
        if (cc.sys.os == cc.sys.OS_IOS) {
            isinstall = jsb.reflection.callStaticMethod('WXApiManager', 'isWXInstalled');
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isWXInstalled");
        }
        cc.log("isinstall:" + isinstall);
        if (isinstall) {
            //check openid if in the client
            var authLoginTime = cc.sys.localStorage.getItem("authLoginTime");
            var reLoginFlag = false;
            if (authLoginTime == null || authLoginTime == undefined || authLoginTime == "") {
                reLoginFlag = true;
            } else {
                var cha = this.compareDayWithNow(authLoginTime);
                if (cha >= 29) {
                    reLoginFlag = true;
                }
            }
            cc.log("reLoginFlag:" + reLoginFlag);

            if (reLoginFlag) {
                //open webchat to auth user
                if (cc.sys.os == cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod('WXApiManager', 'sendAuthRequestWX');
                }
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sendReq");
                }
            } else {
                //refresh auth token again.
                var openid = cc.sys.localStorage.getItem('userOpenId');
                var messageObj = this.buildSendMessage(openid, "", "refreshToken");
                if (client == null || client == undefined) {
                    this.reinstalClient();
                }
                client.send("/app/usercode_resive_message", {}, JSON.stringify(messageObj));
            }
        } else {
            specialModule._loginfun = null;
            messageScript.text = "未安装微信!";
            messageScript.setTextOfPanel();
            cc.log('未安装微信!');
        }
    },
    refreshToken: function refreshToken(refresh_token) {
        var appid = "";
        var appSecrect = "";
        var xhr = new XMLHttpRequest();
        //https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN

        var url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=" + appid + "&grant_type=refresh_token&refresh_token=" + refresh_token;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                if (response.length > 0) {
                    if (response.indexOf("errcode") >= 0) {
                        messageScript.text = response;
                        messageScript.setTextOfPanel();
                    } else {
                        var userObj = JSON.parse(response);
                        var access_token = userObj.access_token;
                        var openid = userObj.openid;
                        var refresh_token_new = userObj.refresh_token;
                        if (refresh_token_new != refresh_token) {
                            cc.sys.localStorage.setItem('refresh_token', refresh_token_new);
                            this.sendUserAuthTokenAndRefreshTokenToServer(access_token, refresh_token, openid);
                        }
                        //store the token into server
                    }
                }
            }
        }.bind(this);
        xhr.open("GET", url, true);
        xhr.send();
    },
    //refresh token
    //https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
    //get token by code from native call
    getRequstTokenByCode: function getRequstTokenByCode(code) {
        cc.log("getRequstTokenByCode:" + code);
        //cc.log("errorCode:" + errorCode);
        var appid = "";
        var appSecrect = "";
        var grant_type = "authorization_code";
        var nowDate = new Date();
        nowDate = this.dateFormat(nowDate);
        console.log("getRequstTokenByCode:" + code);
        console.log("getRequstTokenByCode nowDate:" + nowDate);
        //if (errorCode + "" == "0") {
        cc.sys.localStorage.setItem('authLoginTime', nowDate);
        cc.sys.localStorage.setItem('webChatCode', code);
        var messageObj = this.buildSendMessage(code, "", "getTokenByCode");
        if (client == null || client == undefined) {
            this.reinstalClient();
        }
        client.send("/app/usercode_resive_message", {}, JSON.stringify(messageObj));
    },

    getRequstTokenByCodeOnError: function getRequstTokenByCodeOnError() {
        messageScript.text = "你必须要同意微信授权才能登陆游戏!";
        messageScript.setTextOfPanel();
    },

    getUserInfoAndStoreIntoServer: function getUserInfoAndStoreIntoServer(access_token, openid) {

        var xhr = new XMLHttpRequest();
        var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                if (response.length > 0) {
                    if (response.indexOf("errcode") >= 0) {
                        messageScript.text = response;
                        messageScript.setTextOfPanel();
                    } else {
                        var userObj = JSON.parse(response);
                        cc.sys.localStorage.setItem('authUserObject', JSON.stringify(userObj));
                        //userObj.action = "saveUserInfo";
                        //store the token into server
                        var messageObj = this.buildSendMessage(JSON.stringify(o), "", "saveUserInfo");
                        client.send("/app/usercode_resive_message", {}, JSON.stringify(messageObj));
                        // client.send("/app/usercode_resive_message", {}, JSON.stringify(userObj));
                    }
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }

});

cc._RFpop();
},{"messageDomain":"messageDomain","userInfoDomain":"userInfoDomain"}],"loginScript":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5a3421ZWfdBzorgy/ErrBn5', 'loginScript');
// script/controllers/loginScript.js

"use strict";

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
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RFpop();
},{}],"messageDomain":[function(require,module,exports){
"use strict";
cc._RFpush(module, '08d47EMIsNDzLeRPw7M5PK1', 'messageDomain');
// script/domainClass/messageDomain.js

"use strict";

var messageDomain = {
	messageBelongsToPrivateChanleNumber: 0,
	//sendToOther,sendToServer,sendToSingleUser
	messageAction: "",
	messageType: "",
	messageBody: ""
};
module.exports = {
	messageDomain: messageDomain
};

cc._RFpop();
},{}],"messageUI":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bb0603PcqVPBpysm+e6uli9', 'messageUI');
// script/ui/messageUI.js

"use strict";

var tableNetWorkScript;

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

        messageNode: cc.Node,
        biaoQingAndChangYongNode: cc.Node,
        biaoQingNode: cc.Node,
        changyongYuNode: cc.Node,
        inputEditNode: cc.Node,
        messageRichTextBodyNode: cc.Node,
        messageScrollView: cc.Node,
        tableNetWorkNode: cc.Node

    },

    // use this for initialization
    onLoad: function onLoad() {
        tableNetWorkScript = this.tableNetWorkNode.getComponent("GameTableNetWork");
        //var rit = this.messageRichTextBodyNode.getComponent(cc.RichText);

        // rit.string = rit.string + "sdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\n" + "\n"
    },

    openMessage: function openMessage() {
        if (this.messageNode.active == false) {
            this.messageNode.active = true;
            this.messageNode.zIndex = 1000;
        } else {
            this.messageNode.active = false;
        }
    },

    openBiaoQingAll: function openBiaoQingAll() {
        this.biaoQingAndChangYongNode.active = true;
        this.biaoQingNode.active = true;
        this.changyongYuNode.active = false;
    },
    closeBiaoQingAll: function closeBiaoQingAll() {
        this.biaoQingAndChangYongNode.active = false;
        cc.log("closeBiaoQingAll");
    },

    openBiaoQing: function openBiaoQing() {
        this.changyongYuNode.active = false;
        this.biaoQingNode.active = true;
    },

    openChangYongYu: function openChangYongYu() {
        this.biaoQingNode.active = false;
        this.changyongYuNode.active = true;
    },

    selectedBiaoqing: function selectedBiaoqing(event) {

        var node = event.target;
        //var sprite=node.getComponent(cc.Sprite);
        var nodeName = node.name;
        var picName = nodeName.replace("baoqingSprite", "");
        picName = "emo" + picName;

        var myEditBox = this.inputEditNode.getComponent(cc.EditBox);
        myEditBox.string = myEditBox.string + "#" + picName + "#";
        this.closeBiaoQingAll();
    },
    selectedChangYongYu: function selectedChangYongYu(event) {

        var node = event.target;
        var lableNode = cc.find("changyongyuLabel", node);
        var lable = lableNode.getComponent(cc.Label);
        var myEditBox = this.inputEditNode.getComponent(cc.EditBox);
        myEditBox.string = myEditBox.string + lable.string;
        this.closeBiaoQingAll();
    },
    sendMessage: function sendMessage() {
        var userInfo = Global.userInfo;

        var myEditBox = this.inputEditNode.getComponent(cc.EditBox);
        var message = myEditBox.string;
        cc.log("message:" + message);
        if (message.indexOf("#emo") >= 0) {
            var temp = message.split("#");
            var picName = [];
            for (var i = 0; i < temp.length; i++) {
                var m = temp[i];
                if (m.indexOf("emo") >= 0) {
                    picName.push(m);
                }
            }
            if (picName.length > 0) {
                for (var i = 0; i < picName.length; i++) {
                    var imgName = picName[i].replace("emo", "biaoqing");
                    message = message.replace("#" + picName[i] + "#", "<img src='" + imgName + "'/>");
                }
            }
        }

        message = userInfo.nickName + ":" + message;

        //tableNetWorkScript.sendMessageToUser(message);
        this.showMessage(message);
        // if (this.messageRichTextBodyNode.height > 360) {
        //     var t = (this.messageRichTextBodyNode.height - 360) / 40;
        //     t = Math.ceil(t);
        //     this.messageRichTextBodyNode.y = 180 + t * 40;
        // }
        //this.messageRichTextBodyNode.x = 5;
        //this.messageRichTextBodyNode.y = -337.5;

    },

    showMessage: function showMessage(message) {
        var rit = this.messageRichTextBodyNode.getComponent(cc.RichText);

        rit.string = rit.string + message + "\n";
        var scroView = this.messageScrollView.getComponent(cc.ScrollView);
        scroView.scrollToBottom();
    }

});

cc._RFpop();
},{}],"normalTimerScript":[function(require,module,exports){
"use strict";
cc._RFpush(module, '13d2120NChBIIzokcsa0rpZ', 'normalTimerScript');
// script/ui/normalTimerScript.js

"use strict";

var timerUpate;
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
        timeCount: cc.Integer,
        timerLable: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        self.timeCount = 10;
        timerUpate = function timerUpate() {
            var lable = self.timerLable.getComponent(cc.Label);
            lable.string = "(" + self.timeCount + ")";

            self.timeCount--;

            if (self.timeCount == -1) {
                //quePaiTimerLabel,huanPaiTimerLabel
                //
                self.endTimer();
                if (self.timerLable.name == "quePaiTimerLabel") {}
                if (self.timerLable.name == "huanPaiTimerLabel") {}
            }
        };
        self.stratTimer();
    },
    stratTimer: function stratTimer() {

        var self = this;
        self.schedule(timerUpate, 1);
    },
    endTimer: function endTimer() {
        var self = this;
        self.unschedule(timerUpate);
    }

});

cc._RFpop();
},{}],"onlineUserCheck":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bfb01GYRJNHYZfnbUrg0Gqd', 'onlineUserCheck');
// script/service/onlineUserCheck.js

"use strict";

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
        // client: null
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    checkonlineUser: function checkonlineUser(client) {

        this.callback = function () {
            var userInfo = Global.userInfo;

            if (userInfo != null && userInfo != undefined) {
                var openid = userInfo.openid;
                var roomNumber = userInfo.roomNumber;
                var messageObj = this.buildSendMessage(openid, roomNumber, "updateOnlinUserDateTime");
                this.sendMessageToServer(messageObj, client);
            }
        };

        this.schedule(this.callback, 1800);
    },

    removeOnlineUser: function removeOnlineUser(client, roomNumber) {
        var userInfo = Global.userInfo;
        if (userInfo != null && userInfo != undefined) {
            var openid = userInfo.openid;
            var messageObj = this.buildSendMessage(openid, roomNumber, "updateOnlinUserDateTime");
            this.sendMessageToServer(messageObj);
        }
    },
    sendMessageToServer: function sendMessageToServer(messageObj, client) {

        client.send("/app/userResiveMessage", {}, JSON.stringify(messageObj));
    },
    buildSendMessage: function buildSendMessage(messageBody, roomNum, action) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNum;
        messageDomain.messageAction = action;
        messageDomain.messageBody = messageBody;

        return messageDomain;
    }
});

cc._RFpop();
},{"messageDomain":"messageDomain"}],"paiAction":[function(require,module,exports){
"use strict";
cc._RFpush(module, '36b48sC7pVLV7hYdCsCw/lc', 'paiAction');
// script/ui/paiAction.js

'use strict';

var actionWidth = [];
var actionName = [];
var tablePaiActionScript;
var tableUserInfoNodeScript;
var huPaiScript;
var tableNetWorkScript;
var tableCenterScript;
var pengOrder = 100;
var moPaiScript;
var roundScoreUIScript;
var audioScript;
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
        actionNode: cc.Node,
        zimoNode: cc.Node,
        pengNode: cc.Node,
        gangNode: cc.Node,
        huNode: cc.Node,
        cancleNode: cc.Node,
        tablePaiActionNode: cc.Node,
        tableUserInfoNode: cc.Node,
        paiChuPaiNode: cc.Prefab,
        huPaiNode: cc.Node,
        paiType: String,
        paiNumber: String,
        fromUserOpenId: String,
        chuPaiUserOpenId: String,
        preStep: String,
        otherUserActionString: String,
        tableNetWorkNode: cc.Node,
        tableCenterNode: cc.Node,
        user3PaiListNode: cc.Node,
        moPaiActionNode: cc.Node,
        roundScoreScriptNode: cc.Node,
        audioNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        actionName = ['zimo', 'peng', 'gang', 'hu', 'cancle'];
        actionWidth = [225, 166, 137, 121, 112];
        //actionWidth = [225, 156, 157, 141, 112];
        this.actionNode.active = false;
        this.zimoNode.active = false;
        this.pengNode.active = false;
        this.huNode.active = false;
        this.cancleNode.active = false;
        this.preStep = "";
        tablePaiActionScript = this.tablePaiActionNode.getComponent('tablePaiAction');
        tableUserInfoNodeScript = this.tableUserInfoNode.getComponent('tableUserInfo');
        huPaiScript = this.huPaiNode.getComponent("HuPaiAction");
        tableNetWorkScript = this.tableNetWorkNode.getComponent("GameTableNetWork");
        tableCenterScript = this.tableCenterNode.getComponent("tableCenterPoint");
        moPaiScript = this.moPaiActionNode.getComponent("tableMoPaiAction");
        roundScoreUIScript = this.roundScoreScriptNode.getComponent("roundScoreUI");
        audioScript = this.audioNode.getComponent("AudioMng");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    testShowAction: function testShowAction() {
        var actionArray = ['cancle', 'gang', 'peng'];
        this.showAction(actionArray);
    },
    testPengPai: function testPengPai() {
        this.pengAction("testUser2", "33");
        this.pengAction("testUser0", "11");
        this.pengAction("testUser1", "22");
        this.pengAction("testUser3", "28");
        //this.gangAction("testUser2", "23");
        this.pengAction("testUser2", "23");
    },

    testshowPengGangPaiListOnTalbe: function testshowPengGangPaiListOnTalbe() {
        var y = -250;
        var x = 0;
        var tableNode = cc.find("Canvas/tableNode");
        var userPengPaiListNode = cc.find("user2PengPaiListNode", tableNode);
        this.showPengGangPaiListOnTalbe([11, 12], null, 2, "12", userPengPaiListNode, "peng", 0, -250);
    },
    checkQueInList: function checkQueInList(quePai, paiList) {
        var flag = false;
        if (quePai != null && quePai != undefined) {
            quePai = quePai + "";
            quePai = quePai.trim();
            for (var i = 0; i < paiList.length; i++) {
                var pai = paiList[i] + "";
                pai = pai.trim();
                var paiType = pai[0];
                if (paiType == quePai) {
                    flag = true;
                }
            }
        }
        return flag;
    },
    clearQuePaiInPaiList: function clearQuePaiInPaiList(quePai, paiList) {
        cc.log("clearQuePaiInPaiList paiList1:" + paiList);
        var temp = [];

        if (quePai != null && quePai != undefined) {
            quePai = quePai + "";
            quePai = quePai.trim();
            for (var i = 0; i < paiList.length; i++) {
                var pai = paiList[i] + "";
                pai = pai.trim();
                var paiType = pai[0];
                if (paiType != quePai) {
                    temp.push(pai);
                }
            }
        }
        cc.log("clearQuePaiInPaiList paiList2:" + paiList);
        return temp;
    },
    checkActionArrayInSelfPaiList: function checkActionArrayInSelfPaiList(openid) {
        var user = tablePaiActionScript.getCorrectUserByOpenId(openid);
        var paiList = user.paiListArray;
        var tempList = [];
        for (var j = 0; j < paiList.length; j++) {
            tempList.push(paiList[j]);
        }
        var huFlag = huPaiScript.hupaiLogicNoInsert(tempList);
        var actionArray = ['cancle'];
        for (var j = 0; j < tempList.length; j++) {
            var paiNumber = tempList[j] + "";
            paiNumber = paiNumber.trim();
            var paiCount = 0;
            for (var i = 0; i < tempList.length; i++) {
                var pai = tempList[i] + "";
                pai = pai.trim();
                if (pai == paiNumber) {
                    paiCount++;
                }
            }

            if (paiCount == 4) {
                if (actionArray.indexOf("gang") < 0) {
                    actionArray.push("gang");
                }
            }
        }

        if (huFlag == true) {
            if (actionArray.indexOf("hu") < 0) {
                actionArray.push("hu");
                actionLevel = 3;
            }
        }
        return actionArray;
    },
    getActionBarArrayByOpenId: function getActionBarArrayByOpenId(paiNumber, openid, type) {
        var user = tablePaiActionScript.getCorrectUserByOpenId(openid);
        var paiList = user.paiListArray;
        var tempList = [];
        for (var i = 0; i < paiList.length; i++) {
            tempList.push(paiList[i]);
        }
        var pengList = user.pengPaiList;
        var actionArray = ['cancle'];

        var quePai = user.quePai;
        var userInfo = Global.userInfo;
        var paiCount = 0;
        quePai = quePai + "";
        cc.log("getActionBarArrayByOpenId quePai:" + quePai);
        //check quepai 
        // if (type != "mopai") {
        var paiType = paiNumber + "";
        paiType = paiType.trim();
        if (paiType[0] == quePai) {
            return actionArray;
        }
        //  }

        var actionLevel = 0;
        var huFlag = false;
        if (pengList == null || pengList == undefined) {
            pengList = [];
        }
        //only mo pai check the peng list on gang 
        if (type == "mopai") {
            for (var i = 0; i < pengList.length; i++) {
                var pengPai = pengList[i] + "";
                pengPai = pengPai.trim();
                if (pengPai == paiNumber + "") {
                    if (actionArray.indexOf("gang") < 0) {
                        actionArray.push("gang");
                        actionLevel = 2;
                    }
                }
            }
        }

        if (this.checkQueInList(quePai, tempList) == false) {
            tempList = this.clearQuePaiInPaiList(quePai, tempList);

            cc.log("huFlag0:" + huFlag);
            huFlag = huPaiScript.hupaiLogic(paiNumber, userInfo.openid, tempList, type);
            cc.log("huFlag1:" + huFlag);
        }

        //we need clear the mopai from the paiList 
        //get pai count in self pai list 
        for (var i = 0; i < tempList.length; i++) {
            var pai = tempList[i] + "";
            pai = pai.trim();
            if (pai == paiNumber) {
                paiCount++;
            }
        }
        if (type != "mopai") {
            if (paiCount >= 3) {
                if (actionArray.indexOf("gang") < 0) {
                    actionArray.push("gang");
                    actionLevel = 2;
                }
            }
        } else {

            if (paiCount == 4) {
                if (actionArray.indexOf("gang") < 0) {
                    actionArray.push("gang");
                    actionLevel = 2;
                }
            }
            for (var i = 0; i < tempList.length; i++) {
                var tempPai = tempList[i] + "";
                tempPai = tempPai.trim();
                var tempCount = 0;
                for (var j = 0; j < tempList.length; j++) {
                    var temp2 = tempList[j] + "";
                    temp2 = temp2.trim();
                    if (temp2 == tempPai) {
                        tempCount++;
                        if (tempCount == 4) {
                            break;
                        }
                    }
                }

                if (tempCount == 4) {
                    if (actionArray.indexOf("gang") < 0) {
                        actionArray.push("gang");
                        actionLevel = 2;
                    }
                }
            }
        }
        if (type != "mopai") {
            if (paiCount >= 2) {
                if (actionArray.indexOf("peng") < 0) {
                    actionArray.push("peng");
                    actionLevel = 2;
                }
            }
        }

        if (huFlag == true) {
            actionArray.push("hu");
            actionLevel = 3;
        }
        cc.log("paiCount:" + paiCount.toString());
        cc.log("actionArray:" + actionArray.toString());
        return actionArray;
    },
    getSelfActionBarArray: function getSelfActionBarArray(paiNumber) {
        var userInfo = Global.userInfo;
        var user = tablePaiActionScript.getCorrectUserByOpenId(userInfo.openid);
        var paiList = user.paiListArray;
        var temp = [];
        for (var i = 0; i < paiList.length; i++) {
            temp.push(paiList[i]);
        }
        var paiCount = 0;
        var actionArray = ['cancle'];
        var actionLevel = 0;
        var huFlag = false;
        var quePai = user.quePai;
        cc.log("getSelfActionBarArray paiList1:" + temp.toString());
        if (this.checkQueInList(quePai, temp) == false) {
            temp = this.clearQuePaiInPaiList(quePai, temp);
            huFlag = huPaiScript.hupaiLogic(paiNumber, userInfo.openid, temp, "mopai");
        }
        cc.log("getSelfActionBarArray paiList2:" + paiList.toString());
        paiNumber = paiNumber + "";
        //get pai count in self pai list 
        for (var i = 0; i < paiList.length; i++) {
            var pai = paiList[i] + "";
            pai = pai.trim();
            if (pai == paiNumber) {
                paiCount++;
            }
        }

        if (paiCount >= 3) {
            actionArray.push("gang");
            actionLevel = 2;
        }

        if (paiCount >= 2) {
            actionArray.push("peng");
            actionLevel = 2;
        }

        if (huFlag == true) {
            actionArray.push("hu");
            actionLevel = 3;
        }
        cc.log("paiCount:" + paiCount.toString());
        cc.log("actionArray:" + actionArray.toString());
        return actionArray;
    },
    /**
     * This function only work on self mopai 
     */
    showActionBarOnSelf: function showActionBarOnSelf(paiNumber, fromPaiOpenId, type) {},
    /**
     * This function only work on the chu pai
     * 
     */
    showOtherActionBar: function showOtherActionBar(paiNumber, fromPaiOpenId, type) {
        //we should consider the action level.
        //hu ==3 , peng,gang==2
        var actionArray = ['cancle'];
        var showFlag = false;
        var actionLevel = 0;
        this.paiNumber = paiNumber;
        this.fromUserOpenId = fromPaiOpenId;
        paiNumber = paiNumber + "";
        paiNumber = paiNumber.trim();
        var userInfo = Global.userInfo;
        var user = tablePaiActionScript.getCorrectUserByOpenId(userInfo.openid);
        var paiList = user.paiListArray;
        var paiCount = 0;

        //if it is chupai from other user, it should not work on intalSelfPaiList
        // if(type=="chupai"){
        //     if(userInfo.openid==fromPaiOpenId){
        //         return false;
        //     }
        // }
        var userList = Global.userList;
        //get other user if have hu

        var huFlag = false;
        var otherHuArray = [];
        var otherHuMap = new Map();
        var otherUserResutl = false;
        for (var i = 0; i < userList.length; i++) {
            var otherHU = false;

            if (userList[i].openid == userInfo.openid) {
                // huFlag = otherHU;
            } else {
                var quePai = userList[i].quePai;
                if (this.checkQueInList(quePai, userList[i].paiListArray) == false) {
                    paiList = this.clearQuePaiInPaiList(quePai, userList[i].paiListArray);
                    otherHU = huPaiScript.hupaiLogic(paiNumber, userList[i].openid, "");
                }

                otherHuMap.set(userList[i].openid, otherHU);
                if (otherHU == true) {
                    otherUserResutl = otherHU;
                }
            }
        }
        actionArray = this.getSelfActionBarArray(paiNumber);

        if (actionArray.length > 1) {
            //if the action level is 3 ,show the level
            if (actionArray.join(",").indexOf("hu") >= 0) {
                this.showAction(actionArray);
                // showFlag = true;
            } else {
                //if other user no hu ,still show the bar action 
                if (otherUserResutl == false) {
                    this.showAction(actionArray);
                } else {
                    //other user can hu pai ,but him cancle this hu action 
                    if (type == "otherCancleHu") {
                        this.showAction(actionArray);
                    }
                }
            }
        } else {
            //go to next user mo pai 
        }

        return actionLevel;
    },
    showAction: function showAction(actionArray) {
        //from right to left ,the x is reduce.
        cc.log("showAction actionArray:" + actionArray.toString());
        var startX = 146;
        var actionWidthTemp = [];
        for (var j = 0; j < actionName.length; j++) {
            var node2 = cc.find(actionName[j] + "ActionNode", this.actionNode);
            node2.active = false;;
        }
        for (var i = 0; i < actionArray.length; i++) {
            var node = cc.find(actionArray[i] + "ActionNode", this.actionNode);
            node.active = true;
            node.x = startX;
            for (var j = 0; j < actionName.length; j++) {
                if (actionName[j] == actionArray[i]) {
                    //actionWidthTemp.push(actionWidth[j]);
                    startX = startX - actionWidth[j] - 15;
                    cc.log("startX:" + startX);
                }
            }
        }

        this.actionNode.active = true;
        this.actionNode.zIndex = 500;
        //disable user pai 

        tablePaiActionScript.disableAllSlefPai();
    },
    testPalyOtherChuPai: function testPalyOtherChuPai() {
        var tableNode = cc.find("Canvas/tableNode");
        var user = tablePaiActionScript.getCorrectUserByOpenId("testUser2");
        var userChuPaiListNode = cc.find("user3PaiList", tableNode);
        // var chuPaiListNode = cc.find("user" + index + "ChuaPaiListNode",this.tableNode);
        var children = userChuPaiListNode.children;

        var node = null;
        for (var i = 0; i < children.length; i++) {

            if (children[i].name.indexOf("38") >= 0) {
                node = children[i];
            }
        }

        tablePaiActionScript.playSlefChuPaiAction(node, "3");
    },
    testMoPaiAction: function testMoPaiAction() {
        moPaiScript.moPaiAction("12", "testUser1");
        //tableCenterScript.index =2;
        //  moPaiScript.moPaiOnDataLayer("11", "testUser2");
        //  moPaiScript.moPaiOnDataLayer(paiNumber, toUserOpenid);
        //var user = tablePaiActionScript.getCorrectUserByOpenId("testUser2");
        //var paiListStr = user.paiList;
        // tableUserInfoNodeScript.initalOtherPaiListOnePai("11", user.paiListArray, user.pointIndex, "");
    },
    testMoPaiAction2: function testMoPaiAction2() {
        moPaiScript.moPaiAction("24", "testUser2");
    },
    testMoPaiAction3: function testMoPaiAction3() {
        moPaiScript.moPaiAction("14", "testUser3");
    },
    testMoPaiAction4: function testMoPaiAction4() {
        moPaiScript.moPaiAction("38", "testUser4");
    },
    testHuPai: function testHuPai() {

        this.fromUserOpenId = "testUser2";
        this.paiNumber = "29";
        this.chuPaiUserOpenId = "testUser4";
        // this.pengAction();
        var user = tablePaiActionScript.getCorrectUserByOpenId("testUser2");
        cc.log("testHuPai:" + user.paiListArray.toString());
        this.gangAction();
        cc.log("testHuPai1:" + user.paiListArray.toString());
        //Global.huPreStep = "";
        //  this.preStep="";
        this.testMoPaiAction();
        this.fromUserOpenId = "testUser1";
        this.chuPaiUserOpenId = "testUser2";
        this.paiNumber = "15";
        //this.gangAction();
        this.huAction();
        // cc.log("476");
        tableNetWorkScript.countUserRoundScore();
        // cc.log("477");
        tableNetWorkScript.testScoreOutput();

        //  roundScoreUIScript.initalRoundScore();
        //  roundScoreUIScript.initalAllRoundScore();
    },
    testOtherPengPai: function testOtherPengPai() {

        // this.fromUserOpenId = "testUser2";
        // this.paiNumber = "15";
        // this.pengAction();
        // this.paiNumber = "29";
        //this.pengAction();
        // this.paiNumber = "24";
        // //this.pengAction();
        // this.paiNumber = "35";
        // //this.pengAction();

        // this.fromUserOpenId = "testUser1";
        // this.paiNumber = "16";
        // this.chuPaiUserOpenId = "testUser3";
        //this.gangAction();
        // this.paiNumber = "35";
        //this.chuPaiUserOpenId = "testUser2";
        //this.gangAction();
        //this.huAction();


    },
    testGangAction: function testGangAction() {},
    //------------------------Peng,Gang,Hu Action---------------------------------------

    pengAction: function pengAction() {

        this.preStep = "";
        var userInfo = Global.userInfo;
        var userOpenId = this.fromUserOpenId;
        var paiNumber = this.paiNumber;
        cc.log("pengAction paiNumber:" + paiNumber);
        var user = tablePaiActionScript.getCorrectUserByOpenId(userOpenId);
        var pointIndex = user.pointIndex;
        cc.log("pointIndex:" + pointIndex);
        //data layer ------
        var paiList = user.paiListArray;
        paiList = this.removeElementByNumberFromUser(paiList, paiNumber, 2);
        cc.log("pengAction paiList:" + paiList);
        user.paiListArray = paiList;
        var pengList = user.pengPaiList;
        if (pengList == null || pengList == undefined) {
            pengList = [];
        }
        pengList.push(paiNumber);
        user.pengPaiList = pengList;
        //update user to gobal
        user = tablePaiActionScript.synchronizationPaiList(user);
        tablePaiActionScript.updateUserListInGobal(user);
        //data layer end -------------------------------------
        //-------show user pai list-----------------
        cc.log("pengAction:" + pointIndex);
        var endPoing = this.initalPengAndGangChuPaiList(userOpenId, paiNumber, "peng");
        if (pointIndex == "3") {
            tablePaiActionScript.removeAllNodeFromSelfPaiList();
            tableUserInfoNodeScript.intalSelfPaiList(user.paiList);
        } else {
            tablePaiActionScript.removeAllNodeFromOtherPaiList(pointIndex);
            //if (pointIndex != "2") 
            tableUserInfoNodeScript.initalOtherPaiList(user.paiList, pointIndex, "pengList", endPoing);
        }

        Global.chuPaiActionType = "peng";
        cc.log("pengAction chuPaiUserOpenId:" + this.chuPaiUserOpenId);
        cc.log("pengAction userInfo.openid:" + userInfo.openid);
        cc.log("pengAction userOpenId:" + userOpenId);
        //remove last pai from chu pai list layer.
        tablePaiActionScript.removeLastPaiOnChuPaiListByUserOpenId(this.chuPaiUserOpenId, paiNumber);

        if (userInfo.openid == userOpenId) {
            tableNetWorkScript.sendPengPaiAction(userOpenId, paiNumber);
            this.actionNode.active = false;
            tablePaiActionScript.enabledAllPaiAfterQuePai();
            tableCenterScript.index = user.pointIndex;
            tableCenterScript.showCenterPoint();
            tableNetWorkScript.sendCenterIndex(user.openid);
        }

        audioScript.playAction("peng");
        // this.actionNode.active = false;
        // tablePaiActionScript.enabledAllPaiAfterQuePai();
    },
    gangAction: function gangAction() {
        var userInfo = Global.userInfo;
        var userOpenId = this.fromUserOpenId;
        var paiNumber = this.paiNumber;
        var user = tablePaiActionScript.getCorrectUserByOpenId(userOpenId);
        var pointIndex = user.pointIndex;
        var isZiGangFlag = true;
        //data layer ------
        var paiList = user.paiListArray;
        var pengList = user.pengPaiList;
        var gangList = user.gangPaiList;
        var gangFromUserList = user.gangFromUserListOpenId;
        if (gangFromUserList == null || gangFromUserList == undefined) {
            gangFromUserList = [];
        }
        Global.gangFromUserOpenId = this.chuPaiUserOpenId;
        gangFromUserList.push(this.chuPaiUserOpenId);
        user.gangFromUserListOpenId = gangFromUserList;
        //zi gang or pa gang 
        var gangTypeList = user.gangTypeList;
        if (gangTypeList == null || gangTypeList == undefined || gangTypeList == "") {
            gangTypeList = [];
        }
        //GET THE user list when it gang
        var gangExistUser = user.gangExistUser;
        if (gangExistUser == null || gangExistUser == undefined) {
            gangExistUser = [];
        }
        var gangExistUserCache = user.gangExistUserCache;
        if (gangExistUserCache == null || gangExistUserCache == undefined) {
            gangExistUserCache = [];
        }

        var userList2 = Global.userList;

        //check if pa gang only on self  
        if (pengList == null || pengList == undefined) {
            pengList = [];
        }
        for (var i = 0; i < pengList.length; i++) {
            var pengPai = pengList[i] + "";
            pengPai = pengPai.trim();
            if (pengPai == paiNumber + "") {
                pengList.splice(i, 1);
                user.pengPaiList = pengList;
                //gangTypeList.push("1");
                isZiGangFlag = false;
                //gangList.push(paiNumber); 
            }
        };
        cc.log("gangAction source pai:" + paiNumber);
        cc.log("gangAction paiList:" + paiList.toString());
        paiList = this.removeAllElementByNumberFromUser(paiList, paiNumber);
        //if the gang pai from other user.
        if (userOpenId != this.chuPaiUserOpenId) {
            tablePaiActionScript.removeLastPaiOnChuPaiListByUserOpenId(this.chuPaiUserOpenId, paiNumber);
        }
        if (userOpenId == this.chuPaiUserOpenId) {

            //remove the mo pai on this 
            if (user.userMoPai == paiNumber) {

                //remove the mopai 
                user.userMoPai = "";
                tablePaiActionScript.updateUserListInGobal(user);
                var children = this.user3PaiListNode.children;
                var moPaiNode = null;
                for (var i = 0; i < children.length; i++) {
                    var lastNode = children[i];
                    if (lastNode.name.indexOf("mopai") >= 0) {
                        lastNode.removeFromParent();
                    }
                }

                this.preStep = "zigang";
            } else {
                this.preStep = "gang";
            }
        } else {

            this.preStep = "gang";
        }
        Global.gangHuPai = paiNumber;

        cc.log("gangAction paiList:" + paiList);
        user.paiListArray = paiList;

        if (gangList == null || gangList == undefined) {
            gangList = [];
        }

        gangList.push(paiNumber);
        user.gangPaiList = gangList;
        //--------------GANG USER---------------------

        var existUserString = "";
        var existUserStringCache = "";
        for (var i = 0; i < userList2.length; i++) {
            var user2 = userList2[i];
            if (user2.huPai != null && user2.huPai != undefined && user2.huPai != "") {} else {
                //gang from self mo pai, every body should in this gang
                //if (this.chuPaiUserOpenId == user.openid) {
                if (user2.openid != this.fromUserOpenId) {
                    existUserString = existUserString + user2.openid + ";";
                    existUserStringCache = existUserStringCache + user2.openid + ";";
                }
                //}
            }
        }
        gangExistUserCache.push(existUserStringCache);
        if (this.chuPaiUserOpenId != user.openid) {
            existUserString = this.chuPaiUserOpenId;
        }

        if (existUserString.substring(existUserString.length - 1) == ";") {
            existUserString = existUserString.substring(0, existUserString.length - 1);
        }

        gangExistUser.push(existUserString);
        user.gangExistUser = gangExistUser;
        user.gangExistUserCache = gangExistUserCache;
        cc.log(" user.gangExistUser:" + user.gangExistUser);
        //gangExistUserCache
        if (isZiGangFlag) {
            gangTypeList.push("2");
        } else {
            gangTypeList.push("1");
        }
        //gangTypeList.push("2");
        user.gangTypeList = gangTypeList;
        cc.log("user.gangTypeList0:" + gangTypeList);
        cc.log("user.gangTypeList1:" + gangTypeList[0]);
        // mopai 
        //update user to gobal
        user = tablePaiActionScript.synchronizationPaiList(user);
        tablePaiActionScript.updateUserListInGobal(user);
        //data layer end -------------------------------------
        //-------show user pai list-----------------
        cc.log("gangAction:" + pointIndex);
        var endPoint = this.initalPengAndGangChuPaiList(userOpenId, paiNumber, "gang");
        if (pointIndex == "3") {
            tablePaiActionScript.removeAllNodeFromSelfPaiList();
            tableUserInfoNodeScript.intalSelfPaiList(user.paiList);
        } else {
            tablePaiActionScript.removeAllNodeFromOtherPaiList(pointIndex);
            // if (pointIndex != "2") {
            tableUserInfoNodeScript.initalOtherPaiList(user.paiList, pointIndex, "gang", endPoint);
            //  }
        }

        Global.huPreStep = "gang";
        cc.log("0 gang:" + Global.chuPaiActionType);
        //remove last pai from chu pai user
        cc.log("userInfo.openid:" + this.chuPaiUserOpenId);
        // if (userOpenId != this.chuPaiUserOpenId) {

        cc.log("userInfo.openid:" + userInfo.openid);
        cc.log("userOpenId:" + userOpenId);
        if (userInfo.openid == userOpenId) {
            tableNetWorkScript.sendGangPaiAction(this.chuPaiUserOpenId, userOpenId, paiNumber, gangTypeList);
            this.actionNode.active = false;
            //mopai
            tableNetWorkScript.sendMoPaiOnSelecAction(user.openid);
            //enable pai 
            tablePaiActionScript.enabledAllPaiAfterQuePai();
            tableCenterScript.index = user.pointIndex;
            tableCenterScript.showCenterPoint();
            tableNetWorkScript.sendCenterIndex(user.openid);
        }
        // this.actionNode.active = false;
        // tablePaiActionScript.enabledAllPaiAfterQuePai();

        cc.log("gang:" + Global.huPreStep);
        audioScript.playAction("gang");
    },

    setZhuangOnFirstHU: function setZhuangOnFirstHU() {
        var userList = Global.userList;
        var huPaiNumer = 0;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            if (user.huPai != null && user.huPai != undefined && user.huPai != "") {
                huPaiNumer++;
            }
        }

        if (huPaiNumer == 1) {
            for (var i = 0; i < userList.length; i++) {
                var user2 = userList[i];
                if (user2.huPai != null && user2.huPai != undefined && user2.huPai != "") {
                    user2.zhuang = "1";
                } else {
                    user2.zhuang = "";
                }
            }
            //update user list to Global
            Global.userList = userList;
        }
    },

    huAction: function huAction() {
        var gameMode = Global.gameMode;
        if (this.preStep == null || this.preStep == undefined || this.preStep == "") {
            this.preStep = "normalChuPai";
        }

        var userInfo = Global.userInfo;
        var userOpenId = this.fromUserOpenId;
        var chupaiOpenId = this.chuPaiUserOpenId;
        cc.log("huAction pai:" + this.paiNumber);
        huPaiScript.huPaiAction(this.paiNumber, this.fromUserOpenId, Global.chuPaiActionType);
        //cache the user hupai information
        var user = tablePaiActionScript.getCorrectUserByOpenId(userOpenId);
        user.huPai = this.paiNumber;
        user.huPaiFromUser = this.chuPaiUserOpenId;
        user.huchuPaiType = this.preStep;

        var userList2 = Global.userList;
        var existUserString = "";
        cc.log("hu gang:" + Global.chuPaiActionType);
        if (Global.huPreStep == "gang") {
            user.huGangShangHuaChuPaiUserOpenId = this.chuPaiUserOpenId;
            user.huGangPaiInOtherUserFromOpenId = Global.gangFromUserOpenId;
            cc.log("hu huGangShangHuaChuPaiUserOpenId:" + user.huGangShangHuaChuPaiUserOpenId + "---" + user.openid);
        } else {}
        // user.huGangShangHuaChuPaiUserOpenId = "";

        //zi mo add all not hu user into exist user 
        if (userOpenId == chupaiOpenId || gameMode.dianGangHua_ziMo + "" == "1" && Global.huPreStep == "gang") {
            for (var i = 0; i < userList2.length; i++) {
                var user2 = userList2[i];
                if (user2.huPai != null && user2.huPai != undefined && user2.huPai != "") {} else {
                    if (user2.openid != userInfo.openid) {
                        existUserString = existUserString + user2.openid + ";";
                    }
                }
            }
        } else {

            //dian pao 
            existUserString = chupaiOpenId;
        }

        if (existUserString.length > 0) {
            if (existUserString.substring(existUserString.length - 1) == ";") {
                existUserString = existUserString.substring(0, existUserString.length - 1);
            }
        }
        cc.log("existUserString 753:" + existUserString);
        cc.log("existUserString 753 user:" + user.openid);
        user.existUserString = existUserString;

        var pointIndex = user.pointIndex;
        tablePaiActionScript.updateUserListInGobal(user);

        //now we need set the zhuang jia on the first hu
        this.setZhuangOnFirstHU();
        if (userOpenId == chupaiOpenId) {
            audioScript.playAction("zimo");
        } else {
            audioScript.playAction("hu");
        }

        //self user send the hupai to other user

        if (userOpenId == userInfo.openid) {
            tableNetWorkScript.sendHuPaiAction(userOpenId, chupaiOpenId, this.paiNumber, Global.chuPaiActionType, this.preStep, existUserString, Global.gangFromUserOpenId);
            this.actionNode.active = false;
            tablePaiActionScript.disableAllSlefPai();
            //remove mopai 
            if (userOpenId == chupaiOpenId) {
                var tableNode = cc.find("Canvas/tableNode");
                var userPaiListNode = cc.find("user" + pointIndex + "PaiList", tableNode);
                var children = userPaiListNode.children;
                for (var i = 0; i < children.length; i++) {
                    var cNode = children[i];
                    if (cNode.name.indexOf("mopai") >= 0) {
                        cNode.removeFromParent();
                    }
                }
            }
        }
    },

    initalPengAndGangChuPaiList: function initalPengAndGangChuPaiList(userOpenId, paiNumber, type) {

        var user = tablePaiActionScript.getCorrectUserByOpenId(userOpenId);
        var pointIndex = user.pointIndex;
        var tableNode = cc.find("Canvas/tableNode");
        var userPengPaiListNode = cc.find("user" + pointIndex + "PengPaiListNode", tableNode);
        userPengPaiListNode.removeAllChildren();
        cc.log("166:" + userPengPaiListNode.children.length);
        var pengList = user.pengPaiList;
        var gangPaiList = user.gangPaiList;
        var paiList = user.paiListArray;
        var x = 0;
        var y = 0;
        //inital the orlder inital  value 
        pengOrder = 100;
        if (pointIndex == "3") {
            user.pengGangPaiPoint = 410;
            y = 0;
            x = user.pengGangPaiPoint;
        } else if (pointIndex == "1") {
            user.pengGangPaiPoint = -200;
            y = 0;
            x = user.pengGangPaiPoint;
        } else if (pointIndex == "2") {
            user.pengGangPaiPoint = -210;

            y = user.pengGangPaiPoint;
            x = 0;
        } else if (pointIndex == "4") {
            user.pengGangPaiPoint = 130;
            y = user.pengGangPaiPoint;
            x = 0;
        }

        this.showPengGangPaiListOnTalbe(pengList, gangPaiList, pointIndex, paiNumber, userPengPaiListNode, type, x, y);
        cc.log("end");
        var endPoint = this.getEndPoint(pengList, gangPaiList, pointIndex, paiNumber, userPengPaiListNode, type, x, y);
        // return endPoint;
        return endPoint;
    },

    getEndPoint: function getEndPoint(pengList, gangList, pointIndex, paiNumber, userPengPaiListNode, type, x, y) {
        var finalX = x;
        var finalY = y;
        var endPoint;
        if (pengList != null && pengList != undefined) {
            for (var i = 0; i < pengList.length; i++) {
                //get final point for gang
                for (var j = 1; j < 4; j++) {

                    var point0 = this.getCorrectPointByIndex(pointIndex, finalX, finalY);
                    finalX = point0[0];
                    finalY = point0[1];
                    cc.log("endPoint finalX:" + finalX);
                }
            }
        }

        if (gangList != null && gangList != undefined) {
            for (var k = 0; k < gangList.length; k++) {
                for (var j = 1; j < 4; j++) {
                    var point = this.getCorrectPointByIndex(pointIndex, finalX, finalY);
                    finalX = point[0];
                    cc.log("endPoint finalX 2:" + finalX);
                    finalY = point[1];
                }
            }
        }
        //get final end point 
        if (pointIndex == "1") {
            endPoint = finalX;
            cc.log("endPoint:" + endPoint);
        } else if (pointIndex == "3") {
            endPoint = finalX;
        } else if (pointIndex == "2") {
            endPoint = finalY;
        } else {
            endPoint = finalY;
        }

        return endPoint;
    },

    showPengGangPaiListOnTalbe: function showPengGangPaiListOnTalbe(pengList, gangList, pointIndex, paiNumber, userPengPaiListNode, type, x, y) {

        var isGangFlagList = [];
        var finalX = x;
        var finalY = y;
        var endPoint;
        if (pengList != null && pengList != undefined) {
            for (var i = 0; i < pengList.length; i++) {
                //get final point for gang
                for (var j = 1; j < 4; j++) {

                    var point0 = this.getCorrectPointByIndex(pointIndex, finalX, finalY);
                    finalX = point0[0];
                    finalY = point0[1];
                }
                var tempPai = pengList[i] + "";
                tempPai = tempPai.trim();
                //var isGang
                //eval("var   isGang" + paiNumber+"" + " = false;");
                // isGangFlagList[parseInt(tempPai)] = false;

                // eval("cc.log( 'isGang 216:'+  isGang" + paiNumber+")");
                var paiPath = tablePaiActionScript.getChuPaiNameByNodeName(tempPai, pointIndex);
                var middlePoint = null;
                // cc.log("isGang loadRes:" + isGang);
                cc.loader.loadRes(paiPath, cc.SpriteFrame, function (err, sp) {
                    if (err) {
                        cc.log("----" + err.message || err);
                        return;
                    }

                    var sencodPaiX = -1;
                    var sencodPaiY = -1;
                    for (var j = 1; j < 4; j++) {
                        var pNode = cc.instantiate(this.paiChuPaiNode);
                        pNode.name = "pengpai" + pointIndex + "_" + paiNumber;
                        pNode.active = true;
                        cc.log("peng x:" + x + "-----y:" + y);
                        pNode.position = cc.p(x, y);
                        if (j == 2) {
                            sencodPaiX = x;
                            sencodPaiY = y;
                        }

                        if (pointIndex == "2") {
                            pNode.setLocalZOrder(Math.abs(pengOrder));
                            pNode.zIndex = Math.abs(pengOrder);
                            //pNode.siblingIndex = pengOrder;
                            pengOrder--;
                            cc.log("siblingIndex:" + pengOrder);
                            userPengPaiListNode.setLocalZOrder(121);
                            userPengPaiListNode.zIndex = 121;
                        }

                        if (pointIndex == "4") {
                            userPengPaiListNode.setLocalZOrder(139);
                            userPengPaiListNode.zIndex = 139;
                            //cc.log("4 zindex:" + pNode.zIndex);
                            // cc.log("4 setLocalZOrder:" + pNode.getLocalZOrder());
                        }
                        var point = this.getCorrectPointByIndex(pointIndex, x, y);
                        x = point[0];
                        y = point[1];
                        // pengOrder=point[2];


                        var sprite = pNode.getComponent(cc.Sprite);
                        sprite.spriteFrame = sp;
                        userPengPaiListNode.addChild(pNode);
                    }
                }.bind(this));
            }
        }

        if (gangList != null && gangList != undefined) {
            for (var k = 0; k < gangList.length; k++) {
                var tempPai = gangList[k] + "";
                tempPai = tempPai.trim();
                var paiPath = tablePaiActionScript.getChuPaiNameByNodeName(tempPai, pointIndex);
                cc.loader.loadRes(paiPath, cc.SpriteFrame, function (err, sp) {
                    if (err) {
                        cc.log("----" + err.message || err);
                        return;
                    }

                    var sencodPaiX = -1;
                    var sencodPaiY = -1;
                    for (var m = 1; m < 4; m++) {
                        var pNode = cc.instantiate(this.paiChuPaiNode);
                        pNode.name = "pengpai" + pointIndex + "_" + paiNumber;
                        pNode.active = true;
                        cc.log("gang m:" + m);
                        cc.log("gang x:" + finalX + "-----y:" + finalY);
                        pNode.position = cc.p(finalX, finalY);
                        if (m == 2) {
                            sencodPaiX = finalX;
                            sencodPaiY = finalY;
                        }

                        if (pointIndex == "2") {
                            pNode.setLocalZOrder(Math.abs(pengOrder));
                            pNode.zIndex = Math.abs(pengOrder);
                            pengOrder--;
                        }

                        var point = this.getCorrectPointByIndex(pointIndex, finalX, finalY);
                        finalX = point[0];
                        finalY = point[1];

                        var sprite = pNode.getComponent(cc.Sprite);
                        sprite.spriteFrame = sp;
                        userPengPaiListNode.addChild(pNode);
                    }

                    //if (singleIsGang == true) {
                    var pNode2 = cc.instantiate(this.paiChuPaiNode);
                    if (pointIndex == "3") {
                        sencodPaiY = sencodPaiY + 15;
                    } else if (pointIndex == "1") {
                        sencodPaiY = sencodPaiY + 15;
                    } else if (pointIndex == "2") {
                        sencodPaiY = sencodPaiY + 15;
                    } else {
                        sencodPaiY = sencodPaiY + 15;
                    }

                    cc.log("isGang paiNumber:" + paiNumber);
                    cc.log("isGang paiPath:" + paiPath);

                    pNode2.name = "pengpai" + pointIndex + "_gang" + paiNumber;
                    pNode2.active = true;
                    if (pointIndex == "2") {
                        pNode2.setLocalZOrder(Math.abs(pengOrder + 100));
                        pNode2.zIndex = Math.abs(pengOrder + 100);
                    }
                    cc.log("gang x:" + finalX + "-----y:" + finalY);
                    pNode2.position = cc.p(sencodPaiX, sencodPaiY);
                    cc.log("sencodPaiX:" + sencodPaiX);
                    cc.log("sencodPaiY:" + sencodPaiY);
                    var sprite2 = pNode2.getComponent(cc.Sprite);
                    sprite2.spriteFrame = sp;
                    userPengPaiListNode.addChild(pNode2);
                    //isGang = false;

                    // }
                }.bind(this));
            }
        }
    },

    getCorrectPointByIndex: function getCorrectPointByIndex(pointIndex, x, y) {
        var point = [];
        var sourceY = y;
        if (pointIndex == "3") {
            x = x - 42;
        } else if (pointIndex == "1") {

            x = x + 42;
        } else if (pointIndex == "2") {

            y = y + 35;
        } else {
            y = y - 35;
        }
        if (Math.abs(sourceY) < Math.abs(y)) {
            sourceY = Math.abs(sourceY) - 1;
        }

        point.push(x);
        point.push(y);
        point.push(pengOrder);
        return point;
    },
    closeActionBar: function closeActionBar() {
        this.actionNode.active = false;
        var huNode = cc.find("huActionNode", this.actionNode);
        if (huNode.active == true) {}
        //send cancle hu to user.

        //send cancle action to mo pai user
        var userInfo = Global.userInfo;

        this.preStep = "";
        if (this.chuPaiUserOpenId == this.fromUserOpenId) {
            tablePaiActionScript.enabledAllPaiAfterQuePai();
        } else {
            if (this.otherUserActionString != null && this.otherUserActionString != "") {
                //show other user pai 
                var obj = JSON.parse(this.otherUserActionString);
                tableNetWorkScript.sendShowActionBarOnOtherUser(obj.userOpenId, obj.actionArray.toString(), obj.paiNumber, "");
            } else {
                tableNetWorkScript.sendCacleToMoPaiAction(userInfo.openid);
            }

            tablePaiActionScript.disableAllSlefPai();
        }

        //tablePaiActionScript.enabledAllPaiAfterQuePai();
    },

    //-----------------Action end-------------------------------------------------------
    removeAllElementByNumberFromUser: function removeAllElementByNumberFromUser(paiList, paiNumber) {
        paiNumber = paiNumber + "";
        paiNumber = paiNumber.trim();
        var tempList = [];
        for (var i = 0; i < paiList.length; ++i) {
            var temp = paiList[i] + "";
            temp = temp.trim();
            if (temp == paiNumber) {
                //paiList.splice(i, 1);
            } else {
                tempList.push(temp);
            }
        }

        return tempList;
    },

    removeElementByNumberFromUser: function removeElementByNumberFromUser(paiList, paiNumber, b) {
        var c = 1;
        while (c <= b) {
            for (var i = 0; i < paiList.length; ++i) {
                var temp = paiList[i] + "";
                temp = temp.trim();
                if (temp == paiNumber) {
                    paiList.splice(i, 1);

                    break;
                }
            }
            c++;
        }

        //only for test peng pai
        // if (paiList.length > 1)
        //     paiList.splice(0, 1);

        //onely for test end

        cc.log("peng pai list:" + paiList);
        return paiList;
    }

});

cc._RFpop();
},{}],"publicMessageController":[function(require,module,exports){
"use strict";
cc._RFpush(module, '22fa07yi7JPdKdmMqommxXs', 'publicMessageController');
// script/controllers/publicMessageController.js

"use strict";

var source_x;
var target_x;
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

        messageNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (source_x == null || source_x == undefined) {
            source_x = this.messageNode.x;
        }
        if (target_x == null || target_x == undefined) {
            target_x = source_x - 1000;
        }

        var y = this.messageNode.y;
        var action = cc.repeatForever(cc.sequence(cc.moveTo(5, cc.p(target_x, y)), cc.place(cc.p(source_x, y))));
        this.messageNode.runAction(action);
    }

});

cc._RFpop();
},{}],"quepaiScript":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0a892C+JV1AtLSyeQ6cx+RK', 'quepaiScript');
// script/ui/quepaiScript.js

"use strict";

var alerMessage;
var gameTableNetWork;
var timerUpate;
var timeCount;
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
        tongNode: cc.Node,
        tiaoNode: cc.Node,
        wanNode: cc.Node,
        thisSelectNode: cc.Node,
        waitOtherUserNode: cc.Node,
        quePaiNode: cc.Node,
        alertMessageNode: cc.Node,
        gameTableNetWorkNode: cc.Node,
        quePaiTimeLable: cc.Node,
        tableUserInfoNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.waitOtherUserNode.active = false;
        //tableUserInfoScript = this.tableUserInfoNode.getComponent("tableUserInfo");
        //this.thisSelectNode.active = true;
        // this.quePaiNode.active =false;
        //alerMessage = this.alertMessageNode.getComponent("alertMessagePanle");
        gameTableNetWork = this.gameTableNetWorkNode.getComponent("GameTableNetWork");
        timeCount = 14;
        timerUpate = function timerUpate() {

            var showTimerStr = "(" + timeCount + ")";
            var lable = this.quePaiTimeLable.getComponent(cc.Label);
            lable.string = showTimerStr;
            timeCount--;

            if (timeCount == -1) {
                this.endTimer();
            }
        };
    },

    endTimer: function endTimer() {
        Global.chuPaiActionType = "";
        var self = this;
        self.unschedule(timerUpate);
        // Global.chuPaiActionType = ""
        //auto select latest pai
        //tableUserInfo.forceFillHuanSanZhangList();
        //this.sendHuanSanZhang();
    },

    quePaiClick: function quePaiClick(event) {
        var node = event.target;
        var name = node.name;
        var que = "";
        if (name == "tong") {
            que = "1";
        }
        if (name == "tiao") {
            que = "2";
        }
        if (name == "wan") {
            que = "3";
        }

        var quePaiCount = this.setUePaiInUser(que);
        //show other wait other user select pai  
        this.quePaiNode.active = false;
        this.waitOtherUserNode.active = true;
        //set action typeof
        Global.chuPaiActionType = "normalChuPai";
        //send to server
        var userList = Global.userList;
        var userInfo = Global.userInfo;
        gameTableNetWork.sendQuePai(quePaiCount, userList.length);
    },
    setUePaiInUser: function setUePaiInUser(quePai) {
        var userList = Global.userList;
        var userInfo = Global.userInfo;
        var quePaiCount = 0;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userInfo.openid) {
                userList[i].quePai = quePai;
                userInfo.quePai = quePai;
                cc.log("setUePaiInUser :" + quePai);
                cc.log("setUePaiInUser openid:" + userInfo.openid);
            }

            if (userList[i].quePai != null && userList[i].quePai != undefined) {
                quePaiCount++;
            }
        }
        Global.userInfo = userInfo;
        Global.userList = userList;
        return quePaiCount;
    },

    showQuePaiNode: function showQuePaiNode() {
        this.quePaiNode.active = true;
    },
    closeWaitPanel: function closeWaitPanel() {
        this.waitOtherUserNode.active = false;
    },

    sendQuePai: function sendQuePai() {

        var userList = Global.userList;
        var userInfo = Global.userInfo;
        var quePaiCount = 0;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].quePai != null && userList[i].quePai != undefined) {
                quePaiCount++;
            }
        }
        if (quePaiCount < userList.length) {
            //show wait panl 
            this.waitPanleNode.active = true;
        } else {
            //Global.chuPaiActionType = ""
        }
    },

    stratTimer: function stratTimer() {
        //timeCount = 10;
        var self = this;
        self.schedule(timerUpate, 1);
        //
    },

    showQuePaiNodeAll: function showQuePaiNodeAll() {
        this.showQuePaiNode();
        this.stratTimer();
        // var typeCount = tableUserInfoScript.getTypeCount();
        // if (typeCount[0] + '' == "3") {
        //     this.showQuePaiNode();
        //     this.stratTimer();
        // } else if (typeCount[0] + '' == "1") {
        //     this.showQuePaiNode();
        //     this.stratTimer();


        // } else {
        //     this.waitOtherUserNode.active = true;
        //     //default que 
        //     var typeAll = "123"
        //     for (var i = 0; i < typeCount[1].length; i++) {
        //         typeAll = typeAll.replace(typeCount[1][i], "")
        //     }
        //     this.setUePaiInUser(typeAll);
        // }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"roundScoreUI":[function(require,module,exports){
"use strict";
cc._RFpush(module, '79342i+tgFLg7g6UMKmE4w/', 'roundScoreUI');
// script/ui/roundScoreUI.js

"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var userInfoScript;
var gameConfigButtonScript;
var tableNetWorkScript;
cc.Class(_defineProperty({
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
        userRoundScoreNode: cc.Node,
        userAllRoundScireNode: cc.Node,
        userInfoNode: cc.Node,
        gameConfigButtonListNode: cc.Node,
        tableNetWorkNode: cc.Node,
        endLunFlag: "0"

    },

    // use this for initialization
    onLoad: function onLoad() {
        userInfoScript = this.userInfoNode.getComponent("tableUserInfo");
        gameConfigButtonScript = this.gameConfigButtonListNode.getComponent("gameConfigButtonListAction");
        tableNetWorkScript = this.tableNetWorkNode.getComponent("GameTableNetWork");
    },

    initalRoundScore: function initalRoundScore() {
        var userList = Global.userList;
        this.userRoundScoreNode.active = true;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            var nodeName = "user" + (i + 1) + "ScoreNode";
            var userNode = cc.find(nodeName, this.userRoundScoreNode);
            var bgNode = cc.find("bgSprite", userNode);
            var userNameNode = cc.find("userNameLabel", bgNode);
            var userNameNodeLable = userNameNode.getComponent(cc.Label);
            userNameNodeLable.string = user.nickName;
            var userDetailsNode = cc.find("user1DetailsRichText", bgNode);
            var detailsRichText = userDetailsNode.getComponent(cc.RichText);
            detailsRichText.string = user.huPaiDetails;
            var userCountNode = cc.find("totalCountAllNode", bgNode);
            var userCountAllLable = userCountNode.getComponent(cc.Label);
            userCountAllLable.string = user.roundScoreCount;
        }
    },
    closeRoundScore: function closeRoundScore() {},

    initalAllRoundScore: function initalAllRoundScore() {
        var userList = Global.userList;
        this.userAllRoundScireNode.active = true;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            var nodeName = "user" + (i + 1) + "ScoreNode";
            var userNode = cc.find(nodeName, this.userAllRoundScireNode);
            var bgNode = cc.find("bgSprite", userNode);
            var userNameNode = cc.find("userNameLabel", bgNode);
            var userIdNode = cc.find("userIDNode", bgNode);
            var userNameNodeLable = userNameNode.getComponent(cc.Label);
            userNameNodeLable.string = user.nickName;

            var userIdTextLable = userIdNode.getComponent(cc.Label);
            userIdTextLable.string = user.userCode;
            var userDetailsNode = cc.find("huPaiDetailsNode", bgNode);
            var detailsRichText = userDetailsNode.getComponent(cc.Label);
            detailsRichText.string = "rrrrrrrrrr \n fdfdfdfdfd \n";
            var userCountNode = cc.find("totalCountNode", bgNode);
            var userCountAllLable = userCountNode.getComponent(cc.Label);
            userCountAllLable.string = "总成绩：" + user.roundScoreCount;
        }
    },

    closeAllRoundScore: function closeAllRoundScore() {
        var userList = Global.userList;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            var nodeName = "user" + (i + 1) + "ScoreNode";
            var userNode = cc.find(nodeName, this.userAllRoundScireNode);
            var bgNode = cc.find("bgSprite", userNode);
            var userDetailsNode = cc.find("huPaiDetailsNode", bgNode);
            var detailsRichText = userDetailsNode.getComponent(cc.Label);
            detailsRichText.string = "";
            var userCountNode = cc.find("totalCountNode", bgNode);
            var userCountAllLable = userCountNode.getComponent(cc.Label);
            userCountAllLable.string = "总成绩: 0";
        }

        this.userAllRoundScireNode.active = false;

        userInfoScript.cleanUserList();
        userInfoScript.cleanTable();
        userInfoScript.initalUserOnRound();

        gameConfigButtonScript.endGameRoundLun();
    }
}, "closeRoundScore", function closeRoundScore() {
    this.userRoundScoreNode.active = false;
    //go to a new game ground
    //1.clean the data layer
    userInfoScript.cleanUserList();
    userInfoScript.cleanTable();
    //2.GUI
    //gameConfigButtonScript.showGameTalbe("");
    if (this.endLunFlag == "0") {
        userInfoScript.initalUserOnRound();

        //3 send 

        tableNetWorkScript.sendStartNewRound();
    } else {
        this.initalAllRoundScore();
    }
}));

cc._RFpop();
},{}],"showGameMode":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3fc2balORNPzr17F9gMav4o', 'showGameMode');
// script/ui/showGameMode.js

"use strict";

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
    gameModeLable: cc.Node,
    gameRoomNUmber: cc.Node
  },

  // use this for initialization
  onLoad: function onLoad() {},

  showGameMode: function showGameMode() {
    var gameMode = Global.gameMode;
    var userInfo = Global.userInfo;
    if (gameMode == null || gameMode == undefined) {
      gameMode = require("gameMode").gameMode;
    }

    var modeStr = "";
    if (gameMode.ziMoJiaDi + "" == "1") {
      modeStr = modeStr + "自摸加底" + " ";
    }
    if (gameMode.ziMoJiaFan + "" == "1") {
      modeStr = modeStr + "自摸加番" + " ";
    }
    if (gameMode.ziMoHu + "" == "1") {
      modeStr = modeStr + "自摸胡" + " ";
    }
    if (gameMode.dianPaoHu + "" == "1") {
      modeStr = modeStr + "点炮胡" + " ";
    }
    if (gameMode.huanSanZhang + "" == "1") {
      modeStr = modeStr + "换三张" + " ";
    }
    if (gameMode.dianGangHua_dianPao + "" == "1") {
      modeStr = modeStr + "点杠点炮" + " ";
    }
    if (gameMode.dianGangHua_ziMo + "" == "1") {
      modeStr = modeStr + "点杠自摸" + " ";
    }
    if (gameMode.dai19JiangDui + "" == "1") {
      modeStr = modeStr + "带幺九" + " ";
    }
    if (gameMode.mengQingZhongZhang + "" == "1") {
      modeStr = modeStr + "门清中张" + " ";
    }

    if (gameMode.tianDiHu + "" == "1") {
      modeStr = modeStr + "天地胡" + " ";
    }

    if (gameMode.fan2 + "" == "1") {
      modeStr = modeStr + "2番封顶" + " ";
    }
    if (gameMode.fan3 + "" == "1") {
      modeStr = modeStr + "3番封顶" + " ";
    }
    if (gameMode.fan4 + "" == "1") {
      modeStr = modeStr + "4番封顶" + " ";
    }
    if (gameMode.roundCount4 + "" == "1") {
      modeStr = modeStr + Global.gameRoundCount + "/4局一轮" + " ";
    }
    if (gameMode.roundCount8 + "" == "1") {
      modeStr = modeStr + Global.gameRoundCount + "/8局一轮" + " ";
    }

    var modeLable = this.gameModeLable.getComponent(cc.Label);
    var roomLable = this.gameRoomNUmber.getComponent(cc.Label);
    modeLable.string = modeStr;
    roomLable.string = "房间号:" + Global.joinRoomNumber;
  }

});

cc._RFpop();
},{"gameMode":"gameMode"}],"tableActionController":[function(require,module,exports){
"use strict";
cc._RFpush(module, '45682QMUxxKk5knUxwzBWCY', 'tableActionController');
// script/controllers/tableActionController.js

"use strict";

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
        tableNetWorkAction: cc.Node,
        readyIcon: cc.SpriteFrame,
        readyNotIcon: cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function onLoad() {},

    userReadyToggle: function userReadyToggle(event) {

        var node = event.target;
        if (node.active == true) {
            node.active = false;
        } else {
            node.active = true;
        }
        cc.log("userReadyToggle:" + node.name);
    }

});

cc._RFpop();
},{}],"tableCenterPoint":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd2303wmCtRHxZznnzxI/frv', 'tableCenterPoint');
// script/ui/tableCenterPoint.js

"use strict";

var timerUpate;
var timeCount;
var pointUpdate;
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
        user1Point: cc.Node,
        user2Point: cc.Node,
        user3Point: cc.Node,
        user4Point: cc.Node,
        user1Quepai: cc.Node,
        user2Quepai: cc.Node,
        user3Quepai: cc.Node,
        user4Quepai: cc.Node,
        index: String,
        tenPoint: cc.Node,
        numPoint: cc.Node,
        numberSprite: [cc.SpriteFrame],
        centerPointNode: cc.Node,
        paiType: [cc.SpriteFrame],
        quePaiNode: cc.Node
    },

    // use self for initialization
    onLoad: function onLoad() {

        var self = this;
        self.hideAllPoint();
        timeCount = 30;
        this.initalCenterNum();
        this.hideAllQuePai();
        timerUpate = function timerUpate() {

            // cc.log("timeCount:" + timeCount + "----" + timeCount.length);

            this.initalCenterNum();
            timeCount--;

            if (timeCount == -1) {
                self.endTimer();
            }
        };

        pointUpdate = function pointUpdate() {
            var point;
            if (self.index == "1") {
                point = self.user1Point;
            }
            if (self.index == "2") {
                point = self.user2Point;
            }
            if (self.index == "3") {
                point = self.user3Point;
            }
            if (self.index == "4") {
                point = self.user4Point;
            }

            if (point.active == false) {
                point.active = true;
            } else {
                point.active = false;
            }
        };

        self.index = "1";
        //self.stratTimer();
    },
    initalCenterNum: function initalCenterNum() {
        var self = this;
        var ten = -1;
        var num = -1;
        if ((timeCount + "").length < 2) {
            ten = "0";
            num = timeCount + "";
        } else {
            ten = (timeCount + "").substring(0, 1);
            num = (timeCount + "").substring(1);
        }

        if (ten != -1) {
            ten = parseInt(ten);
        }
        if (num != -1) {
            num = parseInt(num);
        }

        var tenScript = self.tenPoint.getComponent(cc.Sprite);
        var numScript = self.numPoint.getComponent(cc.Sprite);

        tenScript.spriteFrame = self.numberSprite[ten];
        numScript.spriteFrame = self.numberSprite[num];
    },
    setNumerToZero: function setNumerToZero() {
        var self = this;
        var tenScript = self.tenPoint.getComponent(cc.Sprite);
        var numScript = self.numPoint.getComponent(cc.Sprite);

        tenScript.spriteFrame = self.numberSprite[0];
        numScript.spriteFrame = self.numberSprite[0];
    },

    hideAllQuePai: function hideAllQuePai() {
        this.user1Quepai.active = false;
        this.user2Quepai.active = false;
        this.user3Quepai.active = false;
        this.user4Quepai.active = false;
    },

    hideAllPoint: function hideAllPoint() {
        var self = this;
        self.user1Point.active = false;
        self.user2Point.active = false;
        self.user3Point.active = false;
        self.user4Point.active = false;
    },

    stratTimer: function stratTimer() {
        //timeCount = 10;
        var self = this;
        self.schedule(timerUpate, 1);
        self.schedule(pointUpdate, 0.5);
    },
    endTimer: function endTimer() {
        var self = this;
        self.unschedule(timerUpate);
        self.unschedule(pointUpdate);
        self.hideAllPoint();
    },

    showCenterPoint: function showCenterPoint() {
        var self = this;
        self.hideAllQuePai();
        self.hideAllPoint();
        timeCount = 30;
        this.initalCenterNum();
        this.centerPointNode.active = true;
        //this.centerPointNode.zIndex = 0;
        this.stratTimer();
        this.showQuePai();
        //intail user step for chupai

        Global.chuPaiActionType = "";
    },
    showQuePai: function showQuePai() {
        var userList2 = Global.userList;
        this.quePaiNode.active = true;

        for (var i = 0; i < userList2.length; i++) {

            var quepai = userList2[i].quePai;
            // cc.log("quepai0:" + userList2[i].quePai + "---" + userList2[i].openid);
            if (quepai != null && quepai != undefined) {
                quepai = parseInt(userList2[i].quePai);
                //  cc.log("quepai1:" + quepai.toString());
                var queScript = this.paiType[quepai - 1];
                var index = userList2[i].pointIndex;
                this.setQuePaiSpritFame(index, queScript);
            }
        }
    },
    setQuePaiSpritFame: function setQuePaiSpritFame(index, scpritFame) {
        // cc.log("setQuePaiSpritFame index:" + index);
        index = index + "";
        var sprit;
        if (index == "1") {
            sprit = this.user1Quepai.getComponent(cc.Sprite);
            this.user1Quepai.active = true;
            //  cc.log(" this.user1Quepai.active :" + this.user1Quepai.active);
        }
        if (index == "2") {
            sprit = this.user2Quepai.getComponent(cc.Sprite);
            this.user2Quepai.active = true;
            //cc.log(" this.user2Quepai.active :" + this.user2Quepai.active);
        }
        if (index == "3") {
            sprit = this.user3Quepai.getComponent(cc.Sprite);
            this.user3Quepai.active = true;
            //  cc.log(" this.user3Quepai.active :" + this.user3Quepai.active);
        }
        if (index == "4") {
            sprit = this.user4Quepai.getComponent(cc.Sprite);
            this.user4Quepai.active = true;
            //  cc.log(" this.user4Quepai.active :" + this.user4Quepai.active);
        }
        sprit.spriteFrame = scpritFame;
    }

});

cc._RFpop();
},{}],"tableMoPaiAction":[function(require,module,exports){
"use strict";
cc._RFpush(module, '85d20bwt4pI8py2x7WBW+Ft', 'tableMoPaiAction');
// script/ui/tableMoPaiAction.js

"use strict";

var tableActionScript;
var tableUserInfoScript;
var paiActionScript;
var tableUserPaiScript;
var audioScript;
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
        tableAction: cc.Node,
        liPaiPrefab: cc.Prefab,
        user3PaiListNode: cc.Node,
        tableUserInfo: cc.Node,
        paiActionNode: cc.Node,
        tableUserPaiNode: cc.Node,
        audioNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        audioScript = this.audioNode.getComponent("AudioMng");
        tableActionScript = this.tableAction.getComponent("tablePaiAction");
        tableUserInfoScript = this.tableUserInfo.getComponent("tableUserInfo");
        paiActionScript = this.paiActionNode.getComponent("paiAction");
        //tableUserPaiScript =this.tableUserPaiNode.getComponent("tablePaiAction");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    moPaiFromServer: function moPaiFromServer(userOpenId) {},
    moPaiTest: function moPaiTest() {
        this.moPaiAction("36", "testUser1");
    },

    moPaiOnDataLayer: function moPaiOnDataLayer(paiNumber, userOpenId) {
        //---data layer-----------------
        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userOpenId) {
                user = userList[i];
                //break;
            }
        }
        user.userMoPai = paiNumber;
        user = tableActionScript.insertMoPaiIntoPaiList(user);
        user = tableActionScript.synchronizationPaiList(user);
        cc.log("moPaiOnDataLayer mopai:" + user.userMoPai);
        this.updateUserListInGobal(user);
    },

    moPaiAction: function moPaiAction(paiNumber, userOpenId) {
        var paiList = tableActionScript.getSelfPaiList();

        cc.log("moPaiAction paiList:" + paiList.toString());
        cc.log("moPaiAction paiList len:" + paiList.length);
        var latstIndex = 0;
        if (paiList.length == 13) {
            latstIndex = 13;
        } else {
            latstIndex = paiList.length;
        }
        var paiNode = cc.instantiate(this.liPaiPrefab);
        var sprite = paiNode.getComponent(cc.Sprite);
        paiNode.name = "mopai" + latstIndex + "_" + paiNumber;

        var index = tableUserInfoScript.getCurrectIndeOnSeflPai(paiNumber);
        sprite.spriteFrame = tableUserInfoScript.liPaiZiMian[index];
        this.user3PaiListNode.addChild(paiNode);
        var startPoint = -520;
        if (paiList.length <= 10) {
            startPoint = parseInt(-520 + (10 - paiList.length) * 79 / 2);
        } else {}
        cc.log("moPaiAction startPoint:" + startPoint);
        //play audio
        audioScript.playMoPai();
        // cc.log("moPaiAction startPoint x:" + stxartPoint + latstIndex * 80);
        paiNode.position = cc.p(startPoint + latstIndex * 80, 0);

        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);

        tableActionScript.enabledAllPaiAfterQuePai(parentNode, false);
        Global.chuPaiActionType = "normalMoPai";
        //check if show gang action on this paiList
        // var paiCount = 0;
        // for (var i = 0; i < paiList.length; i++) {
        //     var pai = paiList[i] + "";
        //     pai = pai.trim();
        //     if (pai == paiNumber) {
        //         paiCount++
        //     }
        // }
        // if (paiCount == 3) {
        //     var actionArray = ['cancle', 'gang'];
        //     paiActionScript.fromUserOpenId = userOpenId;
        //     paiActionScript.paiNumber = paiNumber;
        //     paiActionScript.chuPaiUserOpenId = userOpenId;
        //     paiActionScript.showAction(actionArray);
        // }
        this.moPaiOnDataLayer(paiNumber, userOpenId);
        var actionArray = paiActionScript.getActionBarArrayByOpenId(paiNumber, userOpenId, "mopai");

        if (actionArray.length > 1) {
            paiActionScript.fromUserOpenId = userOpenId;
            paiActionScript.paiNumber = paiNumber;
            paiActionScript.chuPaiUserOpenId = userOpenId;
            paiActionScript.showAction(actionArray);

            tableActionScript.disableAllSlefPai();
        } else {}

        //we need update this into gobal user list
        //this.updateUserListInGobal(user);

    },

    updateUserListInGobal: function updateUserListInGobal(user) {
        var userList = Global.userList;

        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == user.openid) {
                userList[i] = user;
            }
        }
        Global.userList = userList;
    }

});

cc._RFpop();
},{}],"tableNetWork":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e15e652WSJJ+4yQ5yCC0PRa', 'tableNetWork');
// script/domainClass/tableNetWork.js

"use strict";

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
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RFpop();
},{}],"tablePaiAction":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ce6b2jbT71PzZaL7R+/rHKQ', 'tablePaiAction');
// script/ui/tablePaiAction.js

"use strict";

var paiListReOrderCount = "10";
var nodeMoveX = -1;
var nodeMoveY = -1;
var tableUserInfoScript;
var tableNetWorkScript;
var tableCenterTimmerScript;
var audioScript;
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
        audioNode: cc.Node
    },

    // use this for initialization
    //chuPaiActionType
    onLoad: function onLoad() {

        var tableUserInfo = cc.find("tableUserInfo");
        tableUserInfoScript = tableUserInfo.getComponent("tableUserInfo");
        var tableNwtWork = cc.find("tableNerWorkScript");
        tableNetWorkScript = tableNwtWork.getComponent("GameTableNetWork");
        var tableCenterTimmer = cc.find("tableCenterPointNode");
        tableCenterTimmerScript = tableCenterTimmer.getComponent("tableCenterPoint");
        var audioNode = cc.find("audioScript");
        audioScript = audioNode.getComponent("AudioMng");
    },

    setPaiListReOrderCount: function setPaiListReOrderCount(number) {
        paiListReOrderCount = number;
    },
    //----------Data layer utils function---------------------------------
    getCorrectIndexByNumber: function getCorrectIndexByNumber(paiNumber, user) {

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

    addPaiIntoPaiListNode: function addPaiIntoPaiListNode(userChuPaiListNode, name, userPoint, paiNode, type) {
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
        cc.loader.loadRes(paiPath, cc.SpriteFrame, function (err, sp) {
            if (err) {
                //  cc.log("----" + err.message || err);
                return;
            }
            // cc.log("85");


            sprite.spriteFrame = sp;

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
        paiNodeArray.push(name);
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
        var action;
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

        return user;
    },
    //-------------------game action-------------------------------
    slefChuPaiAction: function slefChuPaiAction(paiNumber) {
        var paiNode = cc.find("user3Node", this.tableNode);
        var children = paiNode.children;
        var selfPaiList = this.getSelfPaiList();
        var userInfo = Global.userInfo;
        var openid = userInfo.openid;
        //---data layer start--------
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var temp = childredName.split("_");
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
    testOtherChuPai: function testOtherChuPai() {
        this.playOtherChuPaiAction("22", "1");
        this.playOtherChuPaiAction("27", "2");
        this.playOtherChuPaiAction("27", "4");
        this.disableAllSlefPaiAfterQuePai();
    },
    testRmoveLast: function testRmoveLast() {
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
    playOtherChuPaiAction: function playOtherChuPaiAction(paiNumber, userPoint) {
        //var user = this.getCorrectUserByPoint(userPoint);
        var paiPath = this.getChuPaiNameByNodeName(paiNumber, userPoint);
        // var x = user.chupaiListX;
        //  var y = user.chupaiListY;
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + userPoint + "ChuaPaiListNode", tableNode);
        var userPaiList = cc.find("user" + userPoint + "PaiList", tableNode);
        var children = userPaiList.children;
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
    removeLastPaiOnPaiListByUserOpenId: function removeLastPaiOnPaiListByUserOpenId(openId) {
        cc.log("removeLastPaiOnPaiListByUser openid:" + openId);
        var user = this.getCorrectUserByOpenId(openId);
        var index = user.pointIndex;
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + index + "PaiList", tableNode);
        // var chuPaiListNode = cc.find("user" + index + "ChuaPaiListNode",this.tableNode);
        var children = userChuPaiListNode.children;
        var lastNode;
        var childrenLen = children.length;
        // cc.log("removeLastPaiOnPaiListByUser children1:" + userChuPaiListNode.children.length);
        // if (index == "2") {
        //     lastNode = children[0];
        // } else if (index == "1") {
        //     lastNode = children[childrenLen - 1];
        // } else if (index == "4") {
        //     lastNode = children[childrenLen - 1];
        // }

        for (var i = 0; i < children.length; i++) {
            // cc.log("removeLastPaiOnPaiListByUser lastNode:" + children[i].name);
            if (children[i].name == "autoMoPai") {
                lastNode = children[i];
            }
        }
        if (lastNode != null & lastNode != undefined) {
            lastNode.removeFromParent();
            //  cc.log("removeLastPaiOnPaiListByUser remove:" + lastNode.name);
        }

        // cc.log("removeLastPaiOnPaiListByUser children2:" + userChuPaiListNode.children.length);


        // var tableNode =this.tableNode;
        // cc.log("removeLastPaiOnPaiListByUser end");
    },
    removeLastPaiOnPaiListByUser: function removeLastPaiOnPaiListByUser(user) {
        var index = user.pointIndex;
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + index + "PaiList", tableNode);
        // var chuPaiListNode = cc.find("user" + index + "ChuaPaiListNode",this.tableNode);
        var children = userChuPaiListNode.children;
        var lastNode;
        var childrenLen = children.length;
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

    removeLastPaiOnChuPaiListByUserOpenId: function removeLastPaiOnChuPaiListByUserOpenId(userOpenid, paiNumber) {
        cc.log("removeLastPaiOnChuPaiListByUserOpenId:" + userOpenid);
        var user = this.getCorrectUserByOpenId(userOpenid);
        var index = user.pointIndex;
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + index + "ChuaPaiListNode", tableNode);
        // var chuPaiListNode = cc.find("user" + index + "ChuaPaiListNode",this.tableNode);
        cc.log("removeLastPaiOnChuPaiListByUserOpenId node:" + userChuPaiListNode.name);
        var children = userChuPaiListNode.children;
        var lastNode;

        for (var i = 0; i < children.length; i++) {
            lastNode = children[i];
        }
        if (lastNode != null & lastNode != undefined) {
            lastNode.removeFromParent();
            cc.log("removeLastPaiOnChuPaiListByUserOpenId remove:" + lastNode.name);
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
    playSlefChuPaiAction: function playSlefChuPaiAction(paiNode, userPoint) {
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
        var paiList = this.removeElementByNodeFromUser(paiNode, 1);
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

        return user.paiListArray;
    },

    /**
     * fix the point for self pai list
     */

    fixUserSelfPaiPoinst: function fixUserSelfPaiPoinst() {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var childrens = parentNode.children;
        var startPoint = -520;
        cc.log("264:" + childrens.length);
        for (var i = 0; i < childrens.length; i++) {
            var child = childrens[i];
            child.position = cc.p(startPoint + i * 79, 0);
            cc.log("ponit:" + i + ":" + (startPoint + i * 79) + "::" + child.name);
        }
    },

    playSlefInserterPaiAction: function playSlefInserterPaiAction(chupaiIndex, mopaiIndex) {
        //first we should decide if move the pai or not move 
        if (chupaiIndex == mopaiIndex) {} else if (chupaiIndex > mopaiIndex) {} else {
            //chupaiIndex<mopaiIndex

        }
    },
    moveOtherPaiIntoCorrectPoint: function moveOtherPaiIntoCorrectPoint(mopaiInsertIndex, chuPaiIndex) {

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
        var moveDistance = 0;

        if (mopaiInsertIndex > chuPaiIndex) {
            cc.log(">>>>>:");

            for (var i = chuPaiIndex + 1; i < mopaiInsertIndex; i++) {
                var node = children[i];
                var action = cc.moveTo(0.1, node.x - 84, node.y);
                node.runAction(action);
            }
            mopaiInsertIndex--;
        } else {
            cc.log("<<<<<<:");
            for (var i = chuPaiIndex - 1; i > mopaiInsertIndex - 1; i--) {
                var node = children[i];
                var action = cc.moveTo(0.1, node.x + 84, node.y);
                node.runAction(action);
            }
        }

        return mopaiInsertIndex;
    },
    /**
     * Move the latest pai in to correct position 
     */
    moveLastestPaiToPoint: function moveLastestPaiToPoint(index) {
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

    playSlefChuPaiAction_addChild: function playSlefChuPaiAction_addChild(target, pNodeArray) {
        var pNode = pNodeArray[0];
        var paiNode = pNodeArray[1];
        var parent = pNodeArray[2];
        var paiList = pNodeArray[3];
        var userOpenId = pNodeArray[4];
        var paiNumber = pNodeArray[5];
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

        audioScript.playChuPai(paiNumber);
    },
    playOtherChuPaiAction_addChild: function playOtherChuPaiAction_addChild(target, pNodeArray) {
        cc.log("playSlefChuPaiAction_addChild:");
        var pNode = pNodeArray[0];
        var paiNode = pNodeArray[1];
        var parent = pNodeArray[2];
        var paiList = pNodeArray[3];
        var userOpenId = pNodeArray[4];
        var paiNumber = pNodeArray[5];
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

        var user = this.getCorrectUserByOpenId(userOpenId);
        user.paiList = paiList;
        user.userMoPai = "";
        this.updateUserListInGobal(user);

        audioScript.playChuPai(paiNumber);
    },

    /**
     * 
     */

    updateUserListInGobal: function updateUserListInGobal(user) {
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

    fixCurrentChuPaiPoint: function fixCurrentChuPaiPoint(user) {
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
                user.chupaiListX = 186;
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
                user.chupaiListX = -186;
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
    getChuPaiNameByNodeName: function getChuPaiNameByNodeName(paiName, userIndex) {
        cc.log("getChuPaiNameByNodeName:" + paiName);
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
            firstPrefix = "tiao";
            backPrefix2 = "t";
        }
        if (type == "3") {
            firstPrefix = "wan";
            backPrefix2 = "w";
        }

        returnName = folderName + "/" + firstPrefix + backPrefix + "/" + number + backPrefix2;
        return returnName;
    },
    //-------------------game action end -------------------------------
    setUserPaiList: function setUserPaiList(openid, paiList) {
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
    getCorrectUserByOpenId: function getCorrectUserByOpenId(userOpenId) {

        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userOpenId) {
                user = userList[i];
            }
        }

        return user;
    },
    getCorrectUserByPoint: function getCorrectUserByPoint(pointIndex) {

        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].pointIndex == pointIndex) {
                user = userList[i];
            }
        }

        return user;
    },
    getSelfPaiList: function getSelfPaiList() {

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

    getQuePai: function getQuePai() {
        var quePai;
        var userList = Global.userList;
        var userInfo = Global.userInfo;
        quePai = userInfo.quePai;

        return quePai;
    },

    /**
     * This is chu pai action 
     */
    chuPaiAction: function chuPaiAction(event) {

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
                    node.runAction(action);
                    if (huanSanZhangPaiList == null || huanSanZhangPaiList == undefined) {
                        this.enabledAllSelfPai(parentNode);
                    } else {
                        huanSanZhangPaiList.splice(huanSanZhangPaiList.length - 1, 1);
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
                Global.gangFromUserOpenId = "";
                Global.gangHuPai = "";
            }
        }

        cc.log("huanSanZhangPaiList:" + huanSanZhangPaiList.toString());
    },

    getTypeByName: function getTypeByName(childredName) {
        var temp = childredName.split("_");
        var sType = temp[1];
        sType = sType.substring(0, 1);
        return sType;
    },

    putBackAllPaiExceptClickPai: function putBackAllPaiExceptClickPai(parentNode, clickPaiName) {
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
    onEnable: function onEnable() {
        cc.log("this node :" + this.node.name + "  enabled");
    },
    onDisable: function onDisable() {
        cc.log("this node :" + this.node.name + "  disabled");
    },
    throwActionForNode: function throwActionForNode(theNode) {
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
    disableAllSlefPai: function disableAllSlefPai() {
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
    disableAllSlefPaiAfterQuePai: function disableAllSlefPaiAfterQuePai() {
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
    enabledAllPaiAfterQuePai: function enabledAllPaiAfterQuePai() {
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
    enabledAllPai: function enabledAllPai(parentNode, autoGray) {
        var children = parentNode.children;
        for (var i = 0; i < children.length; ++i) {
            var btn = children[i].getComponent(cc.Button);
            if (autoGray != null && autoGray != undefined) {
                btn.enableAutoGrayEffect = autoGray;
            }

            btn.interactable = true;
        }
    },
    enabledSlefSelfPai: function enabledSlefSelfPai(parentNode, huanSanZhangPaiList) {
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
    enabledAllSelfPai: function enabledAllSelfPai(parentNode) {
        //  cc.log("enabledAllSelfPai");
        var v = this.getLess3NumberType(parentNode);
        var vstr = v.toString();
        //cc.log("vstr:" + vstr);
        var children = parentNode.children;
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var sType = this.getTypeByName(childredName);
            if (vstr.indexOf(sType) >= 0) {} else {
                var btn = children[i].getComponent(cc.Button);
                btn.interactable = true;
            }
        }
    },
    getLess3NumberType: function getLess3NumberType(parentNode) {
        var v1 = 0;
        var v2 = 0;
        var v3 = 0;
        var children = parentNode.children;
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var sType = this.getTypeByName(childredName);
            if (sType == "1") {
                v1++;
            }
            if (sType == "2") {
                v2++;
            }
            if (sType == "3") {
                v3++;
            }
        }

        var v = [];
        if (v1 < 3) {
            v.push("1");
        }
        if (v2 < 3) {
            v.push("2");
        }
        if (v3 < 3) {
            v.push("3");
        }
        return v;
    },
    disableAllSlefPaiExceptSelected: function disableAllSlefPaiExceptSelected(parentNode, node, huanSanZhangPaiList) {
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
    insertPaiIntoPaiListByPaiAndPaiList: function insertPaiIntoPaiListByPaiAndPaiList(paiNumber, paiList) {
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
                        cc.log("insertFlag pai:" + paiNumber);
                        temp.push(paiNumber);
                        insertFlag = true;
                    }
                } else {}
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

        return temp;
    },

    insertPaiIntoPaiListByPaiAndOpenId: function insertPaiIntoPaiListByPaiAndOpenId(paiNumber, userOpenId) {
        var currentUser = this.getCorrectUserByOpenId(userOpenId);
        var paiList = currentUser.paiListArray;
        var temp = this.insertPaiIntoPaiListByPaiAndPaiList(paiNumber, paiList);
        return temp;
    },
    insertMoPaiIntoPaiList: function insertMoPaiIntoPaiList(user) {
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
                            cc.log("insertFlag pai:" + moPai);
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

    synchronizationPaiList: function synchronizationPaiList(user) {

        var paiList = user.paiListArray;
        var temp = "";
        for (var i = 0; i < paiList.length; ++i) {
            temp = temp + paiList[i] + ",";
        }
        if (temp.length > 0) {
            temp = temp.substring(0, temp.length - 1);
        }
        user.paiList = temp;
        return user;
    },
    removeElementByNumberByPaiListFromUser: function removeElementByNumberByPaiListFromUser(paiList, paiNumber, b) {
        var c = 0;
        //  cc.log("1043:" + paiList.toString());
        //       cc.log("1043 paiNumber:" + paiNumber);
        //           cc.log("1043 paiNumber:" + this.contains(paiList, paiNumber));
        //              cc.log("1043: c" +c+"---b:"+b);
        while (this.contains(paiList, paiNumber) && c != b) {
            //cc.log("1044: c" +c+"---b:"+b);
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

        // scc.log("1056:" + paiList.toString());
        return paiList.sort(function (a, b) {
            return a - b;
        });
    },
    contains: function contains(array, obj) {
        var i = array.length;
        while (i--) {
            if (array[i] + "" === obj + "") {
                return true;
            }
        }
        return false;
    },
    removeElementByNumberFromUser: function removeElementByNumberFromUser(number, paiList, b) {
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

        return paiList.sort();
    },
    /**
     * remove a element from paiList of user self
     * b---remove element number.
     */
    removeElementByNodeFromUser: function removeElementByNodeFromUser(node, b) {
        var number = node.name;
        var c = 0;
        var temp = number.split("_");
        number = temp[1];
        var paiList = this.getSelfPaiList();
        this.removeElementByNumberFromUser(number, paiList, b);
        paiList.sort(function (a, b) {
            return a - b;
        });
        return paiList;
    },
    /**
     * Get self pai node by index
     */
    getPaiNodeByIndex: function getPaiNodeByIndex(index) {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var children = parentNode.children;
        if (index >= children.length) {
            index = children.length - 1;
        }
        cc.log("getPaiNodeByIndex:" + index);
        var childredNode = children[index];
        return childredNode;
    },
    /**
     * Get the point from self pai list by index 
     *
     */

    getPoinstByIndexFromSelfPaiList: function getPoinstByIndexFromSelfPaiList(index) {
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

    checkQuePaiInSelf: function checkQuePaiInSelf() {
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
                    existFlag = true;
                }
            }
            if (userMoPai != null && userMoPai != undefined && userMoPai != "") {
                var type2 = userMoPai + "";
                type2 = type2.trim();

                cc.log("checkQuePaiInSelf type2:" + type2[0] + ":");
                if (que == type2[0]) {
                    existFlag = true;
                }
            }
        }

        cc.log("checkQuePaiInSelf existFlag:" + existFlag);

        return existFlag;
    },
    removeAllNodeFromSelfPaiList: function removeAllNodeFromSelfPaiList() {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user3PaiList", tableNode);
        var count = parentNode.childrenCount;
        cc.log("parentNode: " + parentNode.name);
        cc.log("Node Children Count 1010: " + count);
        parentNode.removeAllChildren();
    },
    removeAllNodeFromOtherPaiList: function removeAllNodeFromOtherPaiList(point) {
        var tableNode = cc.find("Canvas/tableNode");
        var parentNode = cc.find("user" + point + "PaiList", tableNode);
        var count = parentNode.childrenCount;
        cc.log("parentNode: " + parentNode.name);
        cc.log("Node Children Count 1010: " + count);
        parentNode.removeAllChildren();
    },

    cleanAllPaiListForAllUser: function cleanAllPaiListForAllUser() {},
    /**
     * Get the correct index by the 14 pai 
     */
    getPaiInsertIndexBy14: function getPaiInsertIndexBy14() {
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
                        nextI = i;
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
    update: function update(dt) {
        // if (this.theMoveNode != null && this.theMoveNode != undefined) {
        //     cc.log("update this.theMoveNode.interactable:" + this.theMoveNode.interactable);
        //     if (this.theMoveNode.interactable == true || this.theMoveNode.interactable ==undefined) {
        //         cc.log("update:" + this.theMoveNode.name);
        //         if (nodeMoveX !=0 && nodeMoveY !=0) {


        //                   this.theMoveNode.setPosition(this.theMoveNode.x+nodeMoveX,this.theMoveNode.y+nodeMoveY);


        //         }

        //     }
        // }
    }
});

cc._RFpop();
},{}],"tableUserInfo":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c59a7pYHjxMiq1GOYNT7EOn', 'tableUserInfo');
// script/controllers/tableUserInfo.js

"use strict";

var huanPaiScript;
var tablePaiActionScript;
var iniMainScript;
var tableNetworkScript;
var iniIndexScript;
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

        quepaiNode: cc.Node,
        tableCenterPoint: cc.Node,
        huanPaiScriptNode: cc.Node,
        tablePaiActionNode: cc.Node,
        user1HuNode: cc.Node,
        user2HuNode: cc.Node,
        user3HuNode: cc.Node,
        user4HuNode: cc.Node,

        userScoreNode: cc.Node,
        userRoundScoreNode: cc.Node,
        iniMainNode: cc.Node,
        tableNetworkNode: cc.Node,
        indexNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        // this.userInfo1.active = false;
        // this.userInfo2.active = false;
        // this.userInfo3.active = false;
        // this.userInfo4.active = false;

        // this.initalUserPai("inital", "");
        this.userScoreNode.zIndex = 500;
        this.userRoundScoreNode.zIndex = 500;
        // this.disabledHuanSanZhangPai();
        huanPaiScript = this.huanPaiScriptNode.getComponent("huanPaiUI");
        tableNetworkScript = this.tableNetworkNode.getComponent("GameTableNetWork");
        iniIndexScript = this.indexNode.getComponent("iniIndex");
        //tablePaiActionScript =this.tablePaiActionNode.getComponent("tablePaiAction");
    },
    //this function only inital a gaobal user list for test 
    /**
     * chuPaiCount
     * user 1 chupai list point :x -210,y -45 
     * user 2 chupai list point :x -210,y -45
     * 
     */
    testInitalUserList: function testInitalUserList(initalType) {
        var paiList = ["11, 11, 13, 14, 14, 15, 16, 16, 17, 18, 19, 19, 19", "15, 15, 17, 18, 19, 22, 23, 24, 25, 26, 29, 29, 29", "15, 16, 17, 18, 19, 22, 23, 24, 26, 26, 26, 29, 29", "11, 12, 13, 24, 24, 24, 35, 35, 35, 36, 36, 36, 38"];
        this.tableNode.active = true;
        var userList = [];
        var userInfo = require("userInfoDomain").userInfoDomain;

        // iniMainScript=this.iniMainNode.getComponent("");
        for (var i = 1; i < 5; i++) {
            var o = new Object();
            o.id = i;
            o.nickName = "testUser" + i;
            o.headImageFileName = "testUser" + i + ".jpg";
            o.diamondsNumber = "30";
            o.country = "CN";
            o.openid = "testUser" + i;
            o.unionid = "testUser" + i;
            o.userCode = "testUser" + i;
            if (i != 1) {
                o.quePai = "3";
            }

            o.publicIp = "127.0.0.1";
            o.paiList = paiList[i - 1];
            o.gameReadyStatu = "1";
            o.gameScoreCount = "1";
            if (initalType == "test3") {
                o.pointIndex = i;
                o.userMoPai = "37";
                userInfo.openid = "testUser" + 3;
                userInfo.nickName = "testUser" + 3;
                if (i == 3) {
                    o.zhuang = "1";
                }
            } else if (initalType == "test2") {
                userInfo.openid = "testUser" + 2;
                userInfo.nickName = "testUser" + 2;
                if (i < 4) {
                    o.pointIndex = i + 1;
                } else {
                    o.pointIndex = 1;
                }
                if (i == 2) {
                    o.zhuang = "1";
                }
            } else if (initalType == "test1") {
                userInfo.nickName = "testUser" + 1;
                userInfo.openid = "testUser" + 1;
                if (i == 4) {
                    o.zhuang = "1";
                }
                if (i < 3) {
                    o.pointIndex = i + 2;
                } else if (i == 3) {
                    o.pointIndex = 1;
                } else if (i == 4) {
                    o.pointIndex = 2;
                }
            } else if (initalType == "test4") {
                userInfo.nickName = "testUser" + 4;
                userInfo.openid = "testUser" + 4;
                if (i == 4) {
                    o.zhuang = "1";
                }
                if (i == 1) {
                    o.pointIndex = 4;
                } else {
                    o.pointIndex = i - 1;
                }
            }
            //o.pointIndex = i;


            o.headImageFileName = "1";

            if (i == 0) {
                // o.zhuang = "1";
            } else {
                // o.zhuang = "0";
                if (i == 2) {
                    o.userMoPai = "22";
                }
            }

            userList.push(o);
        }
        var gameMode = require("gameMode").gameMode;

        gameMode.huanSanZhang = "1";
        Global.gameMode = gameMode;
        Global.userList = userList;
        Global.userInfo = userInfo;
        Global.chuPaiActionType = "normalChuPai";
        cc.log(" Global.userInfo:" + userInfo.toString());
        cc.log(" Global.userList:" + Global.userList.length);
        Global.joinRoomNumber = "585930";
        var roomNumber = Global.joinRoomNumber;
        cc.log("roomNumber:" + roomNumber);
        tableNetworkScript.connectByPrivateChanel();
        //tableNetworkScript.testJoinRoom(roomNumber);

    },
    cleanUserList: function cleanUserList() {
        var userList = Global.userList;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            user.gameReadyStatu = "";
            user.gameRoundScore = "";
            user.gameScoreCount = "";
            user.paiList = "";
            user.paiListArray = [];
            user.huanSanZhangPaiList = [];
            user.pengPaiList = [];
            user.gangExistUser = [];
            user.gangExistUserCache = [];
            user.gangFromUserListOpenId = [];
            user.gangPaiList = [];
            user.gangTypeList = [];
            user.pengGangPaiPoint = 0;
            user.quePai = "";
            user.chuPaiPointX = 0;
            user.chupaiListY = 0;
            user.chuPaiCount = 0;
            user.chuPaiPointX = 0;
            user.userMoPai = "";
            user.huPai = "";
            user.huPaiType = "";
            user.huPaiDetails = "";
            user.roundScoreCount = "";
            user.existUserString = "";
            user.huGangPai = "";
            user.huPaiFromUser = "";
            user.huChuPaiType = "";
            user.huPaiFanShu = 0;
            user.huGangShangHuaChuPaiUserOpenId = "";
            user.huGangPaiInOtherUserFromOpenId = "";
            user.tingJiao = "";
            user.maxFanShu = 0;
        }

        Global.userList = userList;

        //Add the round count

        //Global.gameRoundCount = Global.gameRoundCount + 1;
    },
    /**
     * Clean the table all node 
     */
    cleanTable: function cleanTable() {
        //tablePaiActionScript.removeAllNodeFromSelfPaiList();
        //tablePaiActionScript.removeAllNodeFromOtherPaiList();
        for (var i = 0; i < 4; i++) {
            var paiNode = cc.find("user" + (i + 1) + "PaiList", this.tableNode);
            paiNode.removeAllChildren();
            paiNode = cc.find("user" + (i + 1) + "PengPaiListNode", this.tableNode);
            paiNode.removeAllChildren();
            paiNode = cc.find("user" + (i + 1) + "ChuaPaiListNode", this.tableNode);
            paiNode.removeAllChildren();

            var huNode = cc.find("user" + (i + 1) + "HuPai", this.tableNode);
            var chilren = huNode.children;
            var moPaiNode = null;
            for (var j = 0; j < chilren.length; j++) {
                var node = chilren[j];
                if (node.name.indexOf("hupai") >= 0) {
                    moPaiNode = node;
                }
            }

            if (moPaiNode != null) {
                moPaiNode.removeFromParent();
            }
            huNode.active = false;
        }
    },

    testConnectRoom: function testConnectRoom() {
        tableNetworkScript.testJoinRoom("585930");
    },

    inistalTestUser1: function inistalTestUser1() {
        this.initalUserPai("test1", "");
        Global.chuPaiActionType = "normalChuPai";
    },
    inistalTestUser2: function inistalTestUser2() {
        this.initalUserPai("test2", "");
        Global.chuPaiActionType = "normalChuPai";
    },
    inistalTestUser3: function inistalTestUser3() {
        this.initalUserPai("test3", "");
        Global.chuPaiActionType = "normalChuPai";
    },
    inistalTestUser4: function inistalTestUser4() {
        this.initalUserPai("test4", "");
        Global.chuPaiActionType = "normalChuPai";
    },
    //type:inital 
    initalUserPai: function initalUserPai(initalType, type) {
        //inital the test data
        //**********Test */
        if (initalType != "inital") {}
        //this.testInitalUserList(initalType);


        //iniIndexScript.sendUserCode();
        //*********Test End */
        //  cc.log("Global.chuPaiActionType initalUserPai:" + Global.chuPaiActionType);
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
        //show table action list
        this.tableActionNode.active = true;
        //hide hu node 
        this.user1HuNode.active = false;
        this.user2HuNode.active = false;
        this.user3HuNode.active = false;
        this.user4HuNode.active = false;

        //cc.log("userList.length:"+userList.length);
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            cc.log("inital user zhuang:" + user.zhuang);
            cc.log("inital user openid:" + user.openid);
            //show current user node
            if (user.pointIndex != null && user.pointIndex != undefined) {
                cc.log(user.pointIndex);
                //fix user point
                if (user.pointIndex != "3") {
                    eval("this.userInfo" + user.pointIndex + ".active = true");
                    this.fixUserPointByIndex(user.pointIndex);
                    var userNodeName = "user" + user.pointIndex + "Node";
                    var userNode = cc.find(userNodeName, this.tableNode);
                    var userInfoNode = cc.find("userInfoNode", userNode);
                    var userZhuangSpriteNode = cc.find("userZhuangSprite", userInfoNode);
                    if (user.zhuang == "1") {
                        userZhuangSpriteNode.active = true;
                    } else {
                        userZhuangSpriteNode.active = false;
                    }
                } else {
                    eval("this.userInfo" + user.pointIndex + ".active = false");
                    var userSlefZhuangImageNode = cc.find("userselfZhuangSprite", this.tableNode);
                    if (user.zhuang == "1") {
                        userSlefZhuangImageNode.active = true;
                    } else {
                        userSlefZhuangImageNode.active = false;
                    }
                }

                var paiList = user.paiList;
                cc.log(user.pointIndex + ":" + paiList.toString());
                if (paiList != null && paiList != undefined) {
                    if (user.pointIndex + "" == "3") {
                        //inital self pai
                        cc.log("self user pai");
                        Global.chuPaiActionType = "huanSanZhang";
                        Global.huanSanZhangPaiList = [];
                        user.paiListArray = this.intalSelfPaiList(paiList);
                        user.chupaiListX = -210;
                        user.chupaiListY = -45;
                        user.chuPaiCount = 0;
                    } else {
                        user.paiListArray = this.initalOtherPaiList(paiList, user.pointIndex, initalType, "");
                        user = this.initalOtherUserChuPaiPoint(user, user.pointIndex + "");
                        //intal other user pai
                    }
                }
            }
        }

        //put back the user list to gobal

        Global.userList = userList;
        if (type != "joinExist") {
            //show huanPaiScript
            huanPaiScript.showHuanPaiNode();
        }
    },

    //inital other user chupai start point
    initalOtherUserChuPaiPoint: function initalOtherUserChuPaiPoint(user, point) {

        if (point == "1") {
            user.chupaiListX = 210;
            user.chupaiListY = -45;
        } else if (point == "2") {
            user.chupaiListX = 130;
            user.chupaiListY = 120;
        } else if (point == "4") {
            user.chupaiListX = -130;
            user.chupaiListY = -120;
        }
        user.chuPaiCount = 0;
        return user;
    },

    /**
     * 
     */
    getMinLenPaiListFromPai: function getMinLenPaiListFromPai(paiList) {
        cc.log("getMinLenPaiListFromPai:" + paiList.toString());
        var v1 = [];
        var v2 = [];
        var v3 = [];

        for (var i = 0; i < paiList.length; ++i) {
            var pai = paiList[i];
            var sType = pai + "";
            var sType = sType.substring(0, 1);
            if (sType == "1") {
                v1.push(pai);
            }
            if (sType == "2") {
                v2.push(pai);
            }
            if (sType == "3") {
                v3.push(pai);
            }
        }

        var resultArray = [v1.length, v2.length, v3.length];
        var resultArray2 = [v1, v2, v3];
        resultArray.sort();
        var l = 0;
        for (var i = 0; i < 3; i++) {
            if (resultArray[i] >= 3) {
                l = resultArray[i];
                break;
            }
        }
        var returnArray;
        for (var i = 0; i < 3; i++) {
            if (resultArray2[i].length == l) {
                returnArray = resultArray2[i];
                break;
            }
        }

        cc.log("getMinLenPaiListFromPai returnArray:" + returnArray.toString());

        for (var i = 0; i < 3; i++) {
            //    var paiName = "pai" + (i) + "_" + returnArray[i].trim();
            //     cc.log("getMinLenPaiListFromPai paiName:"+paiName);
            //    var paiNode=cc.find(paiName, this.user3PaiListNode);
            //    paiNode.y=20;
            Global.huanSanZhangPaiList.push(returnArray[i]);
        }

        return returnArray;
    },

    getTypeCount: function getTypeCount() {
        var children = this.user3PaiListNode.children;
        var v1 = 0;
        var v2 = 0;
        var v3 = 0;
        var typecount = 0;
        var ownType = "";
        var returnArray = [];
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var temp = childredName.split("_");
            var sType = temp[1];
            var sType = sType.substring(0, 1);
            if (sType == "1") {
                v1++;
            }
            if (sType == "2") {
                v2++;
            }
            if (sType == "3") {
                v3++;
            }
        }

        if (v1 > 0) {
            typecount++;
            ownType = ownType + "1";
        }
        if (v2 > 0) {
            typecount++;
            ownType = ownType + "2";
        }
        if (v3 > 0) {
            typecount++;
            ownType = ownType + "3";
        }

        returnArray.push(typecount);
        returnArray.push(ownType);
        return returnArray;
    },
    /**
     * Get 
     */
    getLess3NumberType: function getLess3NumberType(parentNode) {
        var v1 = 0;
        var v2 = 0;
        var v3 = 0;
        var children = parentNode.children;
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var temp = childredName.split("_");
            var sType = temp[1];
            var sType = sType.substring(0, 1);
            if (sType == "1") {
                v1++;
            }
            if (sType == "2") {
                v2++;
            }
            if (sType == "3") {
                v3++;
            }
        }

        var v = [];
        if (v1 < 3) {
            v.push("1");
        }
        if (v2 < 3) {
            v.push("2");
        }
        if (v3 < 3) {
            v.push("3");
        }
        return v;
    },
    disableAllPai: function disableAllPai() {
        var children = this.user3PaiListNode.children;
        for (var i = 0; i < children.length; ++i) {
            var btn = children[i].getComponent(cc.Button);
            btn.interactable = false;
        }
    },
    disabledQuePai: function disabledQuePai() {
        var userList = Global.userList;
        var userInfo = Global.userInfo;
        var quePai = "";
        var paiList;
        var existFlag = false;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userInfo.openid) {
                quePai = userList[i].quePai;
                paiList = userList[i].paiListArray;
            }
        }

        if (paiList != null) {
            if (quePai != null && quePai.length > 0) {
                for (var i = 0; i < paiList.length; ++i) {
                    var sType = paiList[i].trim() + "";
                    sType = sType.substring(0, 1);
                    if (sType == quePai) {
                        existFlag = true;
                    }
                }
            }
        }

        if (existFlag) {
            var children = this.user3PaiListNode.children;
            for (var i = 0; i < children.length; ++i) {
                var childredName = children[i].name;
                var temp = childredName.split("_");
                var sType = temp[1];
                sType = sType.substring(0, 1);
                if (sType != quePai) {
                    var btn = children[i].getComponent(cc.Button);
                    btn.interactable = false;
                }
            }
        }
    },

    getSlefUser: function getSlefUser() {
        var gobalUser = Global.userInfo;
        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == gobalUser.openid) {
                user = userList[i];
            }
        }

        return user;
    },
    //Force select san zhang pai after the timer end 

    forceFillHuanSanZhangList: function forceFillHuanSanZhangList() {
        var paiList = this.getSlefUser().paiListArray;
        this.getMinLenPaiListFromPai(paiList);
    },

    //when huan san zhang work, this will disabled less 3 number pai
    disabledHuanSanZhangPai: function disabledHuanSanZhangPai() {

        var children = this.user3PaiListNode.children;
        var v = this.getLess3NumberType(this.user3PaiListNode);
        var vstr = v.toString();
        for (var i = 0; i < children.length; ++i) {
            var childredName = children[i].name;
            var temp = childredName.split("_");
            var sType = temp[1];
            sType = sType.substring(0, 1);
            if (vstr.indexOf(sType) >= 0) {
                var btn = children[i].getComponent(cc.Button);
                btn.interactable = false;
            }
        }
    },
    getCorrectUserByPoint: function getCorrectUserByPoint(pointIndex) {

        var userList = Global.userList;
        var user;
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].pointIndex == pointIndex) {
                user = userList[i];
            }
        }

        return user;
    },
    testAddOne: function testAddOne() {
        var paiList = [15, 17, 18, 22, 22, 23, 29, 29, 29, 33, 36, 37, 39];
        this.initalOtherPaiListOnePai("11", paiList, "1", "");
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user2PaiList", tableNode);
        // var chuPaiListNode = cc.find("user" + index + "ChuaPaiListNode",this.tableNode);
        var children = userChuPaiListNode.children;
        cc.log("testAddOne:" + children.length);
    },
    /**
     * Only add one pai into last position.
     */
    initalOtherPaiListOnePai: function initalOtherPaiListOnePai(paiNumber, paiArray, point, iniType) {
        // var paiArray = paiList.split(",");
        var startX = 0;
        var startY = 0;
        cc.log("********initalOtherPaiListOnePai:" + paiArray.toString() + "----" + point);
        var currentUser = this.getCorrectUserByPoint(point);
        var tableNode = cc.find("Canvas/tableNode");
        var userChuPaiListNode = cc.find("user" + point + "PaiList", tableNode);

        var chirenLen = userChuPaiListNode.children.length;
        cc.log("********initalOtherPaiListOnePai 1:" + chirenLen + "----" + point);

        var firstNode = userChuPaiListNode.children[0];
        var lastNode = userChuPaiListNode.children[chirenLen - 1];
        cc.log("firstNode x:" + firstNode.x + "-" + firstNode.y);
        var pengList = currentUser.pengPaiList;
        var gangList = currentUser.gangPaiList;
        var pengLength = 0;
        if (pengList == null || pengList == undefined) {} else {
            pengLength = pengList.length;
        }
        var gangLength = 0;
        if (gangList == null || gangList == undefined) {} else {
            gangLength = gangLength.length;
        }
        var i = paiArray.length;
        cc.log("i:" + i);
        // for (var i = 0; i < paiArray.length; i++) {
        if (paiNumber != null && paiNumber != undefined) {
            if (paiNumber != "") {
                paiNumber = paiNumber + "";
                var paiNode;
                var sprite;
                paiNode = cc.instantiate(this.backNode);
                paiNode.name = "pai" + (chirenLen + 1) + "_" + paiNumber.trim();
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

                userChuPaiListNode.addChild(paiNode);
                //eval("this.user" + point + "PaiListNode.addChild(paiNode)");
                //fix the user 1
                if (point == "1") {
                    startX = 380;
                    paiNode.rotation = 180;
                    paiNode.position = cc.p(lastNode.x - 55, 0);
                    //this.user1PaiListNode.addChild(paiNode);
                }

                if (point == "2") {

                    paiNode.position = cc.p(firstNode.x, firstNode.y + 28);
                    paiNode.zIndex = paiArray.length - chirenLen;
                    paiNode.width = 40;
                    paiNode.height = 85;
                    //parentNode
                }

                if (point == "4") {

                    paiNode.position = cc.p(firstNode.x, firstNode.y + 28);
                    paiNode.zIndex = paiArray.length - chirenLen - 1;
                    paiNode.width = 40;
                    paiNode.height = 85;
                }

                paiNode.name = "autoMoPai";

                cc.log("add one:" + paiNode.active + "----" + paiNode.x + ":" + paiNode.y) + "---z:" + paiNode.zIndex;
            }
        }
        //}
        chirenLen = userChuPaiListNode.children.length;
        cc.log("********initalOtherPaiListOnePai 2:" + chirenLen + "----" + point);

        return paiArray;
    },
    initalOtherPaiList: function initalOtherPaiList(paiList, point, iniType, endPoint) {
        var paiArray = paiList.split(",");
        var startX = 0;
        var startY = 0;
        cc.log("********initalOtherPaiList:" + paiList + "----" + point);
        //eval("this.user" + point + "PaiListNode.removeAllChildren()");
        var currentUser = this.getCorrectUserByPoint(point);
        var pengList = currentUser.pengPaiList;
        var gangList = currentUser.gangPaiList;
        var pengLength = 0;
        if (pengList == null || pengList == undefined) {} else {
            pengLength = pengList.length;
        }
        var gangLength = 0;
        if (gangList == null || gangList == undefined) {} else {
            gangLength = gangLength.length;
        }
        for (var i = 0; i < paiArray.length; i++) {
            if (paiArray[i] != null && paiArray[i] != undefined) {
                if (paiArray[i] != "") {
                    var paiNode;
                    var sprite;
                    paiNode = cc.instantiate(this.backNode);
                    paiNode.name = "pai" + i + "_" + paiArray[i].trim();
                    sprite = paiNode.getComponent(cc.Sprite);
                    if (point == "1") {

                        sprite.spriteFrame = this.backPai;
                        //this.user1PaiListNode.addChild(paiNode);
                    } else {

                        if (point == "2") {
                            sprite.spriteFrame = this.cePaiLeft;
                            //this.user2PaiListNode.addChild(paiNode);
                        } else {
                            sprite.spriteFrame = this.cePai;
                            // this.user4PaiListNode.addChild(paiNode);
                        }
                    }

                    eval("this.user" + point + "PaiListNode.addChild(paiNode)");
                    //fix the user 1
                    cc.log("info endPoint:" + endPoint + ":" + point);
                    if (point == "1") {
                        //startX = 380;
                        if (endPoint != null && endPoint != undefined && endPoint + "" != "") {
                            startX = endPoint + paiArray.length * 55 - 110;
                        } else {
                            startX = 380;
                        }
                        paiNode.rotation = 180;
                        paiNode.position = cc.p(startX - i * 55, 0);
                        //this.user1PaiListNode.addChild(paiNode);
                    }

                    if (point == "2") {
                        startX = 0;

                        if (endPoint != null && endPoint != undefined && endPoint + "" != "") {
                            startY = endPoint + paiArray.length * 28 + 28;
                        } else {
                            startY = 180;
                        }
                        // if (pengLength > 0 || gangLength > 0) {
                        //     startY = -180 + (pengLength * 115 + gangLength * 115);
                        //     //if (startY >= 240) {
                        //         startY = 260
                        //     //}
                        // } else {
                        //     startY = 180;
                        // }
                        //fix the start point the pai length
                        //if()

                        paiNode.position = cc.p(startX, startY - i * 28);
                        //paiNode.zIndex = paiArray.length - i;
                        paiNode.zIndex = paiArray.length + i;
                        paiNode.width = 40;
                        paiNode.height = 85;
                        //parentNode
                    }

                    if (point == "4") {
                        startX = 0;
                        // if (pengLength > 0 || gangLength > 0) {
                        //     startY = -210;
                        // } else {
                        //     startY = -180;
                        // }
                        if (endPoint != null && endPoint != undefined && endPoint + "" != "") {
                            startY = endPoint - paiArray.length * 28 + 84;
                        } else {
                            startY = -180;
                        }

                        paiNode.position = cc.p(startX, startY + i * 28);
                        paiNode.zIndex = paiArray.length - i;
                        //paiNode.setLocalZOrder(1000 - i);
                        // paiNode.siblingIndex = 1000 - i;
                        paiNode.width = 40;
                        paiNode.height = 85;
                    }

                    cc.log(point + ":" + paiNode.x + "-" + paiNode.y);
                }
            }
        }

        if (point == "4") {
            eval("this.user" + point + "PaiListNode.zIndex=140");
            eval("this.user" + point + "PaiListNode.setLocalZOrder(140)");
            //  cc.log("4 inital zindex:" + paiNode.zIndex);
            //  cc.log("4 inital setLocalZOrder:" + paiNode.getLocalZOrder());
        }
        if (point == "2") {
            eval("this.user" + point + "PaiListNode.zIndex=120");
            eval("this.user" + point + "PaiListNode.setLocalZOrder(120)");
            // cc.log("4 inital zindex:" + paiNode.zIndex);
            // cc.log("4 inital setLocalZOrder:" + paiNode.getLocalZOrder());
        }

        return paiArray;
    },
    intalSelfPaiList: function intalSelfPaiList(paiList) {

        var startPoint = -520;
        // we need fix the startPoint By pai number 
        var paiArray = paiList.split(",");
        if (paiArray.length <= 10) {
            startPoint = parseInt(-520 + (10 - paiArray.length) * 79 / 2);
        }
        for (var i = 0; i < paiArray.length; i++) {
            if (paiArray[i] != null && paiArray[i] != undefined) {
                var paiNode = cc.instantiate(this.liPaiPrefab);
                var btn = paiNode.getComponent(cc.Button);

                var sprite = paiNode.getComponent(cc.Sprite);
                paiNode.name = "pai" + i + "_" + paiArray[i].trim();
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
                sprite.spriteFrame = this.liPaiZiMian[index];
                this.user3PaiListNode.addChild(paiNode);
                if (i == 13) {
                    paiNode.position = cc.p(startPoint + i * 80, 0);
                    paiNode.name = "mopai_" + paiArray[i].trim();
                } else {
                    paiNode.position = cc.p(startPoint + i * 79, 0);
                }

                paiNode.setLocalZOrder(200);
                paiNode.zIndex = 200;
            }
        }

        if (this.user3PaiListNode.active == false) {
            this.user3PaiListNode.active = true;
            this.user3PaiListNode.setLocalZOrder(200);
            this.user3PaiListNode.zIndex = 200;
        }

        return paiArray;
    },

    getCurrectIndeOnSeflPai: function getCurrectIndeOnSeflPai(pai) {
        pai = (pai + "").trim();
        var type = (pai + "").substring(0, 1);
        var paiNum = (pai + "").substring(1);
        //tong 11-19
        //tiao 21-29
        //wan  31-39
        var index = -1;

        if (type == "1") {
            index = parseInt(paiNum) - 1;
        }

        if (type == "2") {
            index = parseInt(paiNum) + 8;
        }

        if (type == "3") {
            index = parseInt(paiNum) + 17;
        }

        return index;
    },

    getCorrectNameOnSelfPai: function getCorrectNameOnSelfPai(pai) {
        pai = (pai + "").trim();
        cc.log("img1:" + pai + "--" + pai.length);
        var type = (pai + "").substring(0, 1);
        var paiNum = (pai + "").substring(1);
        var prefix = "";
        var path = "";

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

    resetUserPoint: function resetUserPoint() {

        for (var i = 1; i < 5; i++) {

            if (i == 1) {
                this.userInfo1.x = 0;
                this.userInfo1.y = 345;
            }
            if (i == 2) {
                this.userInfo2.x = -607;
                this.userInfo2.y = 175;
            }
            if (i == 3) {
                this.userInfo3.x = 0;
                this.userInfo3.y = -75;
            }
            if (i == 4) {
                this.userInfo4.x = 547;
                this.userInfo4.y = 175;
            }
        }
    },

    fixUserPointByIndex: function fixUserPointByIndex(index) {
        index = index + "";
        if (index == "1") {
            cc.log("this.userInfo1 x:" + this.userInfo1.x);
            cc.log("this.userInfo1 y:" + this.userInfo1.y);
            var widget = this.userInfo1.getComponent(cc.Widget);
            widget.top = -40;
            // widget.isAlignRight = true;
            // widget.right = 210;
            //this.userInfo1.y=-20;
            cc.log("fixUserPointByIndex 1:" + this.userInfo1.y);
            //this.userInfo1.y =410;
            this.userInfo1.x = -600;
            //this.userInfo1.y = 0;
        }
        if (index == "2") {
            var widget = this.userInfo2.getComponent(cc.Widget);
            widget.top = 0;
            //widget.left = 60;
            this.userInfo2.x = -607;
            //  this.userInfo2.y = 0;
        }
        cc.log("fixUserPointByIndex:" + index);
        if (index == "4") {
            var widget = this.userInfo4.getComponent(cc.Widget);
            widget.isAlignRight = true;
            widget.right = 60;
            //this.userInfo4.x = 607;
            cc.log("fixUserPointByIndex:" + this.userInfo4.x);
        }
    },

    intalUserInfoReadyIcon: function intalUserInfoReadyIcon() {

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

    initalUserOnRound: function initalUserOnRound() {
        this.userInfo3.active = true;
        this.user1ReadNode.active = true;
        this.user2ReadNode.active = true;
        this.user3ReadNode.active = true;
        this.user4ReadNode.active = true;
        this.resetUserPoint();
        this.intalUserInfoReadyIcon();
    },

    initalUserInfoFromGobalList: function initalUserInfoFromGobalList() {
        //hide  table  pai starting 
        this.quepaiNode.active = false;
        this.tableCenterPoint.active = false;

        var numberOrder = [3, 4, 1, 2];
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
                    numberOrder = [3, 4, 2];
                }

                if (gamePeople == "2") {
                    numberOrder = [3, 1];
                }
            }
            if (index == 1) {
                if (gamePeople == "4") {
                    numberOrder = [2, 3, 4, 1];
                }
                if (gamePeople == "3") {
                    numberOrder = [2, 3, 4];
                }
                if (gamePeople == "2") {
                    numberOrder = [1, 3];
                }
            }
            if (index == 2) {
                if (gamePeople == "4") {
                    numberOrder = [1, 2, 3, 4];
                }
                if (gamePeople == "3") {
                    numberOrder = [4, 2, 3];
                }
            }
            if (index == 3) {
                if (gamePeople == "4") {
                    numberOrder = [4, 1, 2, 3];
                }
                if (gamePeople == "3") {
                    numberOrder = [4, 2, 3];
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

cc._RFpop();
},{"gameMode":"gameMode","userInfoDomain":"userInfoDomain"}],"userInfoDomain":[function(require,module,exports){
"use strict";
cc._RFpush(module, '038b1LD8sdAoKFXcy5K0flN', 'userInfoDomain');
// script/domainClass/userInfoDomain.js

"use strict";

var userInfoDomain = { id: 25,
  agentLevel: 0,
  city: "",
  country: "",
  diamondsNumber: 0,
  gameCount: 0,
  headimgurl: "",
  nickName: "",
  openid: "",
  province: "",
  sex: 1,
  unionid: "",
  userCode: "",
  userType: "",
  winCount: 0,
  //userGameingStatu:"",
  publicIPAddress: "",
  roomNumber: "",
  paiList: "",
  gameReadyStatu: "",
  gameRoundScore: "",
  gameScoreCount: "",
  headImageFileName: "",
  webChatUserCode: ""
};
module.exports = {
  userInfoDomain: userInfoDomain
};

cc._RFpop();
},{}],"userScoreCount":[function(require,module,exports){
"use strict";
cc._RFpush(module, '887e1Ms7B1MIo9IQTnzUeus', 'userScoreCount');
// script/ui/userScoreCount.js

"use strict";

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

        userRoundCountNode: cc.Node,
        userEndCountNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {},
    countEachUserScoreForEachRound: function countEachUserScoreForEachRound() {
        var userList = Global.userList;
    }

});

cc._RFpop();
},{}],"webSokectMessage":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6e1ebTV0H1GkZpfFnVA900C', 'webSokectMessage');
// script/service/webSokectMessage.js

"use strict";

//var stomp=require('stomp');
var client;
var privateClient;
var userInfo;
var serverUrl;
var socket;
//Websokect only work on the sence ,when the switch sence ,the websokect will be lost,we should keep the websokect on one sence
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
        // ...http://cn.bing.com/
        testLabel: cc.Label,
        scriptNode: cc.Node,
        mainMenu: cc.Node,
        index: cc.Node,
        gameActionList: cc.Node

    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        self.gameStop();
        //cc.game.addPersistRootNode(self.scriptNode);

        serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        if (Global.userInfo == null || Global.userInfo == undefined) {
            var userInfo = require("userInfoDomain").userInfoDomain;
            //window.io = SocketIO.connect;
            //var p2psocket =  window.io.connect("");
            //var p2p = new P2P(p2psocket);
            // console.log("io instals");
            //var shaObj = new jsSHA("SHA-1", "TEXT");
            //shaObj.update("This is a test");
            // var hash = shaObj.getHash("HEX");
            // console.log("hash sha1:"+hash);
            //if (cc.sys.isNative) {
            socket = new SockJS(serverUrl + "/stomp");
            //} else {
            //  socket = new SockWebJS(serverUrl + "/stomp");
            //}
            //io.connect
            //var socket=window.io('http://localhost:8080/stomp');
            //var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
            //var path = '/stomp';
            // var socket = window.io.connect('http://localhost:8080/stomp');
            console.log("conect to server");
            client = Stomp.over(socket);
            //open a chanle to list login message from server 
            client.connect({}, function () {
                client.subscribe("/queue/pusmicGamePushLoginUserInfoChanle", function (message) {
                    var bodyStr = message.body;
                    var obj = JSON.parse(bodyStr);
                    if (obj != undefined && obj != null) {
                        for (var p in obj) {
                            userInfo[p] = obj[p];
                        }
                        console.log("userInfo.nickname:" + userInfo.nickName);
                        Global.userInfo = userInfo;
                        //update the user public ip from url call
                        self.updateUserIP(userInfo.id);
                        //
                        //self.initalPrivateChanleForUser(userInfo.roomNumber);

                        //user login success ,go to game main sence
                        //cc.director.loadScene('table');
                        this.index.active = false;
                        this.mainMenu.active = true;
                    } else {

                        console.log("No found correct user info return from server ,please check .");
                    }

                    //self.testLabel.string = message.body;
                    //$("#helloDiv").append(message.body);

                    //cc.director.loadScene('gameMain2');
                }, function () {
                    cc.log("websocket connect subscribe Error:233");
                    //client.disconnect();
                });
            }, function () {
                cc.log("websocket connect  Error:234");
                //client.disconnect();
            });

            //----------------
        } else {
            //Gobal userInfo already get the value ,drictly to to gameMain2
            cc.director.loadScene('table');
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    sendWebSokectMessageToServer: function sendWebSokectMessageToServer() {
        var o = new Object();
        o.token = "test word";
        client.send("/app/resiveAllUserChanle", {}, JSON.stringify(o));
    },
    //send webchat opnunid to server to login user
    loginUserToServerByToken: function loginUserToServerByToken() {
        var o = new Object();
        o.token = "test word";
        client.send("/app/pusmicGameLoginUserChanle", {}, JSON.stringify(o));
    },
    //open user ip login url
    updateUserIP: function updateUserIP(id) {
        var xhr = new XMLHttpRequest();
        var url = serverUrl + "/user/getLoginUserIP?userId=" + id;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                Global.userInfo.publicIPAddress = response;
                cc.director.loadScene('table');
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },

    //-----------------------------------------------------------------------------
    onDestroy: function onDestroy() {
        //colse the websokect
        client.disconnect();
    },
    //----------------------inital private chanle----------------------------------
    // initalPrivateChanleForUser: function (roomNumber) {
    //     cc.log("roomNumber:"+roomNumber);
    //     privateClient = Stomp.over(socket);

    //         privateClient.connect({}, function () {
    //             privateClient.subscribe("/queue/privateRoomChanle" + roomNumber, function (message) {
    //                 var bodyStr = message.body;
    //                 cc.log("get meesge from private chanle:privateRoomChanle"+roomNumber);
    //             });
    //         },function(){
    //              cc.log("connect private chanle error !");
    //         });

    // privateClientChanle
    // },
    //----------------------game stop-----------------------------------------------
    gameStop: function gameStop() {
        cc.game.onStop = function () {
            cc.log("stopApp");
        };
    },
    //-----------------------websokect error callback--------------------------------
    error_callback: function error_callback(error) {
        // display the error's message header:
        cc.log("Self Error:" + error);
    }

});

cc._RFpop();
},{"userInfoDomain":"userInfoDomain"}],"webchatService":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cb2d8IGu3JNbqH2Jm3q8A4u', 'webchatService');
// script/service/webchatService.js

'use strict';

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
    },

    // use this for initialization
    onLoad: function onLoad() {},

    sendMessageToWebChat: function sendMessageToWebChat() {

        if (cc.sys.os == cc.sys.OS_IOS) {
            var isinstall = jsb.reflection.callStaticMethod('WXApiManager', 'sendMessageToFriend:title:', "这是一个测试", "");
        }
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sendApplicatoinMessage", "roomnumber");
        }
    }

});

cc._RFpop();
},{}]},{},["AudioMessage","AudioMng","PlayBgm","GameModeActionScript","GameModeOptionController","GameTableController","InitalGameMain","JoinRoomController","SwitchScene","gameConfigButtonListAction","gameConfigController","loginScript","publicMessageController","tableActionController","tableUserInfo","Global","actionMesageDomain","gameConfigSetting","gameMode","gameStep","gameUser","messageDomain","tableNetWork","userInfoDomain","caCheScript","GameTableNetWork","GameTableRoom","NewScript","PersistRootNode","iniGameTable","iniIndex","onlineUserCheck","webSokectMessage","webchatService","ButtonScaler","DataTime","HuPaiAction","alertMessagePanle","gameConfig","huanPaiUI","messageUI","normalTimerScript","paiAction","quepaiScript","roundScoreUI","showGameMode","tableCenterPoint","tableMoPaiAction","tablePaiAction","userScoreCount"]);
