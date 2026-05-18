import { BaseEntity, CommonStatus, CommonAudience } from '@/types/common';

export type FaqStatus = CommonStatus;
export type FaqAudience = CommonAudience;

export interface FaqEntry extends BaseEntity {
  question: string;
  answer: string;
  category: string;
  status: FaqStatus;
  audience: FaqAudience;
  displayOrder: number;
  parentId: string | null;
  isGroup: boolean;
  icon?: string;
}

export interface FaqCategory {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  icon?: string;
}
