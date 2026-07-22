"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import type { Thread } from "./data";

export function PreviewPane({ thread }: { thread: Thread | null }) {
  const [replyText, setReplyText] = useState("");

  if (!thread) {
    return (
      <div style={{ flex: 1, minWidth: 0, background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#5f6368",
          }}
        >
          <Icon name="ph-envelope" size={52} style={{ marginBottom: 12, opacity: 0.25 }} />
          <div style={{ fontSize: 15 }}>Select an email to read</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minWidth: 0, background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        style={{
          padding: "16px 24px 12px",
          borderBottom: "1px solid #e3e3e3",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 19, fontWeight: 400, color: "#202124", marginBottom: 4 }}>{thread.subject}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 9px",
                borderRadius: 5,
                background: thread.statusBg,
                color: thread.statusColor,
              }}
            >
              {thread.status}
            </span>
            <span style={{ fontSize: 12, color: "#5f6368" }}>@{thread.handle}</span>
            <a
              href={thread.igUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "#E1306C",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              <Icon name="ph-instagram-logo" weight="fill" size={13} />
              View on Instagram
            </a>
          </div>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            height: 32,
            padding: "0 14px",
            borderRadius: 20,
            background: "#C2E7FF",
            border: "none",
            color: "#001D35",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            flexShrink: 0,
          }}
        >
          <Icon name="ph-arrow-bend-up-left" weight="bold" size={12} />
          Reply
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <div style={{ maxWidth: 660 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Avatar initials={thread.initials} bg={thread.avatarBg} size={40} fontSize={14} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>
                {thread.name}{" "}
                <span style={{ fontWeight: 400, color: "#5f6368", fontSize: 13 }}>&lt;{thread.email}&gt;</span>
              </div>
              <div style={{ fontSize: 12, color: "#5f6368" }}>to hello@novabeautyco.com · {thread.lastActivity}</div>
            </div>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.75, color: "#202124", whiteSpace: "pre-wrap", marginBottom: 28 }}>
            {thread.body}
          </div>

          {thread.hasReply && (
            <div style={{ borderTop: "1px solid #e3e3e3", paddingTop: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Avatar initials="NB" bg="var(--sk-accent)" size={38} fontSize={13} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>Nova Beauty Co.</div>
                  <div style={{ fontSize: 12, color: "#5f6368" }}>to {thread.name} · {thread.replyTime}</div>
                </div>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.75, color: "#202124", whiteSpace: "pre-wrap" }}>
                {thread.replyBody}
              </div>
            </div>
          )}

          <div style={{ border: "1px solid #e3e3e3", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 13, color: "#5f6368", marginBottom: 8 }}>Reply to {thread.name}</div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply…"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                resize: "none",
                fontSize: 14,
                color: "#202124",
                fontFamily: "var(--font-sans)",
                minHeight: 80,
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button
                onClick={() => setReplyText("")}
                style={{
                  height: 32,
                  padding: "0 16px",
                  borderRadius: 20,
                  background: "#0B57D0",
                  border: "none",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
