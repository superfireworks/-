package myself.com.player.constant;

import android.os.Environment;

/**
 * 存放主题风格相关常量
 */
public interface ConstantLocal {

    String SD_CARD_DIR = Environment.getExternalStorageDirectory() + "/";
    String FILE_DIR = SD_CARD_DIR + "MediaPlayOnLine";
    String HTML_FILE_DIR = FILE_DIR + "/html/";
    String APK_FILE_DIR = FILE_DIR + "/apk/";
    String VIDEO_FILE_DIR = FILE_DIR + "/video/";
    String PIC_FILE_DIR = FILE_DIR + "/pic/";
    String CRASH_FILE_DIR = FILE_DIR + "/crash/";

}
