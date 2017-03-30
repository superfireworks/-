package myself.com.player.frameHttp;

import java.io.File;

/**
 * 上传文件实体
 */
public class UploadFile {
    public File file;
    public String fileName;
    public String contentType;

    public UploadFile(File file, String fileName, String contentType) {
        this.file = file;
        this.fileName = fileName;
        this.contentType = contentType;
    }
}