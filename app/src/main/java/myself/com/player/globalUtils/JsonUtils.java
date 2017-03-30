package myself.com.player.globalUtils;

import android.support.annotation.Nullable;
import android.text.TextUtils;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

/**
 * Created by Administrator on 2016/12/2.
 */

public class JsonUtils {

    public static <T> T fromJson(String json, Class<T> fromClass) {
        if (fromClass != null && !TextUtils.isEmpty(json)) {
            try {
                return new Gson().fromJson(json, fromClass);
            } catch (Exception e) {
                Logger.e(JsonUtils.class, "Json2Class error is the " + fromClass.getSimpleName(), e);
                e.printStackTrace();
            }
        }
        return null;
    }

    public static <T> T fromJson(String json, TypeToken<T> type) {
        if (type != null && !TextUtils.isEmpty(json)) {
            try {
                return new Gson().fromJson(json, type.getType());
            } catch (JsonSyntaxException uee) {
                Logger.e(JsonUtils.class, "Json2Class error is the " + type.toString(), uee);
                uee.printStackTrace();
            } catch (Exception e) {
                Logger.e(JsonUtils.class, "Json2Class error is the " + type.toString(), e);
                e.printStackTrace();
            }
        }
        return null;
    }

    public static String toJson(@Nullable Object object) {
        String mJsonStr = "";
        try {
            if (object instanceof String) {
                mJsonStr = (String) object;
            } else {
                mJsonStr = new Gson().toJson(object);
            }
        } catch (Exception e) {
            Logger.e(JsonUtils.class, object.getClass().getSimpleName() + "_2Json error", e);
            e.printStackTrace();
        }
        return mJsonStr;
    }
}
