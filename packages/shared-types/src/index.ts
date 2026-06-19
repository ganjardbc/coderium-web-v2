export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  content?: string | null;
  type: PostType;
  tags: string[];
  coverImage?: string | null;
  isPublished: boolean;
  publishedAt?: Date | null;
  viewCount: number;
  likeCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type PostType = 'article' | 'carousel' | 'video' | 'stack_gallery';

export interface Playlist {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  isPublished: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Media {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}
