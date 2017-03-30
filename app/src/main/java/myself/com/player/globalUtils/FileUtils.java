package myself.com.player.globalUtils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

import myself.com.player.constant.ConstantLocal;

public class FileUtils {

    public static void deleteFileRecursive(String path) {
        try {
            File file = new File(path);
            if (file.isDirectory()) {
                Logger.d(FileUtils.class, "start deleting directory: " + path);
                String[] files = file.list();
                if (files == null || files.length == 0) {
                    Logger.d(FileUtils.class, "delete empty folder: " + file.getAbsolutePath());
                    // empty folder;
                    file.delete();
                } else {
                    Logger.d(FileUtils.class, "start deleting files in directory: " + file.getAbsolutePath());
                    for (int j = 0; j < files.length; j++) {
                        deleteFileRecursive(path + "/" + files[j]);
                    }
                    Logger.d(FileUtils.class, "delete directory: " + file.getAbsolutePath());
                    file.delete();
                }
            } else {
                Logger.d(FileUtils.class, "delete file: " + path);
                file.delete();
            }
        } catch (Exception e) {
            Logger.e(FileUtils.class, e.getLocalizedMessage(), e);
        }
    }

    public static boolean checkFileExists(String dir, String filename) {
        // There are no local judge this file
        File file_dir = new File(dir);
        if (!file_dir.exists()) {
            file_dir.mkdirs();
            return false;
        }
        File file = new File(dir, filename);
        return file.exists();
    }

    public static long getFileSize(File file) {
        long size = 0;
        if (file.isDirectory()) {
            File[] files = file.listFiles();
            if (files != null) {
                for (int i = 0; i < files.length; i++) {
                    size += getFileSize(files[i]);
                }
            }
        } else {
            size += file.length();
        }
        return size;
    }

    public static void saveHtmlFile(String content, String docid) {
        try {
            File file = new File(ConstantLocal.HTML_FILE_DIR);
            if (!file.exists()) {
                file.mkdirs();
            }
            File htmlFile = new File(ConstantLocal.HTML_FILE_DIR, docid + ".html");
            FileOutputStream fos = new FileOutputStream(htmlFile);
            fos.write(content.getBytes());
            fos.flush();
            fos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String getHtml(String docid) {
        String solutionDetail = "";
        try {
            File file = new File(ConstantLocal.HTML_FILE_DIR, docid + ".html");
            FileInputStream fis = new FileInputStream(file);
            byte[] buff = new byte[1024];
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            int len;
            while ((len = fis.read(buff)) != -1) {
                baos.write(buff, 0, len);
            }
            byte[] data = baos.toByteArray();
            baos.close();
            fis.close();
            solutionDetail = new String(data);
        } catch (Exception e) {
            Logger.e(FileUtils.class, "getHtml", e);
        }
        return solutionDetail;
    }
}
