package myself.com.player.frameHttp;

import java.io.File;

/**
 * 下载请求回调
 */
public interface IDownloadRequestCallBack {
    void onStart();

    void onLoading(long total, long current, boolean isDownloading);

    void onSuccess(File result);

    void onFail(String result);

    void onFinished();
}
