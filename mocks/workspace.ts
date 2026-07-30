export type Workspace = {
  name: string;
  type: string;
  credits: number;
  maxTrackedCompetitors: number;
  maxTrackedCreators: number;
};

export const mockWorkspace: Workspace = {
  name: "Nova Beauty Co.",
  type: "D2C Brand",
  credits: 1240,
  maxTrackedCompetitors: 10,
  maxTrackedCreators: 50,
};
