package myself.com.player.frameHttp;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import org.xutils.http.RequestParams;

import java.util.Iterator;
import java.util.Map;

/**
 * 网络请求参数制作工具
 * 不允许在其他文件下使用网络框架内容
 */
@SuppressWarnings("all")
public class ClientRequestParams {

    /**
     * 生成无请求头的请求参数
     */
    public static RequestParams generateSimpleRequestParams() {
        return new RequestParams();
    }

    /**
     * 生成带默认请求头的请求参数
     */
    public static RequestParams generateDefaultRequestParams() {
        RequestParams params = new RequestParams();
        params.addHeader("key", "value");
        params.addHeader("key", "value");
        params.addHeader("key", "value");
        return params;
    }

    /**
     * 传递请求头生成的请求参数
     */
    public static RequestParams generateNeedRequestParams(@NonNull Map<String, String> header) {
        RequestParams params = new RequestParams();
        for (Map.Entry entry : header.entrySet()) {
            params.addHeader(String.valueOf(entry.getKey()), String.valueOf(entry.getValue()));
        }
        return params;
    }

    /**
     * 请求体
     */
    public static RequestParams addRequestParams(@Nullable Map<String, String> query, @Nullable Map<String, String> body) {
        RequestParams params = new RequestParams();

        //query
        if (query != null) {
            Iterator<Map.Entry<String, String>> itQuery = query.entrySet().iterator();
            while (itQuery.hasNext()) {
                Map.Entry<String, String> entry = itQuery.next();
                params.addQueryStringParameter(entry.getKey(), entry.getValue());
            }
        }

        //body
        if (body != null) {
            Iterator<Map.Entry<String, String>> itBody = body.entrySet().iterator();
            while (itBody.hasNext()) {
                Map.Entry<String, String> entry = itBody.next();
                params.addBodyParameter(entry.getKey(), entry.getValue());
            }
        }
        return params;
    }

    /**
     * 请求体
     */
    public static RequestParams addRequestParams(@NonNull String code, @Nullable Map<String, String> query, @Nullable Map<String, String> body) {
        RequestParams params = new RequestParams(code);

        //query
        if (query != null) {
            Iterator<Map.Entry<String, String>> itQuery = query.entrySet().iterator();
            while (itQuery.hasNext()) {
                Map.Entry<String, String> entry = itQuery.next();
                params.addQueryStringParameter(entry.getKey(), entry.getValue());
            }
        }

        //body
        if (body != null) {
            Iterator<Map.Entry<String, String>> itBody = body.entrySet().iterator();
            while (itBody.hasNext()) {
                Map.Entry<String, String> entry = itBody.next();
                params.addBodyParameter(entry.getKey(), entry.getValue());
            }
        }
        return params;
    }

    /**
     * 上传文件
     */
    public static RequestParams addRequestParams(@Nullable Map<String, String> query, @Nullable Map<String, String> body, @NonNull Map<String, UploadFile> file) {
        RequestParams params = new RequestParams();

        //query
        if (query != null) {
            Iterator<Map.Entry<String, String>> itQuery = query.entrySet().iterator();
            while (itQuery.hasNext()) {
                Map.Entry<String, String> entry = itQuery.next();
                params.addQueryStringParameter(entry.getKey(), entry.getValue());
            }
        }

        //body
        if (body != null) {
            Iterator<Map.Entry<String, String>> itBody = body.entrySet().iterator();
            while (itBody.hasNext()) {
                Map.Entry<String, String> entry = itBody.next();
                params.addBodyParameter(entry.getKey(), entry.getValue());
            }
        }

        Iterator<Map.Entry<String, UploadFile>> itFile = file.entrySet().iterator();
        while (itFile.hasNext()) {
            Map.Entry<String, UploadFile> entry = itFile.next();
            UploadFile value = entry.getValue();
            params.addBodyParameter(entry.getKey(), value.file, value.contentType, value.fileName);
        }

        return params;
    }

    /**
     * 上传文件
     */
    public static RequestParams addRequestParams(@Nullable Map<String, String> header, @Nullable Map<String, String> query, @Nullable Map<String, String> body, @NonNull Map<String, UploadFile> file) {
        RequestParams params = new RequestParams();
        //header
        if (header != null) {
            Iterator<Map.Entry<String, String>> itQuery = header.entrySet().iterator();
            while (itQuery.hasNext()) {
                Map.Entry<String, String> entry = itQuery.next();
                params.addHeader(entry.getKey(), entry.getValue());
            }
        }

        //query
        if (query != null) {
            Iterator<Map.Entry<String, String>> itQuery = query.entrySet().iterator();
            while (itQuery.hasNext()) {
                Map.Entry<String, String> entry = itQuery.next();
                params.addQueryStringParameter(entry.getKey(), entry.getValue());
            }
        }

        //body
        if (body != null) {
            Iterator<Map.Entry<String, String>> itBody = body.entrySet().iterator();
            while (itBody.hasNext()) {
                Map.Entry<String, String> entry = itBody.next();
                params.addBodyParameter(entry.getKey(), entry.getValue());
            }
        }

        Iterator<Map.Entry<String, UploadFile>> itFile = file.entrySet().iterator();
        while (itFile.hasNext()) {
            Map.Entry<String, UploadFile> entry = itFile.next();
            UploadFile value = entry.getValue();
            params.addBodyParameter(entry.getKey(), value.file, value.contentType, value.fileName);
        }
        return params;
    }
}
