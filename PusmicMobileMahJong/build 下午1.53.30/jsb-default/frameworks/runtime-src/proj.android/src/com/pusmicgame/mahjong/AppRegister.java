package com.pusmicgame.mahjong;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class AppRegister extends BroadcastReceiver {
	private static final String APP_ID="wxc759dfd81a4af8da";
	@Override
	public void onReceive(Context context, Intent intent) {
		final IWXAPI api = WXAPIFactory.createWXAPI(context, null);


		api.registerApp(APP_ID);
		Log.w("AppRegister","onReceive");
	}
}
