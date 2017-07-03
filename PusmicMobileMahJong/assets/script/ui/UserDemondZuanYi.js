var alertMessageScript;
var demondNumber;
var networkScript;
var confirmScript;
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

        userZuanYiPanelNode: cc.Node,
        userDemonNode: cc.Node,
        grailsBtn: cc.Node,
        boyBtn: cc.Node,
        userCodeEdit: cc.Node,
        zuanYiDemondNumberEdit: cc.Node,
        alertMessageNodeScirpt: cc.Node,
        tableNetworkNode:cc.Node,
        confirmNode:cc.Node,

    },

    // use this for initialization
    onLoad: function () {
        alertMessageScript = this.alertMessageNodeScirpt.getComponent("alertMessagePanle");
         networkScript = this.tableNetworkNode.getComponent("GameTableNetWork");
         confirmScript=this.confirmNode.getComponent("confimDemond");

    },

    openUserDemondZuanYiPanel: function () {
        var userInfo = Global.userInfo;
        this.userZuanYiPanelNode.active = true;
        var demonNum = this.userDemonNode.getComponent(cc.Label);
        demonNum.string = userInfo.diamondsNumber;


        var grailsBtn = this.grailsBtn.getComponent(cc.Button);
        var bodyBtn = this.boyBtn.getComponent(cc.Button);
        grailsBtn.interactable = false;
        bodyBtn.interactable = false;
    },

    closeUserDemondZuanYiPanel: function () {
        this.userZuanYiPanelNode.active = false;
        var grailsBtn = this.grailsBtn.getComponent(cc.Button);
        var bodyBtn = this.boyBtn.getComponent(cc.Button);
        grailsBtn.interactable = true;
        bodyBtn.interactable = true;
    },

    submitDmondZuanYi: function () {
       // var userInfo = Global.userInfo;
       // var dmondNumber = parseInt(userInfo.diamondsNumber);
       var dmondNumber=100;
        if (dmondNumber <= 0) {
            alertMessageScript.text = "你的钻石数量不足。不能转移给其它用户。";
            alertMessageScript.setTextOfPanel();
            return false;
        }
        //1 check user code edit

        var userCodeEdit = this.userCodeEdit.getComponent(cc.EditBox);
        var userCode = userCodeEdit.string;
        var zuanShiNumEdit = this.zuanYiDemondNumberEdit.getComponent(cc.EditBox);
        var zuanShiNum = zuanShiNumEdit.string;
        if (zuanShiNum.length == 0) {
            alertMessageScript.text = "你必须输入你要转移的钻石数量.";
            alertMessageScript.setTextOfPanel();
            return false;
        }

        if (isNaN(zuanShiNum)) {
            alertMessageScript.text = "钻石数量你必须输入数字.";
            alertMessageScript.setTextOfPanel();
            return false;
        }

        zuanShiNum=parseInt(zuanShiNum);
        if (userCode.length != 6) {
            alertMessageScript.text = "你必须输入6位用户编号，请检查后重新输入！";
            alertMessageScript.setTextOfPanel();
        } else if (isNaN(userCode)) {
            alertMessageScript.text = "你必须输入6位数字用户编号，请不要输入其它字符，请检查后重新输入！";
            alertMessageScript.setTextOfPanel();

        } else if (zuanShiNum.length == 0) {
            alertMessageScript.text = "你必须输入你要转移的钻石数量.";
            alertMessageScript.setTextOfPanel();
        } else if (zuanShiNum>dmondNumber){
            alertMessageScript.text = "你拥有的钻石数量小于你要转移的钻石数量，请检查后重新输入.";
            alertMessageScript.setTextOfPanel();

        } else{
            //sendDemondMove
            //fromUserCode, toUserCode, demondNumber
              var userInfo = Global.userInfo;
              var fromUserCode=userInfo.userCode;
              var toUserCode=userCode;
              var demondNumber=zuanShiNum;


              confirmScript.fromUserCode=fromUserCode;
              confirmScript.toUserCode=toUserCode;
              confirmScript.demondNumber=demondNumber;
              var txt="你确定需要转移"+demondNumber+"钻石到用户:"+toUserCode+"?(不可退回)";
              confirmScript.showConfirmPanel(txt);
             
            
        }



    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
