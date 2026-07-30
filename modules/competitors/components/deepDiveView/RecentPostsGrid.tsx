import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { useSnackbar } from "@/infra/baseweb/useSnackbar";
import type { ContentPost } from "@/mocks/competitors";
import type { ColoredCompetitor } from "../../types";

type RecentPostsGridProps = {
  competitor: ColoredCompetitor;
};

const PostTile = ({
  post,
  tint,
  color,
}: {
  post: ContentPost;
  tint: string;
  color: string;
}) => (
  <Box>
    <Box
      className="relative mb-2 flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl"
      style={{ background: tint }}
    >
      <Icon
        name={post.icon}
        weight="fill"
        size={34}
        color={color}
        className="opacity-[0.85]"
      />
      <Box
        as="span"
        className="absolute left-2 top-2 rounded-md bg-black/35 px-2 py-0.5 text-[10.5px] font-bold text-white"
      >
        {post.type}
      </Box>
      <Box
        as="span"
        className="absolute right-2 top-2 rounded-md bg-black/35 px-2 py-0.5 text-[10.5px] font-bold text-white"
      >
        {post.date}
      </Box>
    </Box>
    <Box className="flex items-center justify-between text-xs text-text-secondary">
      <Box className="flex items-center gap-1">
        <Icon name="ph-heart" weight="fill" size={13} color="var(--pink-500)" />
        {post.likes}
      </Box>
      <Box className="flex items-center gap-1">
        <Icon name="ph-chat-circle" size={13} />
        {post.comments}
      </Box>
      <Box as="span" className="font-bold text-text">
        {post.eng}
      </Box>
    </Box>
  </Box>
);

export const RecentPostsGrid = ({ competitor }: RecentPostsGridProps) => {
  const { onSuccess } = useSnackbar();

  return (
    <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <Box className="mb-3.5 text-sm font-bold text-text">Recent posts</Box>
      <Box className="max-h-[1100px] overflow-y-auto pr-1">
        <Box className="grid grid-cols-3 gap-4">
          {competitor.posts.map((post) => (
            <PostTile
              key={`${post.date}-${post.type}`}
              post={post}
              tint={competitor.tint}
              color={competitor.color}
            />
          ))}
        </Box>
        <Box className="mt-4 flex justify-center">
          <Button
            kind="secondary"
            type="button"
            size="small"
            weight="semiBold"
            onClick={() => onSuccess("Loading more posts…")}
          >
            Load more posts
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
