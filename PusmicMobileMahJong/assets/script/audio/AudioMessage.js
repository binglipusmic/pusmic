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
        micButtonNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        //cc.sys.OS_IOS  
        //cc.sys.OS_ANDROID 
        //cc.sys.os
        // var clickEventHandler = new cc.Component.EventHandler();
        // clickEventHandler.target = this.micButtonNode; //这个 node 节点是你的事件处理代码组件所属的节点
        // clickEventHandler.component = "AudioMessage";//这个是代码文件名
        // clickEventHandler.handler = "callback";
        // clickEventHandler.customEventData = "foobar";

        this.micButtonNode.on(cc.Node.EventType.TOUCH_START, this.startRecored, this);
        this.micButtonNode.on(cc.Node.EventType.TOUCH_END, this.stopRecord, this);
        //var button = this.micButtonNode.getComponent(cc.Button);
        //button.clickEvents.push(clickEventHandler);
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {

            }
        }

    },


    startRecored: function (event) {
        cc.audioEngine.pauseAll();
        //cc.audioEngine.pauseAllEffects();
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {

                jsb.reflection.callStaticMethod('AudioFunc', 'startOrResumeRecord');
            }
        }

    },

    stopRecord: function (event) {
        cc.audioEngine.resumeAll();
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                var isinstall = jsb.reflection.callStaticMethod('AudioFunc', 'stopRecord');
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
