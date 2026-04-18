"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  defaultAnnouncements,
  defaultArticles,
  defaultSermons,
  defaultStandardPages,
  type StandardPageKey,
} from "@/lib/cms-schema";

import type {
  Announcement,
  Article,
  Sermon,
  StandardPageContent,
} from "@/lib/cms-schema";

const CMS_STORAGE_KEY = "vasbc_cms_data_v1";

export type CmsData = {
  announcements: Announcement[];
  sermons: Sermon[];
  articles: Article[];
  standardPages: StandardPageContent[];
};

export const defaultCmsData: CmsData = {
  announcements: defaultAnnouncements,
  sermons: defaultSermons,
  articles: defaultArticles,
  standardPages: defaultStandardPages,
};

function normalize(data: Partial<CmsData> | null | undefined): CmsData {
  return {
    announcements:
      data?.announcements && data.announcements.length > 0
        ? data.announcements
        : defaultAnnouncements,
    sermons: data?.sermons && data.sermons.length > 0 ? data.sermons : defaultSermons,
    articles: data?.articles && data.articles.length > 0 ? data.articles : defaultArticles,
    standardPages:
      data?.standardPages && data.standardPages.length > 0
        ? data.standardPages
        : defaultStandardPages,
  };
}

export function loadCmsData(): CmsData {
  if (typeof window === "undefined") return defaultCmsData;
  const raw = window.localStorage.getItem(CMS_STORAGE_KEY);
  if (!raw) return defaultCmsData;
  try {
    return normalize(JSON.parse(raw) as CmsData);
  } catch {
    return defaultCmsData;
  }
}

function saveCmsData(data: CmsData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
}

export function useCmsData() {
  const [data, setData] = useState<CmsData>(() => loadCmsData());

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CMS_STORAGE_KEY) {
        setData(loadCmsData());
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const updateData = useCallback(
    (updater: CmsData | ((previous: CmsData) => CmsData)) => {
      setData((previous) => {
        const next =
          typeof updater === "function"
            ? (updater as (previous: CmsData) => CmsData)(previous)
            : updater;
        saveCmsData(next);
        return next;
      });
    },
    [],
  );

  return { data, updateData };
}

export function useStandardPageContent(pageKey: StandardPageKey) {
  const { data } = useCmsData();

  return useMemo(
    () => data.standardPages.find((item) => item.key === pageKey),
    [data.standardPages, pageKey],
  );
}
