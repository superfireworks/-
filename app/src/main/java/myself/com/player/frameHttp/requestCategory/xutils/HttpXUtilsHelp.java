package myself.com.player.frameHttp.requestCategory.xutils;

import android.support.annotation.NonNull;
import android.text.TextUtils;

import com.google.gson.Gson;

import org.xutils.common.Callback;
import org.xutils.http.HttpMethod;
import org.xutils.http.RequestParams;
import org.xutils.http.app.HttpRetryHandler;
import org.xutils.http.request.UriRequest;
import org.xutils.x;

import java.io.File;
import java.util.LinkedList;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import myself.com.player.globalUtils.Logger;

/**
 * xutils请求封装
 * xutils提供所有sdk内容,不足只能在此类补充
 * 便于替换网络框架
 */
@SuppressWarnings("all")
public class HttpXUtilsHelp {

    //最大重新请求次数
    private static final int DEFAULT_MAX_RETRY_COUNT = 100;
    //请求集合
    private static LinkedList<Callback.Cancelable> httpQueue = new LinkedList<>();
    //包含网络传输处理过程的线程池执行对象
    private static ExecutorService mNetProcessThreadPoolExecutor = null;
    //重复请求对象
    private static HttpRetryHandler httpRetryHandler = new HttpRetryHandler();

    //单例
    private HttpXUtilsHelp() {
    }

    private static HttpXUtilsHelp instance;

    public static HttpXUtilsHelp getInstance() {
        if (instance == null) {
            synchronized (HttpXUtilsHelp.class) {
                if (instance == null) {
                    instance = new HttpXUtilsHelp();
                }
            }
        }
        return instance;
    }

    //创建请求线程池,最大15
    private static void ensureNetProcessThreadPoolExecutor() {
        if (mNetProcessThreadPoolExecutor == null) {
            mNetProcessThreadPoolExecutor = new ThreadPoolExecutor(10, 15,
                    60L, TimeUnit.SECONDS,
                    new LinkedBlockingQueue<Runnable>(),
                    Executors.defaultThreadFactory());
        }
    }

    //结果type
    public enum RequestResult {
        Success, Cancelled, NotFound, HttpError
    }

    //回调
    public interface RequestCallBack {
        void onFinish(RequestResult result, Object data);
    }

    //下载回调
    public abstract class DownloadCallBack implements RequestCallBack {

        @Override
        public void onFinish(RequestResult result, Object data) {

        }

        public abstract void onFinish(RequestResult result, File data);

        public abstract void onWaiting();

        public abstract void onStarted();

        public abstract void onLoading(long total, long current, boolean isDownloading);
    }

    //参数
    public RequestParams makeRequestParams(String url, Map<String, String> header, Map<String, String> query, Map<String, String> body) {
        final RequestParams params = new RequestParams(url);

        //add header
        if (header != null) {
            for (Map.Entry<String, String> entry : header.entrySet()) {
                params.addHeader(entry.getKey(), entry.getValue());
            }
        }

        //add query
        if (query != null) {
            for (Map.Entry<String, String> entry : query.entrySet()) {
                params.addQueryStringParameter(entry.getKey(), entry.getValue());
            }

        }

        //add body
        if (body != null) {
            for (Map.Entry<String, String> entry : body.entrySet()) {
                params.addBodyParameter(entry.getKey(), entry.getValue());
            }
        }

        //设置线程池管理请求线程
        ensureNetProcessThreadPoolExecutor();
        params.setExecutor(mNetProcessThreadPoolExecutor);

        //设置重新请求
        httpRetryHandler.setMaxRetryCount(DEFAULT_MAX_RETRY_COUNT);
        params.setHttpRetryHandler(httpRetryHandler);

        //打印请求参数信息
        new Thread() {
            @Override
            public void run() {
                Logger.request(HttpXUtilsHelp.this, params.toString());
            }
        }.start();

        return params;
    }

    //请求
    //get
    public Callback.Cancelable get(@NonNull RequestParams params, @NonNull final RequestCallBack callBack) {

        params.setMethod(HttpMethod.GET);

        Callback.Cancelable cancelable = x.http().get(params, new Callback.CommonCallback<String>() {

            @Override
            public void onSuccess(String result) {
                httpQueue.remove(this);
                callBack.onFinish(RequestResult.Success, result);
            }

            @Override
            public void onError(Throwable ex, boolean isOnCallback) {
                httpQueue.remove(this);
                callBack.onFinish(TextUtils.equals(ex.getMessage(), "404") ? RequestResult.HttpError : RequestResult.NotFound, ex);
            }

            @Override
            public void onCancelled(CancelledException cex) {
                httpQueue.remove(this);
            }

            @Override
            public void onFinished() {
                httpQueue.remove(this);
            }
        });
        httpQueue.add(cancelable);
        return cancelable;
    }

