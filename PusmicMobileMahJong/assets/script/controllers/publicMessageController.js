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
    onLoad: function () {
        if (source_x == null || source_x == undefined) {
            source_x = this.messageNode.x;
        }
         if (target_x == null || target_x == undefined) {
             target_x = source_x - 1000;
         }

       
        var y = this.messageNode.y;
        var action = cc.repeatForever(
            cc.sequence(
                cc.moveTo(5, cc.p(target_x, y)),
                cc.place(cc.p(source_x, y)),
              
            ));
        this.messageNode.runAction(action);

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
