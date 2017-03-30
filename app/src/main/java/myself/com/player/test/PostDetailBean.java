package myself.com.player.test;

public class PostDetailBean {

    public String statusCode;
    public String message;
    public DataBean data;

    public class DataBean {
        public int id;
        public String subject;
        public int kudos;
        public int views;
        public String boardId;
        public String postTime;
        public String lastEditTime;
        public int meToo;
        public boolean IsAuthor;
        public boolean IsMetooGiven;
        public boolean editPermit;
        public boolean editExpired;
        public LastEditAuthor lastEditAuthor;
        public AuthorBean author;
        public String body;
    }
}
