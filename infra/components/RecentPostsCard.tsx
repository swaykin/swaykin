"use client";

import { useState } from "react";
import _noop from "lodash/noop";
import { formatCompactNumber } from "@/lib/format";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";
import { Modal } from "@/infra/baseweb/Modal";

export type Post = {
  type: string;
  icon: string;
  date: string;
  likes: number;
  comments: number;
  views: number;
  isCollab?: boolean;
  /** Only Influencer's posts have these today — the detail modal shows them when present,
   * Competitors' posts simply omit the caption paragraph/hashtag pills. */
  caption?: string;
  hashtags?: string[];
};

type RecentPostsCardProps = {
  posts: Post[];
  bgColor: string;
  /** When provided, shows "(shown of total)" and gates the Load more button on it. Omit when
   * there's no real total to compare against — Load more then always renders, as a stub. */
  totalPosts?: number;
  onLoadMore?: () => void;
};

const PostTile = ({
  post,
  bgColor,
  onClick,
}: {
  post: Post;
  bgColor: string;
  onClick: () => void;
}) => (
  <Box
    className="w-[356px] flex-none cursor-pointer overflow-hidden rounded-[14px] border-2 border-transparent"
    onClick={onClick}
  >
    <Box
      className="relative flex aspect-[4/3] items-center justify-center"
      style={{ background: bgColor }}
    >
      <Box className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-black/[0.28]">
        <Icon name={post.icon} weight="fill" size={24} color="#fff" />
      </Box>
      <Box
        as="span"
        className="absolute left-[9px] top-[9px] rounded-md bg-black/40 px-[7px] py-[3px] text-[10px] font-bold uppercase text-white"
      >
        {post.type}
      </Box>
      {post.isCollab && (
        <Box
          as="span"
          className="absolute right-[9px] top-[9px] rounded-md px-[7px] py-[3px] text-[9.5px] font-bold text-white"
          style={{ background: "var(--green-700)" }}
        >
          Paid Partnership
        </Box>
      )}
    </Box>
    <Box className="bg-surface px-3 pt-3">
      <Box className="mb-1.5 flex items-center gap-3.5">
        <Box className="flex items-center gap-1 text-[12.5px] font-semibold text-text-secondary">
          <Icon
            name="ph-heart"
            weight="fill"
            size={13}
            color="var(--pink-600)"
          />
          {formatCompactNumber(post.likes)}
        </Box>
        <Box className="flex items-center gap-1 text-[12.5px] font-semibold text-text-secondary">
          <Icon name="ph-chat-circle" size={13} />
          {formatCompactNumber(post.comments)}
        </Box>
        <Box className="flex items-center gap-1 text-[12.5px] font-semibold text-text-secondary">
          <Icon name="ph-eye" size={13} />
          {formatCompactNumber(post.views)}
        </Box>
      </Box>
      <Box className="text-[11.5px] text-text-tertiary">{post.date}</Box>
    </Box>
  </Box>
);

const MODAL_OVERRIDES = {
  Dialog: {
    style: {
      width: "min(92vw, 520px)",
      maxHeight: "86vh",
      overflowY: "auto",
      borderRadius: "16px",
      padding: "0",
    },
  },
  Close: {
    component: () => null,
  },
};

const PostDetailModal = ({
  post,
  bgColor,
  onClose,
}: {
  post: Post | null;
  bgColor: string;
  onClose: () => void;
}) => (
  <Modal
    isOpen={!!post}
    onClose={onClose}
    size="auto"
    overrides={MODAL_OVERRIDES}
  >
    {post && (
      <>
        <Box
          className="relative flex aspect-[4/3] items-center justify-center rounded-t-2xl"
          style={{ background: bgColor }}
        >
          <Box className="flex h-16 w-16 items-center justify-center rounded-full bg-black/[0.28]">
            <Icon name={post.icon} weight="fill" size={30} color="#fff" />
          </Box>
          <IconButton
            kind="tertiary"
            type="button"
            aria-label="Close"
            onClick={onClose}
            height="30px"
            width="30px"
            overrides={{
              BaseButton: {
                style: {
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "rgba(0,0,0,0.4)",
                },
              },
            }}
          >
            <Icon name="ph-x" size={14} color="#fff" />
          </IconButton>
        </Box>
        <Box className="p-5">
          <Box className="mb-3 flex items-center gap-3.5">
            <Box className="flex items-center gap-1 text-[13px] font-semibold text-text-secondary">
              <Icon
                name="ph-heart"
                weight="fill"
                size={14}
                color="var(--pink-600)"
              />
              {formatCompactNumber(post.likes)}
            </Box>
            <Box className="flex items-center gap-1 text-[13px] font-semibold text-text-secondary">
              <Icon name="ph-chat-circle" size={14} />
              {formatCompactNumber(post.comments)}
            </Box>
            <Box className="flex items-center gap-1 text-[13px] font-semibold text-text-secondary">
              <Icon name="ph-eye" size={14} />
              {formatCompactNumber(post.views)}
            </Box>
            <Box as="span" className="ml-auto text-xs text-text-tertiary">
              {post.date}
            </Box>
          </Box>
          {post.caption && (
            <Box as="p" className="mb-3 text-[13px] leading-[1.5] text-text">
              {post.caption}
            </Box>
          )}
          {!!post.hashtags?.length && (
            <Box className="flex flex-wrap gap-1.5">
              {post.hashtags.map((tag) => (
                <Box
                  key={tag}
                  as="span"
                  className="rounded-md bg-accent-subtle px-2 py-[3px] text-[11px] font-semibold text-link"
                >
                  #{tag}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </>
    )}
  </Modal>
);

export const RecentPostsCard = ({
  posts,
  bgColor,
  totalPosts,
  onLoadMore,
}: RecentPostsCardProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const hasMore = totalPosts === undefined || posts.length < totalPosts;

  return (
    <Box className="rounded-2xl border border-border bg-surface shadow-card">
      <Box
        className="px-5 pt-5 pb-2 flex-shrink-0 text-sm font-bold text-text transition-shadow duration-150 text-[14.5px]"
        style={{ boxShadow: scrolled ? "var(--sk-shadow-bottom)" : "none" }}
      >
        Recent posts{" "}
        <Box as="span" className="font-medium text-text-tertiary">
          {totalPosts !== undefined
            ? `(${posts.length} of ${formatCompactNumber(totalPosts)})`
            : `(${posts.length})`}
        </Box>
      </Box>
      <Box
        className="max-h-[1100px] overflow-y-auto px-5 pb-1.5 pt-2"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
      >
        <Box className="flex flex-wrap gap-4">
          {posts.map((post, i) => (
            <PostTile
              key={`${post.date}-${i}`}
              post={post}
              bgColor={bgColor}
              onClick={() => setOpenIndex(i)}
            />
          ))}
        </Box>
        {hasMore && (
          <Box className="mt-4 flex justify-center">
            <Button
              kind="secondary"
              type="button"
              onClick={onLoadMore ?? _noop}
              textColor="var(--sk-text-secondary)"
            >
              Load more
            </Button>
          </Box>
        )}
      </Box>
      <PostDetailModal
        post={openIndex !== null ? posts[openIndex] : null}
        bgColor={bgColor}
        onClose={() => setOpenIndex(null)}
      />
    </Box>
  );
};
