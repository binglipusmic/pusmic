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
        userRoundScoreNode: cc.Node,
        userAllRoundScireNode:cc.Node,

    },

    // use this for initialization
    onLoad: function () {

    },

    initalRoundScore: function () {
        var userList = Global.userList;
        this.userRoundScoreNode.active=true;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            var nodeName="user"+(i+1)+"ScoreNode";
            var userNode=cc.find(nodeName,this.userRoundScoreNode);
            var bgNode =cc.find("bgSprite",userNode);
            var userNameNode=cc.find("userNameLabel",bgNode);
            var userNameNodeLable=userNameNode.getComponent(cc.Label);
            userNameNodeLable.string=user.nickName;
            var userDetailsNode=cc.find("user1DetailsRichText",bgNode);
            var detailsRichText = userDetailsNode.getComponent(cc.RichText);
            detailsRichText.string=user.huPaiDetails;
            var userCountNode=cc.find("totalCountAllNode",bgNode);
            var userCountAllLable=userCountNode.getComponent(cc.Label);
            userCountAllLable.string=user.roundScoreCount


            
        }
    },
    closeRoundScore:function(){

    },

    initalAllRoundScore: function () {
        var userList = Global.userList;
        this.userAllRoundScireNode.active=true;
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            var nodeName="user"+(i+1)+"ScoreNode";
            var userNode=cc.find(nodeName,this.userAllRoundScireNode);
            var bgNode =cc.find("bgSprite",userNode);
            var userNameNode=cc.find("userNameLabel",bgNode);
            var userIdNode=cc.find("userIDNode",bgNode);
            var userNameNodeLable=userNameNode.getComponent(cc.Label);
            userNameNodeLable.string=user.nickName;

            var userIdTextLable=userIdNode.getComponent(cc.Label);
            userIdTextLable.string=user.userCode;
            var userDetailsNode=cc.find("huPaiDetailsNode",bgNode);
            var detailsRichText = userDetailsNode.getComponent(cc.Label);
            detailsRichText.string="rrrrrrrrrr \n fdfdfdfdfd \n";
            var userCountNode=cc.find("totalCountNode",bgNode);
            var userCountAllLable=userCountNode.getComponent(cc.Label);
            userCountAllLable.string="总成绩："+user.roundScoreCount    
        }
    },

    closeAllRoundScore:function(){
         var userList = Global.userList;
          for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
             var userDetailsNode=cc.find("user1DetailsRichText",bgNode);
            var detailsRichText = userDetailsNode.getComponent(cc.RichText);
            detailsRichText.string="";
            var userCountNode=cc.find("totalCountAllNode",bgNode);
            var userCountAllLable=userCountNode.getComponent(cc.Label);
            userCountAllLable.string=0;    
          }

        this.userAllRoundScireNode.active=false;
    },
    closeRoundScore:function(){
        this.userRoundScoreNode.active =false;
        //go to a new game ground
        //1.clean the data layer
        
        //2.GUI
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
