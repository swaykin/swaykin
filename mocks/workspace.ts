export type Workspace = {
  name: string;
  type: string;
  credits: number;
  maxTrackedCompetitors: number;
};

export const mockWorkspace: Workspace = {
  name: "Nova Beauty Co.",
  type: "D2C Brand",
  credits: 1240,
  maxTrackedCompetitors: 5,
};
