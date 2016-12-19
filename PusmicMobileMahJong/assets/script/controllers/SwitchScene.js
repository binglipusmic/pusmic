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
        },

    },

    // use this for initialization
    onLoad: function () {

    },
    gotoGameCenter :function() {
        cc.director.loadScene('gameCenter');
    },
    gotoGameMain :function() {
        cc.director.loadScene('gameMain2');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    gotoGameCenterScene :function(){

    }
});
