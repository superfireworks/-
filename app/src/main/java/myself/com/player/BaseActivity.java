package myself.com.player;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.LayoutRes;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import java.lang.reflect.Field;

public abstract class BaseActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //必须放置在setContentView前面
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        //设置页面布局
        setContentView(setContentLayout());
        //设置状态栏和导航栏样式
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.clearFlags(
                    WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS
                            | WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);

            //作用: 正常显示状态栏和导航栏,状态栏覆盖在当前页面上.只需要设置状态栏背景透明,就可以实现随着内容的变色,状态栏变色
            //注意: 因为状态栏会覆盖页面,所以toolbar需要设置PaddingTop,值可以通过下面反射获取
            window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);

            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            //状态栏颜色
            window.setStatusBarColor(Color.TRANSPARENT);
            //导航栏颜色
            window.setNavigationBarColor(getResources().getColor(R.color.primary));
        }

        //设置ToolBar
        initToolBar(getStatusBarHeight());
        initData();
        initView();
        startWork();
    }

    protected abstract void startWork();

    protected abstract void initView();

    protected abstract void initData();

    /**
     * 设置ToolBar
     *
     * @param statusBarHeight 状态栏高度,用于设置PaddingTop
     */
    protected abstract void initToolBar(int statusBarHeight);

    /**
     * 设置布局
     */
    @LayoutRes
    protected abstract int setContentLayout();

    /**
     * 通过反射的方式获取状态栏高度
     */
    private int getStatusBarHeight() {
        try {
            Class<?> c = Class.forName("com.android.internal.R$dimen");
            Object obj = c.newInstance();
            Field field = c.getField("status_bar_height");
            int x = Integer.parseInt(field.get(obj).toString());
            return getResources().getDimensionPixelSize(x);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }
}
