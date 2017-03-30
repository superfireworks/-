package myself.com.player.frameHttp;

/**
 * 网络框架基接口
 * 1.基本请求
 * 2.必备方法
 */
public interface IRequest {
    void cancel();
    void get();
    void post();
    void execute();
}
