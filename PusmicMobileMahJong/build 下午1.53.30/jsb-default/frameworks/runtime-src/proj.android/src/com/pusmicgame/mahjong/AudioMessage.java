package com.pusmicgame.mahjong;

import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import com.pusmicgame.mahjong.audio.MP3Recorder;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

/**
 * Created by prominic2 on 17/4/23.
 */
public class AudioMessage   {
    static MP3Recorder mRecorder = new MP3Recorder(new File(Environment.getExternalStorageDirectory(),"pusmicgame_message.mp3"));
    private static final String SDCARD_ROOT = Environment.getExternalStorageDirectory().getAbsolutePath();
    public static void startRecord(){
        Log.w("startRecord","start");
        try {
            mRecorder.start();
        } catch (IOException e) {
            e.printStackTrace();
        };
        Log.w("startRecord","end");
    }

    public static void stopRecord(){
        Log.w("stopRecord","start");
        mRecorder.stop();
        String path = SDCARD_ROOT + "/pusmicgame_message.mp3";
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        File f =new File(path);
        String base64Str="";

        try {
            base64Str =encodeBase64File(path);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Log.w("AudioMessage:",base64Str);
        Log.w("stopRecord","end");

    }


    public static String encodeBase64File(String path) throws Exception {
        File file = new File(path);
        FileInputStream inputFile = new FileInputStream(file);
        byte[] buffer = new byte[(int)file.length()];
        inputFile.read(buffer);
        inputFile.close();
        return Base64.encodeToString(buffer, Base64.DEFAULT);
    }
}
