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

        timeLable: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        //show time
        var dateTimeUpte = function () {
            var currentdate = new Date();
            var hour = currentdate.getHours() + ":";
            var min = currentdate.getMinutes() + "";
            var second = currentdate.getSeconds()+"";

            if (min.length == 1) {
                min = "0" + min
            }
            if (second.length == 1) {
                second = "0" + second
            }
            var currentTiem = hour + min ;

            var lable = this.timeLable.getComponent(cc.Label);
            lable.string = currentTiem;
        }

        this.schedule(dateTimeUpte, 1)
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

});
