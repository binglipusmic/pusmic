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
        paiActionType:String,
        alertMessageNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },


    chuPaiAction: function (event) {
        var node = event.target;
        var name = node.name;

        if (node.y == 0) {
            //move out
            var action = cc.moveTo(0.1, node.x, node.y + 20);
            node.runAction(action)
        } else {
            //move back 
            var action = cc.moveTo(0.1, node.x, 0);
            node.runAction(action)
        }

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
