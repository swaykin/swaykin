import Link from "next/link";
import { Icon } from "@/infra/baseweb/Icon";

type InstagramLinkProps = {
  handle: string;
  label: string;
  className?: string;
};

export const InstagramLink = ({
  handle,
  label,
  className,
}: InstagramLinkProps) => (
  <Link
    href={`https://instagram.com/${handle}`}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-[5px] text-xs font-semibold text-link no-underline ${className ?? ""}`}
  >
    <Icon name="ph-instagram-logo" weight="fill" size={13} color="#E1306C" />
    {label}
  </Link>
);
