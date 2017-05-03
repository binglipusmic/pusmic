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
        paiAudiolistWomenAction: [cc.AudioClip],
    },

    // use this for initialization
    onLoad: function () {

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

    playMusic: function () {
        gameConfigSetting = Global.gameConfigSetting;
        if (gameConfigSetting.music == "1") {
            cc.audioEngine.playMusic(this.bgm, true);
        }

    },
    stopMusic: function () {
        cc.audioEngine.stopMusic();
    },

    pauseMusic: function () {
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function () {
        cc.audioEngine.resumeMusic();
    },

    _playSFX: function (clip) {
        cc.audioEngine.playEffect(clip, false);
    },

    playWin: function () {
        this._playSFX(this.winAudio);
    },

    playLose: function () {
        this._playSFX(this.loseAudio);
    },

    playCard: function () {
        this._playSFX(this.cardAudio);
    },

    playChips: function () {
        this._playSFX(this.chipsAudio);
    },

    playButton: function () {
        this._playSFX(this.buttonAudio);
    },
    playChuPai: function (paiNum) {
        //musicEffect
        gameConfigSetting = Global.gameConfigSetting;
        if (gameConfigSetting.musicEffect == "1") {
            //pai effect
            var userInfo = Global.userInfo;
            var soundPai;
            var soundList = [];
            if (userInfo.sex + "" == "49") {
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
                var k = Math.floor(Math.random() * (soundList.length));
                cc.log("soundList k:" + k);
                this._playSFX(soundList[k]);
                this._playSFX(this.chuPai);
            }


        }

    },
    playMoPai: function () {
        gameConfigSetting = Global.gameConfigSetting;
        if (gameConfigSetting.musicEffect == "1") {
            this._playSFX(this.moPai);
        }

    },
    playAction: function (actionName) {
        if (actionName == "zimo") {
            actionName = "hu1";
        }

        if (actionName == "hu") {
        }

        gameConfigSetting = Global.gameConfigSetting;
        if (gameConfigSetting.musicEffect == "1") {
            //pai effect
            var userInfo = Global.userInfo;
            var soundPai;
            var soundList = [];
            if (userInfo.sex + "" == "49") {
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
                var k = Math.floor(Math.random() * (soundList.length));
                cc.log("soundList k:" + k);
                this._playSFX(soundList[k]);
                //this._playSFX(this.chuPai);
            }


        }

    }



});
