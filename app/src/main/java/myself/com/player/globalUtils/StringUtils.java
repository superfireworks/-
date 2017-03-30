package myself.com.player.globalUtils;

import android.content.Context;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.SpannedString;
import android.text.TextUtils;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.ForegroundColorSpan;
import android.text.style.UnderlineSpan;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Date;
import java.util.Locale;

import myself.com.player.R;

public class StringUtils {

    public static SpannableString getLinkStr(CharSequence str, Context context) {
        return getLinkStr(str, context, R.color.orange);
    }

    public static SpannableString getLinkStr(CharSequence str, Context context,
                                             int color) {
        if (TextUtils.isEmpty(str)) {
            return new SpannableString("");
        }
        SpannableString ss = new SpannableString(str);
        ss.setSpan(
                new ForegroundColorSpan(context.getResources().getColor(color)),
                0, str.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE); //
        ss.setSpan(new UnderlineSpan(), 0, str.length(),
                Spannable.SPAN_EXCLUSIVE_EXCLUSIVE); //
        return ss;
    }

    public static String getNameByUrl(String url) {
        String[] temps = url.split("/");
        return temps[temps.length - 1];
    }

    public static String formatServerResponse(String result) {
        String slash = "\\\\\\\"";
        String doubleS = "\\\\\\\\";
        result = result.replaceAll("\\\\n", "");
        result = result.replaceAll("\\\\t", "");
        result = result.replaceAll("\\\\r", "");
        result = result.replaceAll(slash, "\"");
        result = result.replaceAll(doubleS, "\\\\");
        if (result.startsWith("\"")) {
            result = result.substring(1, result.length() - 1);
        }
        return result;
    }

    public static String getReleaseDateInterval(String releaseDate) {
        String interval = "";
        String rd[] = releaseDate.split("-");
        if (rd.length < 3) {
            return "N/A";
        }
        Date today = new Date();
        int y = today.getYear() + 1900;
        if (y != parseInt(rd[0])) {
            interval = String.valueOf(y - parseInt(rd[0])) + "Y";
        } else if (today.getMonth() + 1 != parseInt(rd[1])) {
            interval = String.valueOf(today.getMonth() + 1 - parseInt(rd[1]))
                    + "M";
        } else if (today.getDate() != parseInt(rd[2])) {
            int d = today.getDate() - parseInt(rd[2]);
            if (d >= 7) {
                interval = String.valueOf(d / 7) + "W";
            } else {
                interval = String.valueOf(d) + "D";
            }
        } else {
            interval = "Today";
        }
        return interval;
    }

    public static int parseInt(String integer) {
        int result = -1;
        try {
            result = Integer.parseInt(integer);
        } catch (Exception e) {
            Logger.e(StringUtils.class, "parseInt", e);
        }
        return result;
    }

    public static long parseLong(String longStr) {
        long result = -1;
        try {
            result = Long.parseLong(longStr);
        } catch (Exception e) {
            Logger.e(StringUtils.class, e.getMessage(), e);
        }
        return result;
    }

    public static double parseDouble(String d) {
        double result = -1;
        try {
            result = Double.parseDouble(d);
        } catch (Exception e) {
            Logger.e(StringUtils.class, "parseDouble", e);
        }
        return result;
    }

    public static String formatPopularity(String popularity) {
        String result;
        int p = parseInt(popularity);
        if (p < 1000) {
            result = String.valueOf(p);
        } else if (p < 1000 * 1000) { // k
            result = String.valueOf(Math.round((double) p / 1000)) + "K";
        } else if (p < 1000 * 1000 * 1000) { // million
            result = String.valueOf(Math.round((double) p / (1000 * 1000))) + "M";
        } else {
            result = String.valueOf(Math.round((double) p / (1000 * 1000 * 1000))) + "B";
        }
        return result;
    }

    public static String formatFileSize(long fileS, Context context) {
        // Conversion File Size
        DecimalFormat df = new DecimalFormat("#.00");
        String fileSizeString = "";
        if (fileS == 0) {
            fileSizeString = "0";
        } else if (fileS < 1024) {
            fileSizeString = df.format((double) fileS) + context.getString(R.string.b_text);
        } else if (fileS < 1024 * 1024) {
            fileSizeString = df.format((double) fileS / 1024) + context.getString(R.string.k_text);
        } else if (fileS < 1024 * 1024 * 1024) {
            fileSizeString = df.format((double) fileS / 1048576) + context.getString(R.string.m_text);
        } else {
            fileSizeString = df.format((double) fileS / 1073741824) + context.getString(R.string.g_text);
        }
        return fileSizeString;
    }

    public static String getLanguage() {
        String language = "";
        Locale.getDefault();
        language = updateLanguage(Locale.getDefault().getLanguage()) + "-"
                + Locale.getDefault().getCountry();
        return language.toLowerCase(Locale.getDefault());
    }

    private static String updateLanguage(String old) {
        String language = old.toLowerCase(Locale.getDefault());
        if (language.equals("iw")) {
            language = "he";
        } else if (language.equals("in")) {
            language = "id";
        } else if (language.equals("ji")) {
            language = "yi";
        }

        return language;
    }

    public static boolean isEmpty(Object... o) {
        for (Object object : o) {
            if (isEmpty(object))
                return true;
        }
        return false;
    }

    private static boolean isEmpty(Object o) {
        if (o == null) {
            return true;
        }
        return o instanceof String && TextUtils.isEmpty((String) o);

    }

    public static String setNoNullString(JSONObject json, String key) {
        if (json.has(key)) {
            try {
                return json.getString(key);
            } catch (JSONException e) {
                return "";
            }
        }
        return "";
    }

    public static SpannedString getHintText(Context mContext, int resID) {
        SpannableString ss = new SpannableString(mContext.getString(resID));//hint  value
        AbsoluteSizeSpan ass = new AbsoluteSizeSpan(14, true);// true is sp
        ss.setSpan(ass, 0, ss.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        SpannedString spannedString = new SpannedString(ss);
        return spannedString;
    }

    public static String getPointNumber(double number) {
        Logger.d(StringUtils.class, "getPointNumber:" + number);
        return NumberFormat.getNumberInstance(Locale.getDefault()).format(number);
    }

    public static String getPointNumber(String number) {
        Logger.d(StringUtils.class, "getPointNumber:" + number);
        float floatNumber = Float.parseFloat(number);
        return NumberFormat.getNumberInstance(Locale.getDefault()).format(floatNumber);
    }

    public static String getPercentNumber(double number) {
        NumberFormat percentFormat = NumberFormat.getPercentInstance(Locale.getDefault());
        return percentFormat.format(number);
    }

    public static String getImageUrl(String imageUri) {
        return imageUri.replace(" ", "%20");
    }
}
