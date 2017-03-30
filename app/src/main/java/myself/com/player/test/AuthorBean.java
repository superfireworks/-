package myself.com.player.test;

public class AuthorBean {

    public int id;
    public String name;
    public String ssoId;
    public String email;
    public String avatar;
    public boolean online;
    public RankBean rank;
    public String product;

    @Override
    public String toString() {
        return "AuthorBean{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", ssoId='" + ssoId + '\'' +
                ", email='" + email + '\'' +
                ", avatar='" + avatar + '\'' +
                ", online=" + online +
                ", rank=" + rank +
                ", product='" + product + '\'' +
                '}';
    }
}
