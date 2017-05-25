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

        messageNode: cc.Node,
        biaoQingAndChangYongNode: cc.Node,
        biaoQingNode: cc.Node,
        changyongYuNode: cc.Node,
        inputEditNode: cc.Node,
        messageRichTextBodyNode: cc.Node,
        messageScrollView: cc.Node,
        tableNetWorkNode: cc.Node,

    },

    // use this for initialization
    onLoad: function () {
        tableNetWorkScript = this.tableNetWorkNode.getComponent("GameTableNetWork");
        //var rit = this.messageRichTextBodyNode.getComponent(cc.RichText);

        // rit.string = rit.string + "sdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\nsdfsdfsdfsdf\nsdfsdfsdfsd\n" + "\n"

    },

    openMessage: function () {
        if (this.messageNode.active == false) {
            this.messageNode.active = true;
            this.messageNode.zIndex = 1000;
        } else {
            //this.messageNode.active = false;
        }

    },
    closeMessage: function () {
        this.messageNode.active = false;
    },

    openBiaoQingAll: function () {
        this.biaoQingAndChangYongNode.active = true;
        this.biaoQingNode.active = true;
        this.changyongYuNode.active = false;
    },
    closeBiaoQingAll: function () {
        this.biaoQingAndChangYongNode.active = false;
        cc.log("closeBiaoQingAll");
    },

    openBiaoQing: function () {
        this.changyongYuNode.active = false;
        this.biaoQingNode.active = true;

    },

    openChangYongYu: function () {
        this.biaoQingNode.active = false;
        this.changyongYuNode.active = true;
    },

    selectedBiaoqing: function (event) {

        var node = event.target;
        //var sprite=node.getComponent(cc.Sprite);
        var nodeName = node.name;
        var picName = nodeName.replace("baoqingSprite", "");
        picName = "emo" + picName;


        var myEditBox = this.inputEditNode.getComponent(cc.EditBox);
        myEditBox.string = myEditBox.string + "#" + picName + "#";
        this.closeBiaoQingAll();

    },
    selectedChangYongYu: function (event) {

        var node = event.target;
        var lableNode = cc.find("changyongyuLabel", node);
        var lable = lableNode.getComponent(cc.Label);
        var myEditBox = this.inputEditNode.getComponent(cc.EditBox);
        myEditBox.string = myEditBox.string + lable.string;
        this.closeBiaoQingAll();

    },
    sendMessage: function () {
        var userInfo = Global.userInfo;

        var myEditBox = this.inputEditNode.getComponent(cc.EditBox);
        var message = myEditBox.string;
        cc.log("message:" + message);
        if (message.indexOf("#emo") >= 0) {
            var temp = message.split("#");
            var picName = [];
            for (var i = 0; i < temp.length; i++) {
                var m = temp[i];
                if (m.indexOf("emo") >= 0) {
                    picName.push(m);
                }
            }
            if (picName.length > 0) {
                for (var i = 0; i < picName.length; i++) {
                    var imgName = picName[i].replace("emo", "biaoqing");
                    message = message.replace("#" + picName[i] + "#", "<img src='" + imgName + "'/>");

                }
            }


        }

        message = userInfo.nickName + ":" + message;

        tableNetWorkScript.sendMessageToUser(message);
        //this.showMessage(message);
        // if (this.messageRichTextBodyNode.height > 360) {
        //     var t = (this.messageRichTextBodyNode.height - 360) / 40;
        //     t = Math.ceil(t);
        //     this.messageRichTextBodyNode.y = 180 + t * 40;
        // }
        //this.messageRichTextBodyNode.x = 5;
        //this.messageRichTextBodyNode.y = -337.5;
        myEditBox.string = "";



    },

    showMessage: function (message) {
        console.log("showMessage:" + message);
        var rit = this.messageRichTextBodyNode.getComponent(cc.RichText);

        rit.string = rit.string + message + "\n"
        var scroView = this.messageScrollView.getComponent(cc.ScrollView);
        scroView.scrollToBottom();
        this.openMessage();


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
