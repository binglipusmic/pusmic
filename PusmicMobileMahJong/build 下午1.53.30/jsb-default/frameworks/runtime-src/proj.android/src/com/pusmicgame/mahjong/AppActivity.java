/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2014 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package com.pusmicgame.mahjong;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.util.Base64;
import android.util.Log;
import com.tencent.mm.opensdk.modelmsg.*;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import com.tencent.mm.opensdk.openapi.IWXAPI;
import net.sourceforge.simcpux.wxapi.Util;
import com.pusmicgame.mahjong.audio.MP3Recorder;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.os.Bundle;

import android.content.Intent;
import android.content.res.Configuration;
import com.pusmicgame.mahjong.wxapi.WXEntryActivity;

import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.Configuration;
import android.content.res.Resources;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.io.*;

public class AppActivity extends Cocos2dxActivity  {

    private static final String APP_ID="wxc759dfd81a4af8da";
    static int mTargetScene = SendMessageToWX.Req.WXSceneSession;
    private static IWXAPI api;
    private static final String SDCARD_ROOT = Environment.getExternalStorageDirectory().getAbsolutePath();


    private static AppActivity instance;

    public AppActivity() {
        super();
        instance = this;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SDKWrapper.getInstance().init(this);


        api= WXAPIFactory.createWXAPI(this,APP_ID,true);
        api.registerApp(APP_ID);
       // WXEntryActivity.api
    }
	
    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);

        api= WXAPIFactory.createWXAPI(this,APP_ID,true);
        api.registerApp(APP_ID);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }
        
    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }




