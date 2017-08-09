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
        personalPanel: cc.Node,
        winLableNode: cc.Node,
        countLableNode: cc.Node,
        gpsLable: cc.Node,
        totalFenLable: cc.Node,
        userImageNode: cc.Node,
        nickNameNode: cc.Node,

        removeRoomButton: cc.Node,
        getFriendBtn: cc.Node,
        backRoom: cc.Node
    },

    // use this for initialization
    onLoad: function () {



    },

    openPersonalPanel1: function () {
        this.initalPersonalPanel("1");

    },
    openPersonalPanel2: function () {
        this.initalPersonalPanel("2");

    },
    openPersonalPanel4: function () {
        this.initalPersonalPanel("4");

    },



    initalPersonalPanel: function (index) {
        this.removeRoomButton.interactable = false;
        this.getFriendBtn.interactable = false;
        this.backRoom.interactable = false;

        var userInfo1 = Global.userInfo;
        var userLocation = Global.userLocation;
        var userList = Global.userList;
        var targetUserLongitude = null;
        var targetUserLatitude = null;

        for (var j = 0; j < userList.length; j++) {
            var user = userList[j];
            if (user.pointIndex == index) {

                var nickLable = this.nickNameNode.getComponent(cc.Label);
                nickLable.string = user.nickName;

                var totalLableNode = this.totalFenLable.getComponent(cc.Label);
                totalLableNode.string = user.totalCount + "局";

                var winLableNode = this.winLableNode.getComponent(cc.Label);
                winLableNode.string = user.winCount;

                var countLableNode = this.countLableNode.getComponent(cc.Label);
                if (user.roundTotalScore == null || user.roundTotalScore == undefined) {
                    countLableNode.string = "0";
                } else {
                    countLableNode.string = user.roundTotalScore;
                }


                targetUserLongitude = user.longitude;
                targetUserLatitude = user.latitude;

                //roundTotalScore

                var serverUrl = Global.hostHttpProtocol + "://" + Global.hostServerIp + ":" + Global.hostServerPort;
                var testHeaImageurl = serverUrl + "/webchatImage/" + user.headImageFileName;
                var userImage = this.userImageNode.getComponent(cc.Sprite);
                cc.loader.load(testHeaImageurl, function (err, texture) {
                    var frame = new cc.SpriteFrame(texture);
                    userImage.spriteFrame = frame;
                });

            }

        }

        if (userLocation.longitude != null && userLocation.longitude != undefined) {
            if (targetUserLongitude != null && targetUserLongitude != undefined) {
                var distance = this.GetDistance(userLocation.latitude, userLocation.longitude, targetUserLatitude, targetUserLongitude);
                var gpsLableNode = this.gpsLable.getComponent(cc.Label);
                gpsLableNode.string = distance + "公里";

            }

        }

        this.personalPanel.active = true;

    },
    Rad: function (d) {
        return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
    },

    GetDistance: function (lat1, lng1, lat2, lng2) {

        var radLat1 = this.Rad(lat1);
        var radLat2 = this.Rad(lat2);
        var a = radLat1 - radLat2;
        var b = this.Rad(lng1) - this.Rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000; //输出为公里
        //s=s.toFixed(4);
        return s;
    },

    closePersonalPanel: function () {
        this.personalPanel.active = false;

        this.removeRoomButton.interactable = true;
        this.getFriendBtn.interactable = true;
        this.backRoom.interactable = true;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
