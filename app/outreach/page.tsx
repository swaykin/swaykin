"use client";

import { useState } from "react";
import { LeftRail } from "@/components/outreach/LeftRail";
import { ThreadList } from "@/components/outreach/ThreadList";
import { PreviewPane } from "@/components/outreach/PreviewPane";
import { threads, type StatusFilter } from "@/components/outreach/data";

export default function OutreachPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selectedId, setSelectedId] = useState<string | null>("ananya");
  const [activeFolder, setActiveFolder] = useState("inbox");

  const selectedThread = threads.find((t) => t.id === selectedId) ?? null;

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)", minHeight: 0, overflow: "hidden" }}>
      <LeftRail
        activeFolder={activeFolder}
        onFolderChange={setActiveFolder}
        onCompose={() => setSelectedId(null)}
      />
      <ThreadList
        threads={threads}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <PreviewPane key={selectedThread?.id ?? "empty"} thread={selectedThread} />
    </div>
  );
}
