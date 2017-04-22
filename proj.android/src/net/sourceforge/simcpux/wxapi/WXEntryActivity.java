package net.sourceforge.simcpux.wxapi;

import android.app.Activity;
import android.widget.Toast;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.ShowMessageFromWX;
import com.tencent.mm.opensdk.modelmsg.WXAppExtendObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
/**
 * Created by prominic2 on 17/4/22.
 */
public class WXEntryActivity extends Activity implements IWXAPIEventHandler{
    @Override
    public void onResp(BaseResp resp) {
        int result = 0;

        Toast.makeText(this, "baseresp.getType = " + resp.getType(), Toast.LENGTH_SHORT).show();

        switch (resp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
                //result = R.string.errcode_success;
                String code = ((SendAuth.Resp) resp).code;
                Cocos2dxJavascriptJavaBridge.evalString("cc.find('iniIndex').getComponent('iniIndex').getRequstTokenByCode('" + code + "');");

                break;
            case BaseResp.ErrCode.ERR_USER_CANCEL:
                //result = R.string.errcode_cancel;
                break;
            case BaseResp.ErrCode.ERR_AUTH_DENIED:
                //result = R.string.errcode_deny;
                break;
            case BaseResp.ErrCode.ERR_UNSUPPORT:
                //result = R.string.errcode_unsupported;
                break;
            default:
                //result = R.string.errcode_unknown;
                break;
        }

        Toast.makeText(this, result, Toast.LENGTH_LONG).show();
    }


    @Override
    public void onReq(BaseReq req) {
        switch (req.getType()) {
            case ConstantsAPI.COMMAND_GETMESSAGE_FROM_WX:
                //goToGetMsg();
                break;
            case ConstantsAPI.COMMAND_SHOWMESSAGE_FROM_WX:
               // goToShowMsg((ShowMessageFromWX.Req) req);
                break;
            default:
                break;
        }
    }
}
