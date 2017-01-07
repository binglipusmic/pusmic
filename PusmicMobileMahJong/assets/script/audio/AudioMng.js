var gameConfigSetting
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
        }
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
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    playMusic: function () {
         gameConfigSetting= Global.gameConfigSetting;
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
    }
});
