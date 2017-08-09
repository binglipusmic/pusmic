var networkScript;
var userDmondScirpt;
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
        confirmText:cc.Node,
        confirmPanel:cc.Node,
        tableNetworkNode:cc.Node,
        demondPanel:cc.Node,
        userDmodeNode:cc.Node,
        fromUserCode:String,
        toUserCode:String,
        demondNumber:String,

    },

    // use this for initialization
    onLoad: function () {
       networkScript = this.tableNetworkNode.getComponent("GameTableNetWork");
       userDmondScirpt =this.userDmodeNode.getComponent("UserDemondZuanYi");
        

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    showConfirmPanel:function(text){
        console.log("showConfirmPanel starting");
         var r = this.confirmText.getComponent(cc.RichText);
         r.string=text;
         this.confirmPanel.active=true;
    },
    submitMoveAction:function(){
       networkScript.sendDemondMove(this.fromUserCode,this.toUserCode,this.demondNumber);
       this.closeConfirmPanel();
      // this.demondPanel.active=false;
       userDmondScirpt.closeUserDemondZuanYiPanel();
    },

    closeConfirmPanel:function(){
       this.confirmPanel.active=false;
    }
});
