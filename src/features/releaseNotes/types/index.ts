export type ReleaseAudience = 'All' | 'Managers' | 'HR' | 'Engineering' | 'Admin';
export type ReleaseType = 'Feature' | 'Enhancement' | 'Bug Fix' | 'Security' | 'Infrastructure';
export type ReleaseStatus = 'Draft' | 'Published' | 'Internal' | 'Deprecated';

export interface ReleaseNote {
  id: string;
  version: string;
  title: string;
  description: string;
  content: string; // Detailed notes
  audience: ReleaseAudience;
  releaseType: ReleaseType;
  status: ReleaseStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  pinned: boolean;
  featured: boolean;
}
