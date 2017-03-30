package myself.com.player.globalUtils;

import android.util.Log;

import myself.com.player.IConfig;

public class Logger {

    public static String APP_TAG = "---player---";
    public static String HTTP = "---HTTP---";

    public static void v(Object tag, String msg) {
        if (IConfig.LOG_ENABLED) {
            Log.v(APP_TAG + getTagName(tag), msg);
        }
    }

    public static void d(Object tag, String msg) {
        if (IConfig.LOG_ENABLED) {
            Log.d(APP_TAG + getTagName(tag), msg);
        }
    }

    public static void request(Object tag, String msg) {
        if (IConfig.LOG_ENABLED) {
            Log.d(HTTP + getTagName(tag), msg);
        }
    }

    public static void i(Object tag, String msg) {
        if (IConfig.LOG_ENABLED) {
            Log.i(APP_TAG + getTagName(tag), msg);
        }
    }

    public static void w(Object tag, String msg) {
        if (IConfig.LOG_ENABLED) {
            Log.w(APP_TAG + getTagName(tag), msg);
        }
    }

    public static void e(Object tag, String msg, Throwable tr) {
        if (IConfig.LOG_ENABLED) {
            Log.e(APP_TAG + getTagName(tag), msg, tr);
        }
    }

    public static void e(Object tag, String msg) {
        if (IConfig.LOG_ENABLED) {
            Log.e(APP_TAG + getTagName(tag), msg);
        }
    }

    private static String getTagName(Object tagObj) {
        if (tagObj == null) {
            return "tag is null";
        }
        String tagName = "tag error";
        if (tagObj instanceof Class) {
            tagName = ((Class) tagObj).getSimpleName();
        } else if (tagObj instanceof String) {
            tagName = (String) tagObj;
        } else {
            try {
                tagName = tagObj.getClass().getSimpleName();
            } catch (Exception e) {
                e.printStackTrace();
                return tagName;
            }
        }
        return tagName;
    }
}
