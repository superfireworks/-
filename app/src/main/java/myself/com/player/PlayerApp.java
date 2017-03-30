package myself.com.player;

import android.app.Application;
import android.content.Context;

import org.xutils.x;

/**
 * Created by Administrator on 2017/3/23 0023.
 */

public class PlayerApp extends Application {

    public static Context mContext;

    public static Context getContext() {
        return mContext;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        //全局上下文
        mContext = getApplicationContext();

        x.Ext.init(this);
    }
}
