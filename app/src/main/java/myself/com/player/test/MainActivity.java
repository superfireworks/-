package myself.com.player.test;

import android.support.annotation.FloatRange;
import android.view.View;
import android.widget.TextView;

import myself.com.player.BaseActivity;
import myself.com.player.R;
import myself.com.player.frameHttp.requestCategory.xutils.BaseRequest;
import myself.com.player.frameHttp.requestCategory.xutils.HttpXUtilsHelp;
import myself.com.player.globalUtils.CommonUtils;
import myself.com.player.widget.HtmlTextView;

/**
 * Created by Administrator on 2017/3/23 0023.
 */

public class MainActivity extends BaseActivity {

    private BaseRequest mRequest;

    @Override
    protected int setContentLayout() {
        return R.layout.activity_main;
    }

    @Override
    protected void initToolBar(int statusBarHeight) {

    }

    @Override
    protected void initData() {

    }

    @Override
    protected void initView() {
        findViewById(R.id.test_bt).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mRequest = new BaseRequest("http://precerpapi.lenovo.com/cerp/message/getdetail/73", new HttpXUtilsHelp.RequestCallBack() {
                    @Override
                    public void onFinish(HttpXUtilsHelp.RequestResult result, Object data) {
                        if (result == HttpXUtilsHelp.RequestResult.Success) {
                            CommonUtils.showToast(MainActivity.this, "Success!");
                            PostDetailBean post = (PostDetailBean) HttpXUtilsHelp.getInstance().parse(PostDetailBean.class, String.valueOf(data));
                            HtmlTextView htmlTextView = (HtmlTextView) findViewById(R.id.test_inner);
                            htmlTextView.setVisibility(View.VISIBLE);
                            htmlTextView.setHtmlText((TextView) findViewById(R.id.view_more), post.data.body, getResources().getDrawable(R.mipmap.ic_launcher));
                        } else if (result == HttpXUtilsHelp.RequestResult.NotFound) {
                            CommonUtils.showToast(MainActivity.this, "NotFound!");
                        } else if (result == HttpXUtilsHelp.RequestResult.HttpError) {
                            CommonUtils.showToast(MainActivity.this, "HttpError!");
                        }
                    }
                });
                mRequest.get();
                CommonUtils.showToast(MainActivity.this, "testBoolRes():" + testBoolRes(6));
            }
        });
    }

    private String testBoolRes(@FloatRange(from = 0.0f, to = 1.0f, fromInclusive = true, toInclusive = true) float value) {
        return null;
    }

    @Override
    protected void startWork() {

    }


}
