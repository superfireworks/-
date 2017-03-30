package myself.com.player.globalUtils;

import android.content.Context;
import android.os.Handler;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.gifdecoder.GifDecoder;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.load.resource.drawable.GlideDrawable;
import com.bumptech.glide.load.resource.gif.GifDrawable;
import com.bumptech.glide.request.Request;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.GlideDrawableImageViewTarget;
import com.bumptech.glide.request.target.Target;

import java.util.ArrayList;
import java.util.List;

import myself.com.player.PlayerApp;

public class HelpBitmapUtils {

    private List<GlideDrawableImageViewTarget> mGlideTargetList;

    private HelpBitmapUtils() {
    }

    private static HelpBitmapUtils mHelpBitmapUtils;
    public static final int GIF_PLAY_DONE = 0;

    public static HelpBitmapUtils getInstance() {
        if (mHelpBitmapUtils == null) {
            synchronized (HelpBitmapUtils.class) {
                if (mHelpBitmapUtils == null) {
                    mHelpBitmapUtils = new HelpBitmapUtils();
                }
            }
        }
        return mHelpBitmapUtils;
    }

    public GlideDrawableImageViewTarget playGif(ImageView container, int gifId, final Handler handler) {
        if (mGlideTargetList == null) {
            mGlideTargetList = new ArrayList<>();
        }
        GlideDrawableImageViewTarget gifTarget = Glide.with(PlayerApp.getContext())
                .load(gifId)
                .listener(new RequestListener<Integer, GlideDrawable>() {
                    @Override
                    public boolean onException(Exception e, Integer model, Target<GlideDrawable> target,
                                               boolean isFirstResource) {
                        return false;
                    }

                    @Override
                    public boolean onResourceReady(GlideDrawable resource, Integer model,
                                                   Target<GlideDrawable> target, boolean isFromMemoryCache,
                                                   boolean isFirstResource) {
                        if (handler != null) {
                            // 计算动画时长
                            long duration = 0;
                            GifDrawable drawable = (GifDrawable) resource;
                            GifDecoder decoder = drawable.getDecoder();
                            for (int i = 0; i < drawable.getFrameCount(); i++) {
                                duration += decoder.getDelay(i);
                            }
                            //发送延时消息，通知动画结束
                            handler.sendEmptyMessageDelayed(GIF_PLAY_DONE, duration);
                        }
                        return false;
                    }
                })
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .skipMemoryCache(true)
                .into(new GlideDrawableImageViewTarget(container, 1));
        mGlideTargetList.add(gifTarget);
        return gifTarget;
    }

    public void clearAllGif(Context mContext) {
        if (mGlideTargetList != null) {
            for (int x = 0; x < mGlideTargetList.size(); x++) {
                Request previous = mGlideTargetList.get(x).getRequest();
                if (previous != null) {
                    previous.clear();
                    previous.recycle();
                }
            }
            Glide.get(mContext).clearMemory();
            mGlideTargetList.clear();
            Glide.with(mContext).onDestroy();
        }
    }
}
