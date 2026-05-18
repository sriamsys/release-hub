export interface BaseEntity {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  pinned: boolean;
  featured: boolean;
}

export type CommonStatus = 'Draft' | 'Published' | 'Hidden' | 'Internal' | 'Deprecated';
export type CommonAudience = 'All' | 'Internal' | 'Managers' | 'Engineering' | 'Customers' | 'Administrators' | 'Admin' | 'HR';
