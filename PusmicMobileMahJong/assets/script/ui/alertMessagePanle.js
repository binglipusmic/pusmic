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
        textNode: cc.Node,
        buttonNode: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.alertPanelNode.active = false;

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    setTextOfPanel: function () {
        console.log("setTextOfPanel start :" + this.text);
        var userInfo = Global.userInfo;

        var r = this.textNode.getComponent(cc.RichText);
        if (this.text.indexOf("###") > 0) {
            var temp = this.text.split("###");
            console.log("setTextOfPanel temp :" + temp.length + "-");
            if (temp.length > 1) {
                if (temp[1].length > 0) {
                    if (userInfo.openid == temp[1]) {
                        r.string = temp[0];
                        this.alertPanelNode.active = true;
                    } else {
                        r.string = "";
                        this.alertPanelNode.active = false;
                    }
                } else {
                    r.string = "";
                    this.alertPanelNode.active = false;
                }
            } else {
                r.string = "";
                this.alertPanelNode.active = false;
            }
        } else {
             console.log("setTextOfPanel temp 58 :" + "-");
            r.string = this.text;
            this.alertPanelNode.active = true;
        }

    },

    closePanel: function () {
        this.alertPanelNode.active = false;
    },

    closeButton: function () {
        this.buttonNode.active = false;
    },

    showButton: function () {
        this.buttonNode.active = true;
    }
});
