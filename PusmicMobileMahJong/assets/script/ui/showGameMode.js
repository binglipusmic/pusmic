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
        gameModeLable:cc.Node,
        gameRoomNUmber:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        

    },

    showGameMode:function(){
       var gameMode = Global.gameMode;
       var userInfo =Global.userInfo;
       if(gameMode==null || gameMode ==undefined){
         gameMode= require("gameMode").gameMode;
       }
      
         var modeStr="";
         if(gameMode.ziMoJiaDi+""=="1"){
             modeStr=modeStr+"自摸加底"+" "
         }
          if(gameMode.ziMoJiaFan+""=="1"){
             modeStr=modeStr+"自摸加番"+" "
         }
           if(gameMode.ziMoHu+""=="1"){
             modeStr=modeStr+"自摸胡"+" "
         }
           if(gameMode.dianPaoHu+""=="1"){
             modeStr=modeStr+"点炮胡"+" "
         }
           if(gameMode.huanSanZhang+""=="1"){
             modeStr=modeStr+"换三张"+" "
         }
           if(gameMode.dianGangHua_dianPao+""=="1"){
             modeStr=modeStr+"点杠点炮"+" "
         }
           if(gameMode.dianGangHua_ziMo+""=="1"){
             modeStr=modeStr+"点杠自摸"+" "
         }
           if(gameMode.dai19JiangDui+""=="1"){
             modeStr=modeStr+"带幺九"+" "
         }
           if(gameMode.mengQingZhongZhang+""=="1"){
             modeStr=modeStr+"门清中张"+" "
         }

           if(gameMode.tianDiHu+""=="1"){
             modeStr=modeStr+"天地胡"+" "
         }
          
           if(gameMode.fan2+""=="1"){
             modeStr=modeStr+"2番封顶"+" "
         }
           if(gameMode.fan3+""=="1"){
             modeStr=modeStr+"3番封顶"+" "
         }
           if(gameMode.fan4+""=="1"){
             modeStr=modeStr+"4番封顶"+" "
         }
           if(gameMode.roundCount4+""=="1"){
             modeStr=modeStr+"4局一轮"+" "
         }
           if(gameMode.roundCount8+""=="1"){
             modeStr=modeStr+"8局一轮"+" "
         }


         var modeLable=this.gameModeLable.getComponent(cc.Label);
         var roomLable=this.gameRoomNUmber.getComponent(cc.Label);
         modeLable.string=modeStr;
         roomLable.string="房间号:"+userInfo.roomNumber;

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
