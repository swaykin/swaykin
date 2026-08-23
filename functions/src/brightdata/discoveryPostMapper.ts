import {PostUpsertData} from "../competitor/postRepo";

export interface BrightDataDiscoveryPost {
  id: string | number;
  url: string;
  caption?: string | null;
  content_type?: string | null;
  image_url?: string | null;
  likes?: number | null;
  comments?: number | null;
  post_hashtags?: string[] | null;
  datetime?: string | null;
}

/** Instagram shortcode from /p/{code} or /reel/{code} URLs. */
export function shortcodeFromInstagramUrl(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel)\/([^/?#]+)/i);
  return match?.[1] ?? null;
}

/**
 * Maps a nested Bright Data discovery post onto our global Post row shape.
 * Location is omitted — BD returns an object, not a string, and we don't use it.
 */
export function mapDiscoveryPost(
  post: BrightDataDiscoveryPost,
  profileId: string,
  fallbackTime: string
): PostUpsertData | null {
  if (!post.id || !post.url) return null;

  const postId = String(post.id);
  const shortcode = shortcodeFromInstagramUrl(post.url) ?? postId;
  const postedAt = post.datetime ?
    new Date(post.datetime).toISOString() :
    fallbackTime;

  return {
    profileId,
    postUrl: post.url,
    postId,
    shortcode,
    caption: post.caption ?? null,
    type: post.content_type || "Image",
    thumbnailUrl: post.image_url ?? null,
    likes: post.likes ?? null,
    comments: post.comments ?? null,
    hashtags: Array.isArray(post.post_hashtags) ? post.post_hashtags : [],
    postedAt,
    source: "brightdata",
  };
}
