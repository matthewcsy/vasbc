export type Announcement = {
  id: string;
  title: string;
  date: string;
  description: string;
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

export const defaultAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "兒童營 2025 開始報名",
    date: "2025-07-15",
    description: "歡迎家長為小朋友報名參與暑期兒童營，名額有限。",
    imageName: "children-camp.jpg",
  },
  {
    id: "a2",
    title: "暑期聖經班",
    date: "2025-08-02",
    description: "以聖經故事、手工與互動遊戲，陪伴孩子建立信仰基礎。",
    imageName: "vbs.jpg",
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
    content: "<p>在團契中彼此建立，並在社區中成為祝福。</p>",
  },
];
