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
        tongNode: cc.Node,
        tiaoNode: cc.Node,
        wanNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    quePaiClick: function (event) {
        var node = event.target;
        var name = node.name;
        var que = "";
        if (name == "tong") {
            que = "1";
        }
        if (name == "tiao") {
            que = "2";
        }
        if (name == "wan") {
            que = "3";
        }

         var userList = Global.userList;
        var userInfo = Global.userInfo;
       
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].openid == userInfo.openid) {
               userList[i].quePai=que;
            }
        }


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
