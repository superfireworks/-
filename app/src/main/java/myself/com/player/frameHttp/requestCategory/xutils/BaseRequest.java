package myself.com.player.frameHttp.requestCategory.xutils;

import org.xutils.common.Callback;
import org.xutils.http.HttpMethod;
import org.xutils.http.RequestParams;

import java.util.Map;

import myself.com.player.globalUtils.Logger;

/**
 * 项目内所有网络请求的基类
 * 其他请求继承该请求,统一管理
 */
public class BaseRequest {

    private Callback.Cancelable mRequest;
    private RequestParams mParams;
    private HttpXUtilsHelp.RequestCallBack mCallback;

    public BaseRequest(String url, HttpXUtilsHelp.RequestCallBack callBack) {
        initRequest(url, null, null, null, callBack);
    }

    public BaseRequest(String url, Map<String, String> headerParams,
                       Map<String, String> queryParams, Map<String, String> bodyParams,
                       HttpXUtilsHelp.RequestCallBack callBack) {
        initRequest(url, headerParams, queryParams, bodyParams, callBack);
    }

    private void initRequest(String url, Map<String, String> headerParams,
                             Map<String, String> queryParams, Map<String, String> bodyParams,
                             HttpXUtilsHelp.RequestCallBack callBack) {
        mParams = HttpXUtilsHelp.getInstance().makeRequestParams(url, headerParams, queryParams, bodyParams);
        this.mCallback = callBack;
        Logger.request(this, "mUrl:" + url);
    }

    public void post() {
        execute(HttpMethod.POST);
    }

    public void get() {
        execute(HttpMethod.GET);
    }

    private void execute(HttpMethod method) {
        switch (method) {
            case GET:
                mRequest = HttpXUtilsHelp.getInstance().get(mParams, mCallback);
                break;
            case POST:
                mRequest = HttpXUtilsHelp.getInstance().post(mParams, mCallback);
                break;
        }
    }

    public void cancel() {
        if (mRequest != null) {
            HttpXUtilsHelp.getInstance().cancel(mRequest);
        }
    }
}
