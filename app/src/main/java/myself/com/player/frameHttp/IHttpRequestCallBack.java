package myself.com.player.frameHttp;

import org.xutils.common.Callback;

/**
 * 网络请求回调
 */
public interface IHttpRequestCallBack extends Callback.CommonCallback<IHttpRequestCallBack.RequestResult> {

    void onSuccess(RequestResult result);

    void onError(Throwable ex, boolean isOnCallback);

    void onCancelled(CancelledException cex);

    void onFinished();

    //结果
    public enum RequestResult {
        Success, Cancelled, NotFound, HttpError
    }
//
//    //完成回调
//    void onFinish(RequestResult result, String data);
}
