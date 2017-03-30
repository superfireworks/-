package myself.com.player.widget;

import android.app.Activity;
import android.content.Context;
import android.graphics.drawable.Drawable;
import android.support.annotation.NonNull;
import android.text.Editable;
import android.text.Html;
import android.text.Spannable;
import android.text.Spanned;
import android.text.SpannedString;
import android.text.TextUtils;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.text.style.ImageSpan;
import android.text.style.StrikethroughSpan;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.TextView;
import android.widget.Toast;

import org.xml.sax.XMLReader;

import java.io.IOException;
import java.net.URL;

import myself.com.player.R;
import myself.com.player.globalUtils.Logger;

@SuppressWarnings("all")
public class HtmlTextView extends TextView {
    private static final int MAX_LINES = 3;
    private static boolean isDoCancel;
    private Context mContext;

    public HtmlTextView(Context context) {
        this(context, null);
    }

    public HtmlTextView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public HtmlTextView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        this.mContext = context;
        setMovementMethod(LinkMovementMethod.getInstance());
        setMaxLines(MAX_LINES);
        setEllipsize(TextUtils.TruncateAt.END);
    }

    public void setHtmlText(final TextView viewMore, final String body, final Drawable defaultDrawable) {
        Spanned html = Html.fromHtml(
                body,
                new Html.ImageGetter() {
                    @Override
                    public Drawable getDrawable(final String source) {
                        isDoCancel = false;
                        asynGetDrawable(source, body, viewMore);
                        defaultDrawable.setBounds(0, 0, defaultDrawable.getIntrinsicWidth(), defaultDrawable.getIntrinsicHeight());
                        return defaultDrawable;
                    }
                },
                new MyTagHandler()
        );

        setText(html);
//        setText(textHtmlTrim(body, html));
    }

    private void asynGetDrawable(final String source, final String body, final TextView viewMore) {
        new Thread() {
            @Override
            public void run() {
                if (isDoCancel) {
                    return;
                }
                Drawable newDrawable = null;
                try {
                    newDrawable = Drawable.createFromStream(new URL(source).openStream(), "img.jpg");
                    newDrawable.setBounds(0, 0, newDrawable.getIntrinsicWidth(), newDrawable.getIntrinsicWidth());
                } catch (IOException e) {
                    e.printStackTrace();
                }

                if (newDrawable != null) {
                    final Spanned html = Html.fromHtml(
                            body,
                            new MyImageGet(newDrawable),
                            new MyTagHandler()
                    );

                    //update
                    ((Activity) mContext).runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            viewMoreToggle(body, html, viewMore);
                        }
                    });
                } else {
                    Logger.e(this, "newDrawable is null!");
                }
            }
        }.start();
    }

    private Spanned textHtmlTrim(String body, @NonNull Spanned html) {
        if (!TextUtils.isEmpty(body) && body.contains("img")) {
            return html;
        } else {
            return new SpannedString(html.toString().trim());
        }
    }

    private void viewMoreToggle(String body, Spanned html, final TextView viewMore) {

        setText(html);
//        setText(textHtmlTrim(body, html));

        //view more show or hide
        getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                getViewTreeObserver().removeOnPreDrawListener(this);
                Logger.d(this, "inner.getLineCount():" + getLineCount());
                if (getLineCount() > MAX_LINES || getLineCount() == 0) {
                    viewMore.setVisibility(View.VISIBLE);
                    viewMore.setText("view_more");
                    viewMore.setTextColor(mContext.getResources().getColor(R.color.blue));
                } else {
                    viewMore.setVisibility(View.GONE);
                }
                return false;
            }
        });

        //view more state toggle
        viewMore.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                Logger.d(this, "inner.getLineCount():" + getLineCount());
                if (getMaxLines() == MAX_LINES) {
                    setMaxLines(Integer.MAX_VALUE);
                    viewMore.setText("view_less");
                    viewMore.setTextColor(mContext.getResources().getColor(R.color.orange));
                } else {
                    setMaxLines(MAX_LINES);
                    setEllipsize(TextUtils.TruncateAt.END);
                    viewMore.setText("view_more");
                    viewMore.setTextColor(mContext.getResources().getColor(R.color.blue));
                }
            }
        });
    }

    private class MyImageGet implements Html.ImageGetter {
        private Drawable newDrawable;

        MyImageGet(@NonNull Drawable newDrawable) {
            this.newDrawable = newDrawable;
        }

        @Override
        public Drawable getDrawable(String source) {
            return newDrawable;
        }
    }

    private class MyTagHandler implements Html.TagHandler {

        public void handleTag(boolean opening, String tag, Editable output, XMLReader xmlReader) {
            if (tag.toLowerCase().equals("img")) {
                int len = output.length();
                ImageSpan[] images = output.getSpans(len - 1, len, ImageSpan.class);
                String imgURL = images[0].getSource();
                output.setSpan(new ImageClickSpan(imgURL), len - 1, len, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            } else if (tag.equalsIgnoreCase("strike")) {
                int len = output.length();
                if (opening) {
                    output.setSpan(new StrikethroughSpan(), len, len, Spannable.SPAN_MARK_MARK);
                } else {
                    StrikethroughSpan[] spans = output.getSpans(0, len, StrikethroughSpan.class);
                    if (spans.length > 0) {
                        for (int i = spans.length - 1; i >= 0; i--) {
                            if (output.getSpanFlags(spans[i]) == Spannable.SPAN_MARK_MARK) {
                                int start = output.getSpanStart(spans[i]);
                                output.removeSpan(spans[i]);
                                if (start != len) {
                                    output.setSpan(new StrikethroughSpan(), start, len, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
                                }
                                break;
                            }
                        }
                    }
                }
            } else {
                Logger.d(this, "No processing tag:" + tag);
            }
        }

        class ImageClickSpan extends ClickableSpan {
            private String url;

            ImageClickSpan(String url) {
                this.url = url;
            }

            @Override
            public void onClick(View widget) {
                if (TextUtils.isEmpty(url)) {
                    Toast.makeText(mContext, "imgUrl is null!", Toast.LENGTH_SHORT).show();
                } else {
                    if (!(mContext instanceof Activity) || ((Activity) mContext).isFinishing() || ((Activity) mContext).isDestroyed()) {
                        return;
                    }
                }
            }
        }
    }

    public static void cancelPictureDialog(Activity mActivity) {
    }

    public static void cancelDrawableGetter() {
        isDoCancel = true;
    }
}
