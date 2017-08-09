var gameModeModel = require('gameMode').gameMode;
var checkLableColor=new cc.Color(231,28,77);
var noCheckLableColor=new cc.Color(121,81,44);
var gameModeLayer;
var btnListLayer;
var topInfoLayer;
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
        noCheckBoxBg: cc.SpriteFrame,
        CheckBoxBg: cc.SpriteFrame,
       // gameModeModel:cc.script
    },
   
    // use this for initialization
    onLoad: function () {
         gameModeLayer=cc.find("Canvas/gameModeSelectLayer/mainSelectMode/mainModeOption/GameModeOption1/ListLayout");
         btnListLayer=cc.find("Canvas/gameModeSelectLayer/mainSelectMode/BtnList");
         topInfoLayer=cc.find("Canvas/topInfoLayer");
         gameModeModel.ziMoJiaDi=1;
         gameModeModel.ziMoHu=0;
         gameModeModel.huanSanZhang=0;
         gameModeModel.ziMoJiaFan=0;
         gameModeModel.dianPaoHu=0;
         gameModeModel.dianGangHua_dianPao=0;
         gameModeModel.dianGangHua_ziMo=0;
         gameModeModel.dai19JiangDui=0;
         gameModeModel.mengQingZhongZhang=0;
         gameModeModel.tianDiHu=0;
         gameModeModel.fan2=0;
         gameModeModel.fan3=0;
         gameModeModel.fan4=0;
         gameModeModel.roundCount4=0;
         gameModeModel.roundCount8=0;
         //
         this.initlZiMoJiaDi();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    /*

normalSprite SpriteFrame

普通状态下按钮所显示的 Sprite 。
pressedSprite SpriteFrame

按下状态时按钮所显示的 Sprite 。
hoverSprite SpriteFrame

悬停状态下按钮所显示的 Sprite 。
disabledSprite SpriteFrame


    */
     initlZiMoJiaDi: function(){
      
        //var btn= gameModeLayer.getChildByName("zibojiadiBtn");
        var btn=cc.find("rowOption1/zibojiadiBtn", gameModeLayer);
        var btnBtn=btn.getComponent(cc.Button);
        var btnLable=cc.find("rowOption1/ziMoJiaDiLabel", gameModeLayer);
          if(gameModeModel.ziMoJiaDi==1){
               btnBtn.normalSprite=this.CheckBoxBg;
              btnBtn.pressedSprite=this.CheckBoxBg;
              btnBtn.hoverSprite=this.CheckBoxBg;
               btnLable.color=checkLableColor;
          };

          for(var i=2;i<6;i++){
              var btnLayerName="BtnLay"+i;
              var arrowName="Arrow"+i;
              var arrow=cc.find(""+btnLayerName+"/"+arrowName,btnListLayer);
               //console.log("arrow:"+"Canvas/gameModeSelectLayer/mainSelectMode/BtnList/"+btnLayerName+"/"+arrowName);
              arrow.active=false;
          }
          //disable dianPaoHu
          var dianPaoHubtn= cc.find("rowOption1/dianPaoHuBtn",gameModeLayer);
          var dianPaoHuLable= cc.find("rowOption1/dianPaoHuLabel",gameModeLayer);
          this.disableBtnAndLable(dianPaoHubtn,dianPaoHuLable);
          dianPaoHubtn= cc.find("rowOption2/ziMoHuBtn",gameModeLayer);
          dianPaoHuLable= cc.find("rowOption2/ziMoHuLabel",gameModeLayer);
          this.disableBtnAndLable(dianPaoHubtn,dianPaoHuLable);
     },
     //自摸加底 option 
    updateZiMoJiaDi: function(){
        console.log("gameModeModel:"+gameModeModel.ziMoJiaDi);
        //cc.log(comp.uuid);
        var btn= cc.find("rowOption1/zibojiadiBtn",gameModeLayer);
        var btnBtn=btn.getComponent(cc.Button);
       
       // var parent=btn.getpa
        var btnLable=cc.find("rowOption1/ziMoJiaDiLabel",gameModeLayer);
        gameModeModel.ziMoJiaDi=this.updateUtilsBtnAndLable(btnBtn,btnLable,gameModeModel.ziMoJiaDi);
       

    },
        updateZiMoJiaFan: function(){
        console.log("gameModeModel:"+gameModeModel.ziMoJiaFan);
        //cc.log(comp.uuid);
        var btn= cc.find("rowOption1/zibojiafanBtn",gameModeLayer);
        var btnBtn=btn.getComponent(cc.Button);
       var btnLable=cc.find("rowOption1/ziMoJiaFanLabel",gameModeLayer);
        gameModeModel.ziMoJiaFan=this.updateUtilsBtnAndLable(btnBtn,btnLable,gameModeModel.ziMoJiaFan);
    },
    updateDianGangHua_dianPao: function(){
    },
    updateDianGangHua_ziMo: function(){
    },
    updateDai19JiangDui: function(){
    },
    updateMengQingZhongZhang: function(){
    },
    updateTianDiHu: function(){
    },
    updateFan2: function(){
    },
    updateFan3: function(){
    },
    updateFan4: function(){
    },
    updateRoundCount4: function(){
    },
    updateRoundCount8: function(){
    }, 
    updateHuanSanZhang: function(){
    },
    updateZiMoHu: function(){
    },
    updateDianPaoHu: function(){
    },

    //----------------------------Utils function--------------------------------------------------------
    updateUtilsBtnAndLable: function(btnBtn,btnLable,confValue){
      if(confValue==1){
              btnBtn.normalSprite=this.noCheckBoxBg;
              btnBtn.pressedSprite=this.noCheckBoxBg;
              btnBtn.hoverSprite=this.noCheckBoxBg;
              btnLable.color=noCheckLableColor;  
              return 0;
        }else{
             btnBtn.normalSprite=this.CheckBoxBg;
              btnBtn.pressedSprite=this.CheckBoxBg;
              btnBtn.hoverSprite=this.CheckBoxBg;
              btnLable.color= checkLableColor;  
              return 1;
        }

    },
    disableBtnAndLable: function (btnBtn,btnLable){
          btnBtn.active=false;
          btnLable.active=false;

    },
    //----------------------------Utils function end--------------------------------------------------------
    //Left button mode click function...........
    //zibojiadiBtn,ziMoJiaDiLabel,zibojiafanBtn,ziMoJiaFanLabel,dianPaoHuBtn,dianPaoHuLabel
    //dianGangHuaDianPaoBtn,dianGangHuaDianPaoLabel
    xueZhanDaoDiButtonClick :function(){

    },
    xueLiuChengHeButtonClick :function(){

    },
    DaoDaoHuButtonClick :function(){

    },
    NeiJiangMaJiangButtonClick :function(){

    },
    SanRenLiangFangButtonClick :function(){

    }

});