//----------------WebChat---------------------------

    private static final int THUMB_SIZE = 150;
    public static boolean isWXInstalled(){
        return api.isWXAppInstalled();
    }

    public static void sendApplicatoinMessage(String roomNumber){



        Log.w("roomNumber:",roomNumber);
        //Bitmap bmp = BitmapFactory.decodeResource(getResources(), R.drawable.send_img);
        //Uri path = Uri.parse("android.resource://com.segf4ult.test/" + R.drawable.icon);
        //Uri otherPath = Uri.parse("android.resource://com.pusmicgame.mahjong/drawable/");
        File minfile = new File("icon_min.png");
        String minfilePath = minfile.getAbsolutePath();

        File maxfile = new File("icon_max.png");
        String maxfilePath = maxfile.getAbsolutePath();
        //String folderpath = path.toString();
        //String folderpath = otherPath .toString();
        //this.getResources().openRawResource(R.drawable.icon_max);

        WXTextObject textObj = new WXTextObject();
        textObj.text = "乐乐四川麻将";
        final WXAppExtendObject appdata = new WXAppExtendObject();
        final String pathmin =  minfilePath;
        final String pathmax =  maxfilePath;
        //appdata.fileData = Util.readFromFile(pathmax, 0, -1);
        appdata.extInfo = "this is ext info";
        appdata.filePath="com.pusmicgame.mahjong";

        //webpage object

        WXWebpageObject webpage = new WXWebpageObject();
        //webpage.webpageUrl = "pusmicgame://data/"+roomNumber;
        webpage.webpageUrl = "www.pusmic.com/game.html";
        WXMediaMessage msg = new WXMediaMessage(webpage);
        msg.title = "乐乐四川麻将";
        msg.description = "我已在乐乐四川麻将中建好房间【"+roomNumber+"】,快来加入吧!";
        Bitmap bmp = BitmapFactory.decodeResource(getInstance().getResources(), R.drawable.icon_min);
        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, THUMB_SIZE, true);
        //allgetInstance().getResources().get
        //msg.thumbData = Util.bmpToByteArray(thumbBmp, true);
        msg.setThumbImage(thumbBmp);


        //final WXMediaMessage msg = new WXMediaMessage();
        //msg.setThumbImage(Util.extractThumbNail(pathmin, 150, 150, true));
        //msg.title = "this is title";
       // msg.description = "this is description sjgksgj sklgjl sjgsgskl gslgj sklgj sjglsjgs kl gjksss ssssssss sjskgs kgjsj jskgjs kjgk sgjsk Very Long Very Long Very Long Very Longgj skjgks kgsk lgskg jslgj";
        //msg.mediaObject = appdata;

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("appdata");
        req.message = msg;
        req.scene = mTargetScene;
        api.sendReq(req);
        bmp.recycle();
        //finish();

    }

    private static String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }



    public static AppActivity getInstance() {
        return instance;
    }


    private void goToGetMsg() {
        //Intent intent = new Intent(this, GetFromWXActivity.class);
        // intent.putExtras(getIntent());
        //startActivity(intent);
        // finish();
    }

    public   static void sendReq(){
        final SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "pusmicGameMajhong";
        // req.transaction =String.valueOf(System.currentTimeMillis());
        api.sendReq(req);
        //finish();
        Log.w("sendReq","send req already success");
        //api.handleIntent(getIntent(), this);
    }

    private void goToShowMsg(ShowMessageFromWX.Req showReq) {
        WXMediaMessage wxMsg = showReq.message;
        WXAppExtendObject obj = (WXAppExtendObject) wxMsg.mediaObject;

        StringBuffer msg = new StringBuffer(); // ��֯һ������ʾ����Ϣ����
        msg.append("description: ");
        msg.append(wxMsg.description);
        msg.append("\n");
        msg.append("extInfo: ");
        msg.append(obj.extInfo);
        msg.append("\n");
        msg.append("filePath: ");
        msg.append(obj.filePath);

//        Intent intent = new Intent(this, ShowFromWXActivity.class);
//        intent.putExtra(SyncStateContract.Constants.ShowMsgActivity.STitle, wxMsg.title);
//        intent.putExtra(Constants.ShowMsgActivity.SMessage, msg.toString());
//        intent.putExtra(Constants.ShowMsgActivity.BAThumbData, wxMsg.thumbData);
//        startActivity(intent);
//        finish();
    }


    static MP3Recorder mRecorder = new MP3Recorder(new File(Environment.getExternalStorageDirectory(),"pusmicgame_message.mp3"));
    //private static final String SDCARD_ROOT = Environment.getExternalStorageDirectory().getAbsolutePath();
    public static void startRecord(){
        Log.w("startRecord","start");
        try {
            mRecorder.start();
            //updateMicStatus();
        } catch (IOException e) {
            e.printStackTrace();
        };
        Log.w("startRecord","end");
    }

    public static void stopRecord(){
        Log.w("stopRecord","start");
        mRecorder.stop();
        String path = SDCARD_ROOT + "/pusmicgame_message.mp3";
        //ByteArrayOutputStream baos = new ByteArrayOutputStream();
        File f =new File(path);
        String base64Str="";

        try {
            base64Str =encodeBase64File(path);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Log.println(Log.INFO,"AudioMessage:",base64Str);
        Log.w("stopRecord","end");
        /**
         * stringWithFormat:@"cc.find('tableNerWorkScript').getComponent('GameTableNetWork').sendAudioMessage('%@');",base64String];

         */
        if(base64Str.length()>0){
            Log.w("####base64Str len####",base64Str.length()+"");
            Cocos2dxJavascriptJavaBridge.evalString("cc.find('tableNerWorkScript').getComponent('GameTableNetWork').sendAudioMessage('"+base64Str+"')");

        }

       // mHandler.removeCallbacks(mUpdateMicStatusTimer);
    }


    public static void setProcessBarInCCC(){
        Double val=(1.0/mRecorder.getMaxVolume())*(mRecorder.getMaxVolume()-mRecorder.getVolume());
        Cocos2dxJavascriptJavaBridge.evalString("cc.find('AudioMessage').getComponent('AudioMessage').setProcessBar('"+val+"')");
        Log.w("val",val+"");
    }

    public static float getValue(){
        float val=(float)(1.0/mRecorder.getMaxVolume())*(mRecorder.getMaxVolume()-mRecorder.getVolume());
        return val;

    }


    private static Handler mHandler = new Handler();
    private static Runnable mUpdateMicStatusTimer = new Runnable() {
        public void run() {
            updateMicStatus();
        }
    };

    /**
     * 更新话筒状态
     *
     */
    private int BASE = 1;
    private static int SPACE = 100;// 间隔取样时间

    public static void updateMicStatus() {

        if (mRecorder.isRecording()) {
            setProcessBarInCCC();
            mHandler.postDelayed(mUpdateMicStatusTimer, SPACE);
        }
    }


    public static String encodeBase64File(String path) throws Exception {
        File file = new File(path);
        FileInputStream inputFile = new FileInputStream(file);
        byte[] buffer = new byte[(int)file.length()];
        inputFile.read(buffer);
        inputFile.close();
        return Base64.encodeToString(buffer, Base64.NO_WRAP);
    }

    public static void decodeBase64File(String base64String) throws Exception {
        Log.w("####decodeBase len##",base64String.length()+"");

        String path = SDCARD_ROOT + "/pusmicgame_message_play.mp3";
        //File f=new File(path);



        FileOutputStream fos = null;
        try {
            if (base64String.length()>0) {
                Log.w("####save file##","start");
                //FileInputStream fis = new FileInputStream (new File(NAME_OF_FILE));
                 fos = new FileOutputStream(path, true);
                //fos = getContext().openFileOutput(SDCARD_ROOT.getc, Context.MODE_PRIVATE);
                byte[] decodedString = android.util.Base64.decode(base64String, Base64.NO_WRAP);
                fos.write(decodedString);
                fos.flush();
                fos.close();
                Log.w("####save file##",decodedString.length+"");

            }

        } catch (Exception e) {
            Log.w("####error:##",e.getMessage());
            Log.w("####error:##",e.getLocalizedMessage());
        } finally {
            if (fos != null) {
                fos = null;
            }
        }


        File f=new File(path);

        if(f.exists()){
            Log.w("####decodeBaseplay##"," play music");
            audioPlayer(path);
        }

    }
    private static AudioManager audioMgr = null;
    //static
    public static void audioPlayer(String filePath){
        //set up MediaPlayer
        Log.w("####audioplay##",filePath);
//        if(audioMgr==null){
//            audioMgr = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
//            audioMgr.setStreamVolume(AudioManager.STREAM_MUSIC, 1800,
//                    AudioManager.FLAG_PLAY_SOUND);
//        }


        MediaPlayer mpintro = new MediaPlayer();
        File f=new File(filePath);
        Log.w("####file dize ##",f.length()+"");

        FileInputStream inputStream = null;
        try {
            inputStream = new FileInputStream(f);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        try {

            int maxVolume = 2000;
            mpintro.reset();
            //inputStream.set

            mpintro.setDataSource(inputStream.getFD());
            mpintro.setLooping(false);

            mpintro.prepare();
            //float log1=(float)(Math.log(maxVolume-currVolume)/Math.log(maxVolume));
            final float volume = (float) (1 - (Math.log(maxVolume - 2000) / Math.log(maxVolume)));
            mpintro.setVolume(volume, volume);
            mpintro.start();
            //mpintro.release();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            //mpintro.stop();
            //mpintro.release();
            if(f.exists()){
                f.delete();
            }

        }
    }


    static Location location;
    static double latitude;
    static double longitude;

//
//    private static final LocationListener locationListener = new LocationListener() {
//        public void onLocationChanged(Location location) {
//            //updateGPSCoordinates();
//        }
//
//        public void onProviderDisabled(String provider){
//           // updateMyCurrentLoc(null);
//        }
//
//        public void onProviderEnabled(String provider){ }
//        public void onStatusChanged(String provider, int status,
//                                    Bundle extras){ }
//    };

    public static void getLocation() {

        GPSTracker gpsTracker = new GPSTracker(getContext(),getInstance());
        if (gpsTracker.getIsGPSTrackingEnabled()){
            String stringLatitude = String.valueOf(gpsTracker.latitude);
            String stringLongitude = String.valueOf(gpsTracker.longitude);
            Log.d("locatiolatn:",stringLatitude);
            Log.d("locatiolatLit:",stringLongitude);
           // Cocos2dxJavascriptJavaBridge.evalString("cc.find(\"tableNerWorkScript\").getComponent(\"GameTableNetWork\").saveLocationInfoToGobalInfo(\""+gpsTracker.longitude+"\",\""+gpsTracker.latitude+"\")");
            Cocos2dxJavascriptJavaBridge.evalString("cc.find('tableNerWorkScript').getComponent('GameTableNetWork').saveLocationInfoToGobalInfo('"+stringLongitude+"','"+stringLatitude+"')");

        }else{

        }
    }



}
