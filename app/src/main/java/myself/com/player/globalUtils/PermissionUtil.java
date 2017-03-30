package myself.com.player.globalUtils;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.v4.app.Fragment;

/**
 * 6.0以后高危权限判断,和请求
 */
@SuppressWarnings("all")
public abstract class PermissionUtil {

    /**
     * 验证权限权限是否已给
     */
    public static boolean verifyPermissions(int[] grantResults) {
        for (int result : grantResults) {
            if (result != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }

    /**
     * 验证权限是否存在
     */
    public static boolean hasSelfPermission(Context context, String[] permissions) {
        if (!isMAbove()) {
            return true;
        }

        for (String permission : permissions) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (context.checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 验证权限是否存在
     */
    public static boolean hasSelfPermission(Context context, String permission) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return !isMAbove() || context.checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED;
        }
        //在6.0以下的版本中,所要求的权限需赋予在清单文件中,赋予在清单文件中既是已给权限,所以默认为true
        return true;
    }

    /**
     * 请求权限, 需要重写
     *
     * @see Activity#onRequestPermissionsResult(int, String[], int[])
     */
    public static void requestPermission(Activity activity, String[] permissions, int requestCode) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            activity.requestPermissions(permissions, requestCode);
        }
    }

    /**
     * 请求权限, 需要重写
     *
     * @see Fragment#onRequestPermissionsResult(int, String[], int[])
     */
    public static void requestPermission(Fragment fragment, String[] permissions, int requestCode) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            fragment.requestPermissions(permissions, requestCode);
        }
    }

    /**
     * 判断系统版本
     */
    public static boolean isMAbove() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.M;
    }

    public static boolean isLAbove() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP;
    }
}
