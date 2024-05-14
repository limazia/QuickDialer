export interface Contact {
  id: string;
  name: string;
  contact: string;
  tags?: string[];
  createdAt: Date;
}

export interface PaginationResult {
  data: Contact[];
  pageCount: number;
}
