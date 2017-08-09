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
        alertMessage: cc.Node
    },

    // use this for initialization
    onLoad: function () {

    },

    helpButn: function () {
        this.alertMessage = this.alertMessage.getComponent("alertMessagePanle");
        this.alertMessage.text = "  GPS距离限制指的是你可以设置一个数字，这个数字代表了玩家之间的GPS距离，如果该距离小于你设定的值，那么将拒绝玩家加入你创建的房间。<br/>";
         this.alertMessage.text =  this.alertMessage.text +"  每个新玩家加入此房间将根据GPS自动测算与房间中已有玩家之间的实际距离，如果距离小于你设置的值，将拒绝该玩家加入！"
        this.alertMessage.setTextOfPanel();

    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
