import { BaseEntity, CommonStatus, CommonAudience } from '@/types/common';

export type ReleaseAudience = CommonAudience;
export type ReleaseType = 'Feature' | 'Enhancement' | 'Bug Fix' | 'Security' | 'Infrastructure';
export type ReleaseStatus = CommonStatus;

export interface ReleaseNote extends BaseEntity {
  version: string;
  title: string;
  description: string;
  content: string; // Detailed notes
  audience: ReleaseAudience;
  releaseType: ReleaseType;
  status: ReleaseStatus;
  // Appearance customization
  heroStyle?: 'solid' | 'image';
  heroColor?: string;
  heroImage?: string;
}
