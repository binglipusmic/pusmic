var roomNumberLableList = [];
var gameAction;
var tableNetWork;
var alertMessageUI;
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
        roomInputLableNode: cc.Node,
        keyBoardNode: cc.Node,
        loadingIconNode: cc.Node,
        gameoConfigScriptNode: cc.Node,
        tableNetworkNode: cc.Node,
        alertMessageNodeScirpt: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        gameAction = this.gameoConfigScriptNode.getComponent("gameConfigButtonListAction")
        tableNetWork = this.tableNetworkNode.getComponent("GameTableNetWork");
        alertMessageUI = this.alertMessageNodeScirpt.getComponent("alertMessagePanle");

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    keyBoradClickEvent: function (event) {
        if (roomNumberLableList.length <= 5) {
            var node = event.target;
            var name = node.name;
            name = name.replace("Num", "");
            name = name.replace("Node", "");
            roomNumberLableList.push(name);
            this.intalTheNumberLableByList();
        }
        cc.log(roomNumberLableList.toString());
    },
    intalTheNumberLableByList: function () {
        var node = this.roomInputLableNode;
        for (var i = 0; i < roomNumberLableList.length; i++) {
            var lableName = "input" + (i + 1) + "Node";
            var lableNode = cc.find(lableName, node);
            if (lableNode != null && lableNode !== undefined) {
                var lable = lableNode.getComponent(cc.Label);
                lable.string = roomNumberLableList[i];
            }

        }

    },
    deleteNumber: function () {
        roomNumberLableList.splice(-1, 1);
        cc.log(roomNumberLableList.toString());
        this.cleanLable();
        this.intalTheNumberLableByList();

    },
    getRoomNumber: function () {
        var roomNumber = "";
        if (roomNumberLableList.length < 6) {
            alertMessageUI.text = "你必须输入6位数的房间号！";
            alertMessageUI.setTextOfPanel();
            return false;
        } else {

            for (var i = 0; i < roomNumberLableList.length; i++) {
                roomNumber = roomNumber + roomNumberLableList[i];
            }

        }
        return roomNumber
    },

    cleanLable: function () {
        var node = this.roomInputLableNode;
        for (var i = 0; i < 6; i++) {
            var lableName = "input" + (i + 1) + "Node";
            var lableNode = cc.find(lableName, node);
            if (lableNode != null && lableNode !== undefined) {
                var lable = lableNode.getComponent(cc.Label);
                lable.string = "";
            }

        }

    },
    joinRoomAction: function () {
        var roomNumber = "";
        if (roomNumberLableList.length < 6) {
            alertMessageUI.text = "你必须输入6位数的房间号！";
            alertMessageUI.setTextOfPanel();
            return false;
        } else {

            for (var i = 0; i < roomNumberLableList.length; i++) {
                roomNumber = roomNumber + roomNumberLableList[i];
            }
            gameAction.showLoadingIcon();
            tableNetWork.joinRoom(roomNumber);

        }
        /*
        if (roomNumber == "") {
            alertMessageUI.text = "你必须输入6位数的房间号！";
            alertMessageUI.setTextOfPanel();
            return false
        }*/


    },

});
