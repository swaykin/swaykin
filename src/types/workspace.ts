export type WorkspaceDetails = {
  descriptions: string;
  igUsername: string;
  website: string;
  audience: string;
  voice: string;
  industry: string;
};

export type Workspace = {
  id: string;
  name: string;
  creditBalance: number;
  details: WorkspaceDetails;
  planTier: string;
  logoUrl: string | null;
};