    //post
    public Callback.Cancelable post(@NonNull RequestParams params, @NonNull final RequestCallBack callBack) {

        params.setMethod(HttpMethod.POST);

        Callback.Cancelable cancelable = x.http().post(params, new Callback.CommonCallback<String>() {
            @Override
            public void onSuccess(String result) {
                httpQueue.remove(this);
                callBack.onFinish(RequestResult.Success, result);
            }

            @Override
            public void onError(Throwable ex, boolean isOnCallback) {
                httpQueue.remove(this);
                callBack.onFinish(TextUtils.equals(ex.getMessage(), "404") ? RequestResult.HttpError : RequestResult.NotFound, ex);
            }

            @Override
            public void onCancelled(CancelledException cex) {
                httpQueue.remove(this);
            }

            @Override
            public void onFinished() {
                httpQueue.remove(this);
            }
        });
        httpQueue.add(cancelable);
        return cancelable;
    }

    /**
     * 上传文件
     */
    public static Callback.Cancelable upLoadFile(@NonNull RequestParams params, @NonNull final DownloadCallBack callback) {

        //断点上传
        params.setMultipart(true);

        Callback.Cancelable cancelable = x.http().get(params, new Callback.ProgressCallback<File>() {
            @Override
            public void onWaiting() {
                callback.onWaiting();
            }

            @Override
            public void onStarted() {
                callback.onStarted();
            }

            @Override
            public void onLoading(long total, long current, boolean isDownloading) {
                callback.onLoading(total, current, isDownloading);
            }

            @Override
            public void onSuccess(File result) {
                httpQueue.remove(this);
                callback.onFinish(RequestResult.Success, result);
            }

            @Override
            public void onError(Throwable ex, boolean isOnCallback) {
                httpQueue.remove(this);
                callback.onFinish(TextUtils.equals(ex.getMessage(), "404") ? RequestResult.HttpError : RequestResult.NotFound, ex);
            }

            @Override
            public void onCancelled(CancelledException cex) {
                httpQueue.remove(this);
            }

            @Override
            public void onFinished() {
                httpQueue.remove(this);
            }
        });

        httpQueue.add(cancelable);
        return cancelable;
    }

    /**
     * 下载文件
     */
    public static Callback.Cancelable DownLoadFile(@NonNull RequestParams params, @NonNull String filepath, @NonNull final DownloadCallBack callback) {

        //设置断点续传
        params.setAutoResume(true);
        params.setSaveFilePath(filepath);

        Callback.Cancelable cancelable = x.http().get(params, new Callback.ProgressCallback<File>() {
            @Override
            public void onWaiting() {
                callback.onWaiting();
            }

            @Override
            public void onStarted() {
                callback.onStarted();
            }

            @Override
            public void onLoading(long total, long current, boolean isDownloading) {
                callback.onLoading(total, current, isDownloading);
            }

            @Override
            public void onSuccess(File result) {
                httpQueue.remove(this);
                callback.onFinish(RequestResult.Success, result);
            }

            @Override
            public void onError(Throwable ex, boolean isOnCallback) {
                httpQueue.remove(this);
                callback.onFinish(TextUtils.equals(ex.getMessage(), "404") ? RequestResult.HttpError : RequestResult.NotFound, ex);
            }

            @Override
            public void onCancelled(CancelledException cex) {
                httpQueue.remove(this);
            }

            @Override
            public void onFinished() {
                httpQueue.remove(this);
            }
        });

        httpQueue.add(cancelable);
        return cancelable;
    }

    /**
     * 解析结果
     * 转换result为resultType类型的对象
     *
     * @param resultClass 返回值类型
     * @param result      字符串数据
     */
    public Object parse(Class<?> resultClass, String result) {
        try {
            return new Gson().fromJson(result, resultClass);
        } catch (Exception e) {
            Logger.request(HttpXUtilsHelp.this, e.getLocalizedMessage());
        }
        return null;
    }

    //取消单个
    public void cancel(@NonNull Callback.Cancelable cancelable) {
        if (!cancelable.isCancelled()) {
            cancelable.cancel();
        }
    }

    //取消所有正在进行的请求
    public void cancelAll() {
        if (httpQueue != null) {
            for (Callback.Cancelable cancelable : httpQueue) {
                if (!cancelable.isCancelled()) {
                    cancelable.cancel();
                }
            }
        }
        if (mNetProcessThreadPoolExecutor != null) {
            mNetProcessThreadPoolExecutor.shutdown();
            mNetProcessThreadPoolExecutor = null;
        }
    }

    //再次请求
    public void retry(@NonNull RequestParams params, RequestCallBack callBack, UriRequest request, Throwable ex, int currentCount) {
        HttpRetryHandler retryHandler = params.getHttpRetryHandler();
        if (retryHandler != null && retryHandler.canRetry(request, ex, currentCount)) {
            if (params.getMethod() == HttpMethod.GET) {
                get(params, callBack);
            } else if (params.getMethod() == HttpMethod.POST) {
                post(params, callBack);
            }
        }
    }
}
