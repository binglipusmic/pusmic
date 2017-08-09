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

        tableNetWorkScriptNode: cc.Node,
        publicMessageLableNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

        var tableNwtWork = cc.find("tableNerWorkScript");
        tableNetWorkScript = tableNwtWork.getComponent("GameTableNetWork");

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
