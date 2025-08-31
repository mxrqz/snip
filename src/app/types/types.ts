import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export interface LinkData {
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  analyticsUrl: string;
  userId: string;
  createdAt: Timestamp | FieldValue;
  expiresAt: string | null;
  clicks: number;
}

export interface CreateLinkResponse {
  success: boolean;
  data?: LinkData;
  error?: string;
}