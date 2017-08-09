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
        musicNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        alertMessageUI = this.alertMessageNode.getComponent("alertMessagePanle");
        //this.initalGameConfig();
        musicScript=this.musicNode.getComponent("AudioMng");
    },

    togglerClick: function (event) {
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
                gameConfigSetting.musicEffect = "1"
            } else {
                gameConfigSetting.musicEffect = "0"
            }

        }

        if (parent.name == "musicToggle") {
            if (toggle.isChecked) {
                gameConfigSetting.music = "1"
                musicScript.playMusic();
            } else {
                gameConfigSetting.music = "0"
                musicScript.stopMusic();
            }
        }

        if (parent.name == "publicIpToggle") {
            if (toggle.isChecked) {
                gameConfigSetting.publicIpLimit = "1"
            } else {
                gameConfigSetting.publicIpLimit = "0"
            }
        }



        cc.log(JSON.stringify(Global.gameConfigSetting));
    },

    editBoxChange: function () {

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

    initalGameConfig: function () {
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

        cc.log("initalGameConfig:" + (gameConfigSetting) + ":");
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
