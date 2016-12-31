
var boyBtn = null;
var grilBtn = null;
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
        alertMessageNode: cc.Node
    },

    // use this for initialization
    onLoad: function () {

        grilBtn = this.mainMenuGrailBtn.getComponent(cc.Button);
        boyBtn = this.mainMenuBoyBtn.getComponent(cc.Button);

    },

    enterMainEntry: function () {
        this.indexNode.active = false;
        this.mainMenuNode.active = true;
        grilBtn.enabled = true;
        boyBtn.enabled = true;
    },
    showGameConfig: function () {
        this.gameConfigNode.active = true;

        boyBtn.enabled = false;
        grilBtn.enabled = false;
    },
    closeGameConfig: function () {
        this.gameConfigNode.active = false;
        boyBtn.enabled = true;
        grilBtn.enabled = true;

    },
    showGameModePanel: function () {
        this.gameModeNode.active = true;
        boyBtn.enabled = false;
        grilBtn.enabled = false;

    },
    closeGameModePanel: function () {
        this.gameModeNode.active = false;
        boyBtn.enabled = true;
        grilBtn.enabled = true;
    },

    existGame: function () {
        cc.game.end()
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
