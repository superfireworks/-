package myself.com.player.frameHttp.requestCategory;
/**
 * Summary: 利用线程池重复利用资源，异步执行任务Runnable，减小创建线程开销
 * 杜cto自己瞎bb:除了handler执行的任务,其他线程池执行的都是开启的子线程异步执行的任务
 * 杜cto自己瞎bb:单例构造线程池,只开放public static执行线程方法,避免不同调用类下反复new线程池,减少占用
 * 杜cto自己瞎bb:提供了带有返回结果的执行方式,可以判断执行结果
 * 杜cto自己瞎bb:注意关闭资源
 * 杜cto自己瞎bb:含网络传输的和不含网络传输的有啥区别?只是线程容量?后期发现,网络请求最大线程数就是15,那么非网络请求最大线程数应该是20
 *
 */

import android.os.Handler;
import android.os.Looper;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class TaskExecutor {

    //目前谷歌推荐执行延时任务或者定时任务的api,在执行多线程延时任务时性能优于timer和timetask(优缺点详细见:boke)
    private static ScheduledThreadPoolExecutor gScheduledThreadPoolExecutor = null;
    private static Handler gMainHandler = null;
    //不包含网络传输处理过程的线程池执行对象
    private static ExecutorService gThreadPoolExecutor = null;
    //包含网络传输处理过程的线程池执行对象
    private static ExecutorService gNetProcessThreadPoolExecutor = null;

    //定时任务线程池构造(单例)
    private static void ensureScheduledThreadPoolExecutor() {
        if (gScheduledThreadPoolExecutor == null) {
            gScheduledThreadPoolExecutor = new ScheduledThreadPoolExecutor(2);
        }
    }

    //构造主线程looper的handler(单例)
    private static void ensureMainHandler() {
        if (gMainHandler == null) {
            gMainHandler = new Handler(Looper.getMainLooper());
        }
    }

    //线程池构造及参数解释
    /* ThreadPoolExecutor(
                       int corePoolSize,                       线程池维护线程的最少数量
					   int maximumPoolSize,                    线程池维护线程的最大数量
                       long keepAliveTime,                     线程池维护线程所允许的空闲时间
					   TimeUnit unit,                          线程池维护线程所允许的空闲时间的单位
                       BlockingQueue<Runnable> workQueue,      线程池所使用的缓冲队列
                       RejectedExecutionHandler handler        线程池对拒绝任务的处理策略
					   )
	*/
    //不包含网络传输处理过程的线程池执行对象的创建(单例)
    private static void ensureThreadPoolExecutor() {
        if (gThreadPoolExecutor == null) {
            gThreadPoolExecutor = new ThreadPoolExecutor(10, 20,
                    60L, TimeUnit.SECONDS,
                    new LinkedBlockingQueue<Runnable>(),
                    Executors.defaultThreadFactory());

        }
    }

    //包含网络传输处理过程的线程池执行对象的创建(单例)
    private static void ensureNetProcessThreadPoolExecutor() {
        if (gNetProcessThreadPoolExecutor == null) {
            gNetProcessThreadPoolExecutor = new ThreadPoolExecutor(10, 15,
                    60L, TimeUnit.SECONDS,
                    new LinkedBlockingQueue<Runnable>(),
                    Executors.defaultThreadFactory());
        }
    }

    // -------------------------------------执行任务---------------------------------------------------------

    /**
     * 立即执行不包含网络传输处理过程的线程
     */
    public static void executeTask(Runnable task) {
        ensureThreadPoolExecutor();
        gThreadPoolExecutor.execute(task);
    }

    /**
     * 立即执行包含网络传输处理过程的线程，可能存在等待阻塞的状况
     */
    public static void executeNetTask(Runnable task) {
        ensureNetProcessThreadPoolExecutor();
        gNetProcessThreadPoolExecutor.execute(task);
    }

	/*
       在Java5之后，任务分两类：一类是实现了Runnable接口的类，一类是实现了Callable接口的类。
	   两者都可以被ExecutorService执行，但是Runnable任务没有返回值，而Callable任务有返回值。
	   并且Callable的call()方法只能通过ExecutorService的(<T> task) 方法来执行，并且返回一个 <T><T>，是表示任务等待完成的 Future。
	*/

    /**
     * 立即执行带返回结果的任务
     */
    public static <T> Future<T> submitTask(Callable<T> task) {
        ensureThreadPoolExecutor();
        return gThreadPoolExecutor.submit(task);
    }

    /**
     * 延迟指定时间后执行任务
     */
    public static void scheduleTask(long delay, Runnable task) {
        ensureScheduledThreadPoolExecutor();
        gScheduledThreadPoolExecutor.schedule(task, delay, TimeUnit.MILLISECONDS);
    }

    /**
     * 创建并执行一个在给定初始延迟后首次启用的定期操作，后续操作具有给定的周期；
     * 也就是将在 initialDelay 后开始执行，然后在initialDelay+period 后执行，
     * 接着在 initialDelay + 2 * period 后执行，依此类推。
     * 如果任务的执行时间小于period，将会按上述规律执行。
     * 否则，则会按 任务的实际执行时间进行周期执行。
     * initialDelay 首次延时
     * period 周期时间
     */
    public static void scheduleTaskAtFixedRateIgnoringTaskRunningTime(long initialDelay, long period, Runnable task) {
        ensureScheduledThreadPoolExecutor();
        gScheduledThreadPoolExecutor.scheduleAtFixedRate(task, initialDelay, period, TimeUnit.MILLISECONDS);
    }

    /**
     * 创建并执行一个在给定初始延迟后首次启用的定期操作，
     * 随后，在每一次执行终止和下一次执行开始之间都存在给定的延迟，
     * 如果任务的执行时间超过了廷迟时间（delay），下一个任务则会在（当前任务执行所需时间+delay）后执行。
     * initialDelay 首次延时
     * period 周期时间
     */
    public static void scheduleTaskAtFixedRateIncludingTaskRunningTime(long initialDelay, long period, Runnable task) {
        ensureScheduledThreadPoolExecutor();
        gScheduledThreadPoolExecutor.scheduleWithFixedDelay(task, initialDelay, period, TimeUnit.MILLISECONDS);
    }

    /**
     * 执行在主线程的延时任务
     */
    public static void scheduleTaskOnUiThread(long delay, Runnable task) {
        ensureMainHandler();
        gMainHandler.postDelayed(task, delay);
    }

    /**
     * 执行在主线程的瞬时任务
     */
    public static void runTaskOnUiThread(Runnable task) {
        ensureMainHandler();
        gMainHandler.post(task);
    }

    /**
     * 关闭线程池,释放资源
     */
    public static void shutdown() {

        if (gThreadPoolExecutor != null) {
            gThreadPoolExecutor.shutdown();
            gThreadPoolExecutor = null;
        }

        if (gScheduledThreadPoolExecutor != null) {
            gScheduledThreadPoolExecutor.shutdown();
            gScheduledThreadPoolExecutor = null;
        }
    }
}
