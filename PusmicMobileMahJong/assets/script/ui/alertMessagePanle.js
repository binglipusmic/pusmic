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
        textNode: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.alertPanelNode.active = false;

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    setTextOfPanel: function () {
        this.alertPanelNode.active = true;
        var r = this.textNode.getComponent(cc.RichText);
        r.string = this.text;
    },

    closePanel: function () {
        this.alertPanelNode.active = false;
    }
});
