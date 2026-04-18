export type Announcement = {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  imageName?: string;
};

export type Sermon = {
  id: string;
  preacher: string;
  date: string;
  topic: string;
  mediaUrl: string;
};

export type Article = {
  id: string;
  title: string;
  date: string;
  content: string;
};

export type PageButton = {
  label: string;
  href: string;
};

export const standardPageKeys = [
  "about-beliefs",
  "about-history",
  "about-covenant",
  "about-deacons",
  "about-staff",
  "gathering-times",
  "missions",
  "recruitment",
  "contact-us",
] as const;

export type StandardPageKey = (typeof standardPageKeys)[number];

export type StandardPageContent = {
  key: StandardPageKey;
  path: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageName?: string;
  button?: PageButton;
};

export const defaultAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "兒童營 2025 開始報名",
    date: "2025-07-15",
    description: "歡迎家長為小朋友報名參與暑期兒童營，名額有限。",
    imageUrl:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    imageName: "children-camp.jpg",
  },
  {
    id: "a2",
    title: "暑期聖經班",
    date: "2025-08-02",
    description: "以聖經故事、手工與互動遊戲，陪伴孩子建立信仰基礎。",
    imageUrl:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=80",
    imageName: "vbs.jpg",
  },
  {
    id: "a3",
    title: "福音足球挑戰盃",
    date: "2025-09-13",
    description: "教會與社區青年一同參與友誼賽，場邊設有福音分享與禱告站。",
    imageUrl:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    imageName: "gospel-football.jpg",
  },
];

export const defaultSermons: Sermon[] = [
  {
    id: "s1",
    preacher: "陳牧師",
    date: "2025-09-14",
    topic: "扎根聖言，活出使命",
    mediaUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
  },
];

export const defaultArticles: Article[] = [
  {
    id: "r1",
    title: "團契生活與城市關懷",
    date: "2025-09-01",
    content: "在團契中彼此建立，並在社區中成為祝福。",
  },
  {
    id: "r2",
    title: "在忙碌中安靜等候",
    date: "2025-09-19",
    content:
      "面對繁忙節奏，我們仍可透過每日短暫禱告與默想，在神面前重新得力。",
  },
];

export const defaultStandardPages: StandardPageContent[] = [
  {
    key: "about-beliefs",
    path: "/about/beliefs",
    title: "教會信仰",
    description: "說明教會核心信仰與聖經立場。",
    button: { label: "聯絡我們", href: "/contact-us" },
  },
  {
    key: "about-history",
    path: "/about/history",
    title: "教會簡史",
    description: "記錄教會建立、發展與社區同行的重要里程。",
    button: { label: "查看更多消息", href: "/announcements" },
  },
  {
    key: "about-covenant",
    path: "/about/covenant",
    title: "教會約章",
    description: "展示教會約章內容，幫助會眾理解共同承諾。",
    button: { label: "教會信仰", href: "/about/beliefs" },
  },
  {
    key: "about-deacons",
    path: "/about/deacons",
    title: "執事名錄",
    description: "展示現任執事與其服事範疇。",
    button: { label: "同工名錄", href: "/about/staff" },
  },
  {
    key: "about-staff",
    path: "/about/staff",
    title: "同工名錄",
    description: "展示教會與木川共享空間同工團隊。",
    button: { label: "聯絡我們", href: "/contact-us" },
  },
  {
    key: "gathering-times",
    path: "/gathering-times",
    title: "聚會時間",
    description: "主日崇拜、祈禱會與各團契聚會時間將於此頁更新。",
    button: { label: "參與聚會", href: "/contact-us" },
  },
  {
    key: "missions",
    path: "/missions",
    title: "宣教工場",
    description: "展示本地與海外宣教工場近況、代禱事項與參與方式。",
    button: { label: "文章分享", href: "/articles" },
  },
  {
    key: "recruitment",
    path: "/recruitment",
    title: "招聘",
    description: "刊登教會及木川共享空間相關職位招聘資訊。",
    button: { label: "提交查詢", href: "/contact-us" },
  },
  {
    key: "contact-us",
    path: "/contact-us",
    title: "聯絡我們",
    description: "提供地址、電話、電郵與地圖，歡迎隨時聯絡我們。",
    button: { label: "返回主頁", href: "/" },
  },
];
