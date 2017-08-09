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
        tableNetWorkAction:cc.Node,
        readyIcon:cc.SpriteFrame,
        readyNotIcon:cc.SpriteFrame,    
    },

    // use this for initialization
    onLoad: function () {

    },

    userReadyToggle:function(event){

        var node=event.target;
        if(node.active==true){
            node.active=false;
        }else{
            node.active=true;
        }
        cc.log("userReadyToggle:"+node.name)
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
