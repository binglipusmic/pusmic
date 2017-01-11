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

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});


/**
 * 
 * loadNative = function(url, callback){
    var dirpath =  jsb.fileUtils.getWritablePath() + 'img/';
    var filepath = dirpath + MD5(url) + '.png';

    function loadEnd(){
        cc.loader.load(filepath, function(err, tex){
            if( err ){
                cc.error(err);
            }else{
                var spriteFrame = new cc.SpriteFrame(tex);
                if( spriteFrame ){
                    spriteFrame.retain();
                    callback(spriteFrame);
                }
            }
        });

    }

    if( jsb.fileUtils.isFileExist(filepath) ){
        cc.log('Remote is find' + filepath);
        loadEnd();
        return;
    }

    var saveFile = function(data){
        if( typeof data !== 'undefined' ){
            if( !jsb.fileUtils.isDirectoryExist(dirpath) ){
                jsb.fileUtils.createDirectory(dirpath);
            }

            if( jsb.fileUtils.writeDataToFile(  new Uint8Array(data) , filepath) ){
                cc.log('Remote write file succeed.');
                loadEnd();
            }else{
                cc.log('Remote write file failed.');
            }
        }else{
            cc.log('Remote download file failed.');
        }
    };
    
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        cc.log("xhr.readyState  " +xhr.readyState);
        cc.log("xhr.status  " +xhr.status);
        if (xhr.readyState === 4 ) {
            if(xhr.status === 200){
                xhr.responseType = 'arraybuffer';
                saveFile(xhr.response);
            }else{
                saveFile(null);
            }
        }
    }.bind(this);
    xhr.open("GET", url, true);
    xhr.send();
};
 */
