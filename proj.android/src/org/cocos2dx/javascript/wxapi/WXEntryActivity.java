package org.cocos2dx.javascript.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.*;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
/**
 * Created by prominic2 on 17/4/22.
 */
public class WXEntryActivity extends Activity implements IWXAPIEventHandler{

    private static final String APP_ID="wxc759dfd81a4af8da";
    static int mTargetScene = SendMessageToWX.Req.WXSceneSession;
    static IWXAPI api;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //注册API
        api = WXAPIFactory.createWXAPI(this, APP_ID,true);
        //setContentView(R.layout.send_to_wx);
        api.handleIntent(getIntent(), this);
        Log.w("WXEntryActivity","done the ");
    }





    @Override
    public void onResp(BaseResp resp) {
        int result = 0;
        Log.w("onResp:","onResp success resive");
        //Toast.makeText(this, "baseresp.getType = " + resp.getType(), Toast.LENGTH_SHORT).show();
        Log.w("onResp errorCode:",resp.errCode+"");
        switch (resp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
                //result = R.string.errcode_success;
                if(resp instanceof SendAuth.Resp) {
                    String code = ((SendAuth.Resp) resp).code;
                    Cocos2dxJavascriptJavaBridge.evalString("cc.find('iniIndex').getComponent('iniIndex').getRequstTokenByCode('" + code + "');");
                }
                finish();
                break;
            case BaseResp.ErrCode.ERR_USER_CANCEL:
                //result = R.string.errcode_cancel;
                finish();
                break;
            case BaseResp.ErrCode.ERR_AUTH_DENIED:
                //result = R.string.errcode_deny;
                finish();
                break;
            case BaseResp.ErrCode.ERR_UNSUPPORT:
                //result = R.string.errcode_unsupported;
                finish();
                break;
            default:
                //result = R.string.errcode_unknown;
                finish();
                break;
        }

       // Toast.makeText(this, result, Toast.LENGTH_LONG).show();

    }




    @Override
    public void onReq(BaseReq req) {
        switch (req.getType()) {
            case ConstantsAPI.COMMAND_GETMESSAGE_FROM_WX:
                Log.w("Req:","A rquest has be success send");
                //goToGetMsg();
                break;
            case ConstantsAPI.COMMAND_SHOWMESSAGE_FROM_WX:
               // goToShowMsg((ShowMessageFromWX.Req) req);
                Log.w("Req:","A rquest has be success send2");
                break;
            default:
                break;
        }
    }

//    private void goToGetMsg() {
//        Intent intent = new Intent(this, GetFromWXActivity.class);
//        intent.putExtras(getIntent());
//        startActivity(intent);
//        finish();
//    }
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        setIntent(intent);
        api.handleIntent(intent, this);
    }

//    @Override
//    protected void onResume() {
//        super.onResume();
//        SDKWrapper.getInstance().onResume();
//    }


}
