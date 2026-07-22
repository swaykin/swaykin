"use client";

import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import type { FeedItem } from "./mock-data";

const FEED_PAGE_SIZE = 4;

export function RecentFeedGrid({
  feedPool,
  igUrl,
  feedShown,
  onLoadMore,
}: {
  feedPool: FeedItem[];
  igUrl: string;
  feedShown: number;
  onLoadMore: () => void;
}) {
  const visibleFeed = feedPool.slice(0, feedShown);
  const hasMore = feedShown < feedPool.length;
  const remaining = Math.max(feedPool.length - feedShown, 0);

  return (
    <Card padding={18} style={{ marginBottom: 16 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--sk-text)" }}>
          Recent collaborations &amp; posts{" "}
          <span style={{ color: "var(--sk-text-tertiary)", fontWeight: 500 }}>({feedPool.length})</span>
        </div>
        <a
          href={igUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-[5px]"
          style={{ fontSize: 12, fontWeight: 600, color: "var(--sk-link)", textDecoration: "none" }}
        >
          <Icon name="ph-instagram-logo" weight="fill" size={13} color="#E1306C" />
          Open Instagram
        </a>
      </div>

      <div style={{ maxHeight: 640, overflowY: "auto" }}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 420px))", gap: 16 }}>
          {visibleFeed.map((tc, i) => (
            <a
              key={i}
              href={igUrl}
              target="_blank"
              rel="noreferrer"
              className="sk-row-hover"
              style={{
                background: tc.bg,
                aspectRatio: "4 / 5",
                borderRadius: 14,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={tc.icon} weight="fill" size={30} color="#fff" />
              </div>
              {tc.isReel && (
                <>
                  <Icon
                    name="ph-film-strip"
                    weight="fill"
                    size={18}
                    color="#fff"
                    style={{ position: "absolute", top: 12, right: 12, textShadow: "0 1px 2px rgba(0,0,0,.5)" }}
                  />
                  <span
                    className="flex items-center gap-[5px]"
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      textShadow: "0 1px 2px rgba(0,0,0,.5)",
                    }}
                  >
                    <Icon name="ph-play" weight="fill" size={13} color="#fff" />
                    {tc.views} views
                  </span>
                </>
              )}
            </a>
          ))}
        </div>
      </div>

      {hasMore && (
        <div className="flex justify-center" style={{ marginTop: 16 }}>
          <button
            onClick={onLoadMore}
            style={{
              height: 36,
              padding: "0 18px",
              borderRadius: 9,
              border: "1px solid var(--sk-border)",
              background: "var(--sk-surface)",
              color: "var(--sk-text-secondary)",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            Load more ({remaining} more)
          </button>
        </div>
      )}
    </Card>
  );
}

export { FEED_PAGE_SIZE };
