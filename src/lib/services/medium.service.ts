import Parser from "rss-parser";
import { getEnv } from "@/lib/config/env";
import type { MediumPost } from "@/types";

const MEDIUM_API = "https://api.medium.com/v1";

interface PublishPayload {
  title: string;
  content: string;
  contentFormat?: "html" | "markdown";
  tags?: string[];
  publishStatus?: "public" | "draft" | "unlisted";
}

interface MediumPublishResponse {
  data: {
    id: string;
    title: string;
    url: string;
    publishStatus: string;
  };
}

function getMediumCredentials() {
  const { MEDIUM_TOKEN, MEDIUM_USER_ID } = getEnv();
  if (!MEDIUM_TOKEN || !MEDIUM_USER_ID) return null;
  return { token: MEDIUM_TOKEN, userId: MEDIUM_USER_ID };
}

export function isMediumConfigured(): boolean {
  return getMediumCredentials() !== null;
}

export async function publishPost(
  payload: PublishPayload
): Promise<MediumPublishResponse["data"]> {
  const creds = getMediumCredentials();
  if (!creds) {
    throw new Error(
      "Medium is not configured. Set MEDIUM_TOKEN and MEDIUM_USER_ID to enable cross-posting."
    );
  }

  const res = await fetch(`${MEDIUM_API}/users/${creds.userId}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: payload.title,
      contentFormat: payload.contentFormat ?? "html",
      content: payload.content,
      tags: payload.tags ?? [],
      publishStatus: payload.publishStatus ?? "draft",
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Medium publish failed: ${res.status} - ${error}`);
  }

  const json: MediumPublishResponse = await res.json();
  return json.data;
}

export async function fetchPosts(username: string): Promise<MediumPost[]> {
  const parser = new Parser<Record<string, unknown>, MediumRssItem>({
    customFields: {
      item: [["content:encoded", "contentEncoded"]],
    },
  });

  interface MediumRssItem {
    title: string;
    link: string;
    pubDate: string;
    contentEncoded?: string;
    content?: string;
    categories?: string[];
  }

  const feed = await parser.parseURL(
    `https://medium.com/feed/@${username}`
  );

  return feed.items.map((item) => {
    const content = item.contentEncoded ?? item.content ?? "";
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);

    return {
      title: item.title ?? "",
      link: item.link ?? "",
      pubDate: item.pubDate ?? "",
      content,
      thumbnail: imgMatch?.[1] ?? "",
      categories: item.categories ?? [],
    };
  });
}
