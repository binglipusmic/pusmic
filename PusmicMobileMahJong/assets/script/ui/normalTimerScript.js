var timerUpate;
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
        timeCount: cc.Integer,
        timerLable: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        self.timeCount = 10;
        timerUpate = function () {
            var lable = self.timerLable.getComponent(cc.Label);
            lable.string = "(" + self.timeCount + ")";

            self.timeCount--;

            if (self.timeCount == -1) {
                //quePaiTimerLabel,huanPaiTimerLabel
                //
                  self.endTimer();
                if(self.timerLable.name=="quePaiTimerLabel"){

                }
                 if(self.timerLable.name=="huanPaiTimerLabel"){

                }
              
            }

        };
      self.stratTimer();

    },
    stratTimer: function () {

        let self = this;
        self.schedule(timerUpate, 1);
    },
    endTimer: function () {
        let self = this;
        self.unschedule(timerUpate);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
