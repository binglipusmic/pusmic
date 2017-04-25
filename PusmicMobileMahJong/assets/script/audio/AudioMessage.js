var tableNetWorkScript;
var updateValueForAndroid;
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
        micPicNode: cc.Node,
        micProcessNode: cc.Node,

        tableNetWorkNode: cc.Node,
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

        updateValueForAndroid = function () {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                console.log("call record in android start");
                var val = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getValue", "()F");
                if (val != null && val != undefined) {
                    this.setProcessBar(val);
                }

            }

        };

    },

    setProcessBar: function (number) {
        var processBar = this.micProcessNode.getComponent(cc.ProgressBar);
        processBar.progress = number;
    },

    startRecored: function (event) {
        this.micPicNode.active = true;
        cc.audioEngine.pauseAll();
        //cc.audioEngine.pauseAllEffects();

        //this only work on native ,if it is web version we should add other logic in here 
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {

                jsb.reflection.callStaticMethod('AudioFunc', 'startOrResumeRecord');
            }

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                console.log("call record in android start");
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startRecord", "()V");
                let self = this;
                self.schedule(updateValueForAndroid, 0.1);

            }
        }


    },

    stopRecord: function (event) {
        cc.audioEngine.resumeAll();
        this.micPicNode.active = false;
        var processBar = this.micProcessNode.getComponent(cc.ProgressBar);
        processBar.progress = 0;

        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('AudioFunc', 'stopRecord');
            }

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "stopRecord", "()V");
                let self = this;
                self.unschedule(updateValueForAndroid);
                console.log("call record in android end ");
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
