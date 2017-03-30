package myself.com.player.globalUtils;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.util.Base64;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

import myself.com.player.PlayerApp;

public class SPUtils {

    private static final String SHARED_PREFERENCES_PLAYER = "player";
    private static final String SHARED_PREFERENCES_BASE_SIXTY_FOUR = "base64";

    public static void setBoolean(String key, boolean value) {
        SharedPreferences sp = PlayerApp.getContext().getSharedPreferences(
                SHARED_PREFERENCES_PLAYER, Context.MODE_PRIVATE);
        Editor et = sp.edit();
        et.putBoolean(key, value);
        et.apply();
    }

    public static boolean getBoolean(String key) {
        SharedPreferences sp = PlayerApp.getContext().getSharedPreferences(
                SHARED_PREFERENCES_PLAYER, Context.MODE_PRIVATE);
        return sp.getBoolean(key, false);
    }

    public static void setString(String key, String value) {
        SharedPreferences sp = PlayerApp.getContext().getSharedPreferences(SHARED_PREFERENCES_PLAYER,
                Context.MODE_PRIVATE);
        Editor et = sp.edit();
        et.putString(key, value);
        et.apply();
    }

    public static void setString(String SPFile, String key, String value) {
        SharedPreferences sp = PlayerApp.getContext().getSharedPreferences(SPFile,
                Context.MODE_PRIVATE);
        Editor et = sp.edit();
        et.putString(key, value);
        et.apply();
    }

    public static String getString(String key) {
        SharedPreferences sp = PlayerApp.getContext().getSharedPreferences(SHARED_PREFERENCES_PLAYER,
                Context.MODE_PRIVATE);
        return sp.getString(key, "");
    }

    public static String getString(String SPFile, String key) {
        SharedPreferences sp = PlayerApp.getContext().getSharedPreferences(SPFile,
                Context.MODE_PRIVATE);
        return sp.getString(key, "");
    }

    public static void setInteger(String key, int value) {
        SharedPreferences sp = PlayerApp.getContext().getSharedPreferences(
                SHARED_PREFERENCES_PLAYER, Context.MODE_PRIVATE);
        Editor et = sp.edit();
        et.putInt(key, value);
        et.apply();
    }

    public static int getInteger(String key) {
        SharedPreferences sp = PlayerApp.getContext().getSharedPreferences(
                SHARED_PREFERENCES_PLAYER, Context.MODE_PRIVATE);
        return sp.getInt(key, 0);
    }

    public static void saveObject(String key, Object object) {
        SharedPreferences sp = PlayerApp.getContext().getSharedPreferences(
                SHARED_PREFERENCES_BASE_SIXTY_FOUR, Context.MODE_PRIVATE);
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(baos);
            oos.writeObject(object);
            String personBase64 = new String(Base64.encode(baos.toByteArray(), Base64.DEFAULT));
            Editor editor = sp.edit();
            editor.putString(key, personBase64);
            editor.apply();
        } catch (IOException e) {
        }
    }

    public static Object getObject(String key) {
        try {
            SharedPreferences sp = PlayerApp.getContext().getSharedPreferences(
                    SHARED_PREFERENCES_BASE_SIXTY_FOUR, Context.MODE_PRIVATE);
            String personBase64 = sp.getString(key, "");
            byte[] base64Bytes = Base64.decode(personBase64.getBytes(), Base64.DEFAULT);
            ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(base64Bytes));
            return ois.readObject();
        } catch (Exception e) {
            return null;
        }
    }
}
