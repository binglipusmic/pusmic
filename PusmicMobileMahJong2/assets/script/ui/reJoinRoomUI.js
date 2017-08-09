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

        joinRoomNode: cc.Node,
        grailsBtn: cc.Node,
        boyBtn: cc.Node,

    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    showReJoinGUI: function () {
        this.joinRoomNode.active = true;
        var grailsBtn = this.grailsBtn.getComponent(cc.Button);
        var bodyBtn = this.boyBtn.getComponent(cc.Button);
        grailsBtn.interactable = false;
        bodyBtn.interactable = false;

    },
    hideReJoinGUI: function () {
        this.joinRoomNode.active = false;
        var grailsBtn = this.grailsBtn.getComponent(cc.Button);
        var bodyBtn = this.boyBtn.getComponent(cc.Button);
        grailsBtn.interactable = true;
        bodyBtn.interactable = true;

    },

});
