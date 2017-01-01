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
       // client: null
    },

    // use this for initialization
    onLoad: function () {


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    checkonlineUser: function (client) {

        this.callback = function () {
            var userInfo = Global.userInfo;

            if (userInfo != null && userInfo != undefined) {
                var openid = userInfo.openid
                var roomNumber = userInfo.roomNumber
                var messageObj = this.buildSendMessage(openid, roomNumber, "updateOnlinUserDateTime");
                this.sendMessageToServer(messageObj,client);
            }
        }

        this.schedule(this.callback, 1800);
    },

    removeOnlineUser: function (client, roomNumber) {
        var userInfo = Global.userInfo;
        if (userInfo != null && userInfo != undefined) {
            var openid = userInfo.openid
            var messageObj = this.buildSendMessage(openid, roomNumber, "updateOnlinUserDateTime");
            this.sendMessageToServer(messageObj);
        }


    },
    sendMessageToServer: function (messageObj,client) {

        client.send("/app/userResiveMessage", {}, JSON.stringify(messageObj));

    },
    buildSendMessage: function (messageBody, roomNum, action) {
        var messageDomain = require("messageDomain").messageDomain;
        messageDomain.messageBelongsToPrivateChanleNumber = roomNum;
        messageDomain.messageAction = action;
        messageDomain.messageBody = messageBody;

        return messageDomain


    },
});
