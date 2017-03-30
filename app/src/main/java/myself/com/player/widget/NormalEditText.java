package myself.com.player.widget;

import android.content.Context;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.widget.EditText;

import myself.com.player.constant.ConstantTheme;

/**
 * 主题样式文本编辑框, 正常
 */
public class NormalEditText extends EditText {
    private static Typeface mTypeFace = null;

    public NormalEditText(Context context) {
        super(context);
        init(context);
    }

    public NormalEditText(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public NormalEditText(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init(context);
    }

    private void init(Context context) {
        if (mTypeFace == null) {
            mTypeFace = Typeface.createFromAsset(context.getAssets(), ConstantTheme.FONT_NORMAL);
        }
        this.setTypeface(mTypeFace);
    }
}
