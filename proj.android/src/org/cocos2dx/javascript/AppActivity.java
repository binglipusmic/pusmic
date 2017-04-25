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
package org.cocos2dx.javascript;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import com.tencent.mm.opensdk.modelmsg.*;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import com.tencent.mm.opensdk.openapi.IWXAPI;
import net.sourceforge.simcpux.wxapi.Util;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.os.Bundle;

import android.content.Intent;
import android.content.res.Configuration;
import org.cocos2dx.javascript.wxapi.WXEntryActivity;

import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.Configuration;
import android.content.res.Resources;

import java.io.File;

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



        //Bitmap bmp = BitmapFactory.decodeResource(getResources(), R.drawable.send_img);
        //Uri path = Uri.parse("android.resource://com.segf4ult.test/" + R.drawable.icon);
        //Uri otherPath = Uri.parse("android.resource://org.cocos2dx.javascript/drawable/");
        File minfile = new File("icon_min.png");
        String minfilePath = minfile.getAbsolutePath();

        File maxfile = new File("icon_max.png");
        String maxfilePath = maxfile.getAbsolutePath();
        //String folderpath = path.toString();
        //String folderpath = otherPath .toString();
        //this.getResources().openRawResource(R.drawable.icon_max);

        WXTextObject textObj = new WXTextObject();
        textObj.text = "test11";
        final WXAppExtendObject appdata = new WXAppExtendObject();
        final String pathmin =  minfilePath;
        final String pathmax =  maxfilePath;
        //appdata.fileData = Util.readFromFile(pathmax, 0, -1);
        appdata.extInfo = "this is ext info";
        appdata.filePath="org.cocos2dx.javascript";

        //webpage object

        WXWebpageObject webpage = new WXWebpageObject();
        webpage.webpageUrl = "pusmicgame://data/"+roomNumber;
        WXMediaMessage msg = new WXMediaMessage(webpage);
        msg.title = "WebPage Title WebPage Title WebPage Title WebPage Title WebPage Title WebPage Title WebPage Title WebPage Title WebPage Title Very Long Very Long Very Long Very Long Very Long Very Long Very Long Very Long Very Long Very Long";
        msg.description = "WebPage Description WebPage Description WebPage Description WebPage Description WebPage Description WebPage Description WebPage Description WebPage Description WebPage Description Very Long Very Long Very Long Very Long Very Long Very Long Very Long";
        Bitmap bmp = BitmapFactory.decodeResource(getInstance().getResources(), R.drawable.icon_min);
        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, THUMB_SIZE, true);
        //allgetInstance().getResources().get
        msg.thumbData = Util.bmpToByteArray(thumbBmp, true);


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


}
