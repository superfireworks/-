package myself.com.player.widget;

import android.content.Context;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.widget.TextView;

import myself.com.player.constant.ConstantTheme;

/**
 * 主题样式字体, 正常
 */
public class NormalTextView extends TextView {
    private static Typeface mTypeFace = null;

    public NormalTextView(Context context) {
        super(context);
        init(context);
    }

    public NormalTextView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public NormalTextView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init(context);
    }

    private void init(Context context) {
        if (mTypeFace == null) {
            mTypeFace = Typeface.createFromAsset(context.getAssets(), ConstantTheme.FONT_NORMAL);
        }
        this.setTypeface(mTypeFace);
    }

    public static void clearFont() {
        mTypeFace = null;
    }
}