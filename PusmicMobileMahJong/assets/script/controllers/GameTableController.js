var gameMode;
var userInfo;
var serverUrl;
var socket;
var roomNumber;
var messageDomain;
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
    },

    // use this for initialization
    onLoad: function () {
        gameMode = Global.gameMode;
        userInfo = require("userInfoDomain").userInfoDomain;
        messageDomain = require("messageDomain").messageDomain;
        roomNumber=userInfo.roomNumber;
        //connect to server 
         serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
        socket = new SockJS(serverUrl + "/stomp");
        console.log("conect to server");
        client = Stomp.over(socket);

         

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
