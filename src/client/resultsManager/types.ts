import { ProcessedResult } from 'wasp/entities';

export interface FilterState {
  searchTerm: string;
  sortBy: 'relevance' | 'title' | 'date';
  sortOrder: 'asc' | 'desc';
  domains: string[];
  fileTypes: string[];
} 