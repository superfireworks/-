package myself.com.player.globalUtils;

import android.content.Context;
import android.content.res.XmlResourceParser;
import android.text.TextUtils;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class XMLResParser {
    private final Context mContext;

    public XMLResParser(Context context) {
        mContext = context;
    }

    public RootData parser(int xmlId) {
        RootData result = new RootData();

        XMLResData tempData = null;
        int tempDepth;
        XMLResData data = result;
        int depth = 1;

        try {
            XmlResourceParser xml = mContext.getResources().getXml(xmlId);
            int xmlEventType;

            String name ;
            while ((xmlEventType = xml.next()) != XmlResourceParser.END_DOCUMENT) {
                switch (xmlEventType) {
                case XmlResourceParser.START_TAG:
                    name = xml.getName();
                    tempDepth = xml.getDepth();
                    if (tempDepth == 1) {
                        result.fillAttribute(xml);
                    }

                    if (tempDepth - 1 == depth) {
                        tempData = XMLResDataFactory.getData(name);
                        if (tempData != null) {
                            tempData.fillAttribute(xml);
                            if (tempData.isValid()) {
                                data.addChild(tempData);
                                data = tempData;
                                depth = tempDepth;
                            }
                        }
                    }
                    break;
                case XmlResourceParser.TEXT:
                    if (null != tempData && tempData.equals(data)) {
                        data.fillText(xml.getText());
                    }
                    break;
                case XmlResourceParser.END_TAG:
                    if (xml.getDepth() == depth) {
                        data = data.getParent();
                        depth--;
                    }
                    break;
                default:
                    /**
                     * ignore
                     */
                    break;
                }
            }
        } catch (Exception e) {
            Logger.e(XMLResParser.class, "Error while trying to load a xml data in res.", e);
        }

        return result;
    }

    public static class XMLResDataFactory {
        public static XMLResData getData(String name) {
            if ("item".equalsIgnoreCase(name)) {
                return new Item();
            }

            return null;
        }
    }

    public static abstract class XMLResData {
        protected final List<XMLResData> mChildren;
        protected Map<String, XMLResData> mMap;
        protected String key = null;
        protected String text;
        private XMLResData mParent;

        public XMLResData() {
            mChildren = new ArrayList<>();
        }

        boolean isValid() {
            return true;
        }

        abstract void fillAttribute(XmlResourceParser xml);

        void fillText(String text) {
            this.text = text;
        }

        public <T extends XMLResData> T remove(T child) {
            mChildren.remove(child);
            if (!TextUtils.isEmpty(child.key)) {
                Map<String, XMLResData> map = mMap;
                if (map != null) {
                    map.remove(child.key.toLowerCase());
                }
            }
            return child;
        }

        public void addChild(XMLResData child) {
            child.mParent = this;
            mChildren.add(child);
            if (!TextUtils.isEmpty(child.key)) {
                Map<String, XMLResData> map = mMap;
                if (map == null) {
                    map = mMap = new HashMap<>();
                }
                map.put(child.key.toLowerCase(), child);
            }
        }

        XMLResData getParent() {
            return mParent;
        }

        public boolean hasChild(Class<? extends XMLResData> c, boolean fullMatch) {
            for (XMLResData child : mChildren) {
                if (fullMatch && c.equals(child.getClass())) {
                    return true;
                } else if (c.isAssignableFrom(child.getClass())) {
                    return true;
                }
            }
            return false;
        }

        @SuppressWarnings("unchecked")
        public <T extends XMLResData> T getChild(Class<? extends T> c,
                boolean fullMatch) {
            for (XMLResData child : mChildren) {
                if (fullMatch && c.equals(child.getClass())) {
                    return (T) child;
                } else if (c.isAssignableFrom(child.getClass())) {
                    return (T) child;
                }
            }
            return null;
        }

        @SuppressWarnings("unchecked")
        public <T extends XMLResData> T getChild(String key) {
            Map<String, XMLResData> map = mMap;
            T result = null;
            if (map != null && key != null) {
                try {
                    result = (T) map.get(key.toLowerCase());
                } catch (ClassCastException e) {
                    Logger.e(XMLResParser.class, "exception : ", e);
                    result = null;
                }
            }
            return result;
        }

        @SuppressWarnings("unchecked")
        public <T extends XMLResData> T[] getChildren(Class<? extends T> c,
                boolean fullMatch) {
            ArrayList<T> list = new ArrayList<>();

            for (XMLResData child : mChildren) {
                if (fullMatch && c.equals(child.getClass())) {
                    list.add((T) child);
                } else if (c.isAssignableFrom(child.getClass())) {
                    list.add((T) child);
                }
            }

            T[] result = (T[]) Array.newInstance(c, list.size());
            list.toArray(result);
            return result;
        }
    }

    public static class RootData extends XMLResData {
        protected String title;
       // protected String label;
        protected int pos;

        @Override
        boolean isValid() {
            return true;
        }

        @Override
        void fillAttribute(XmlResourceParser xml) {
            title = xml.getAttributeValue(null, "title");
            pos = xml.getAttributeIntValue(null, "pos", 0);
        }

        public String toString() {
            return String.format("{title=%s}", title);
        }
    }

    public static class Item extends XMLResData {
        protected String appAction;
        protected String appPackageName;

        public String getAppAction() {
            return appAction;
        }

        public void setAppAction(String appAction) {
            this.appAction = appAction;
        }

        public String getAppPackageName() {
            return appPackageName;
        }

        public void setAppPackageName(String appPackageName) {
            this.appPackageName = appPackageName;
        }

        @Override
        boolean isValid() {
            return true;
        }

        @Override
        void fillAttribute(XmlResourceParser xml) {
            key = xml.getAttributeValue(null, "key");
            appAction = xml.getAttributeValue(null, "appAction");
            appPackageName = xml.getAttributeValue(null, "appPackageName");
        }
    }
}
