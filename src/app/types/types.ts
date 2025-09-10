import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export interface LinkData {
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  analyticsUrl: string;
  userId: string;
  createdAt: Timestamp | FieldValue;
  expiresAt: Timestamp | FieldValue | null;
  password: string | null;
  clicks: number;
}

export interface PublicLinkData {
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Timestamp | FieldValue;
  clicks: number;
  lastClickAt?: Timestamp | FieldValue;
}

export interface CreateLinkResponse {
  success: boolean;
  data?: LinkData;
  error?: string;
}

export interface CreatePublicLinkResponse {
  success: boolean;
  data?: PublicLinkData;
  error?: string;
}

// Analytics Types
export interface ClickEvent {
  id: string;
  shortCode: string;
  timestamp: Timestamp | FieldValue;
  userAgent: string;
  ip: string;
  referer: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  device: DeviceInfo;
  browser: BrowserInfo;
  os: OSInfo;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  brand?: string;
  model?: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
}

export interface OSInfo {
  name: string;
  version: string;
  platform: string;
}

export interface GeographicData {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
  timezone?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface UTMParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

// Professional Analytics Structure
export interface AnalyticsTotals {
  clicks: number;
  uniqueClicks: number;
  countries: number;
  devices: number;
  browsers: number;
  lastUpdated: Timestamp | FieldValue;
}

export interface PeakHourData {
  hour: string; // "14:00"
  clicks: number;
  label: string; // "14h"
}

export interface TopLocationData {
  location: string; // "São Paulo, SP"
  country: string; // "Brasil"  
  countryCode: string; // "BR"
  clicks: number;
  percentage: number;
}

export interface DeviceBreakdownData {
  device: string; // "mobile", "desktop", "tablet"
  clicks: number;
  percentage: number;
}

export interface AnalyticsCharts {
  peakHours: PeakHourData[];
  topLocations: TopLocationData[];
  deviceBreakdown: DeviceBreakdownData[];
}

export interface AnalyticsBreakdowns {
  countries: Record<string, number>;
  regions: Record<string, number>;
  cities: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;
  referrers: Record<string, number>;
  utmSources: Record<string, number>;
  utmMediums: Record<string, number>;
  utmCampaigns: Record<string, number>;
}

export interface ProfessionalAnalytics {
  shortCode: string;
  
  // Parâmetros globais (O(1) performance)
  totals: AnalyticsTotals;
  
  // Arrays prontos para gráficos
  charts: AnalyticsCharts;
  
  // Dados detalhados (quando necessário)
  breakdowns: AnalyticsBreakdowns;
  
  // Metadata
  createdAt: Timestamp;
  lastClickAt?: Timestamp;
}

// Legacy interface para compatibilidade
export interface LinkAnalytics {
  shortCode: string;
  totalClicks: number;
  uniqueClicks: number;
  lastClickAt?: string | null;
  createdAt: string | null;
  
  // Geographic breakdown
  countries: Record<string, number>;
  regions: Record<string, number>;
  cities: Record<string, number>;
  
  // Device breakdown
  devices: Record<string, number>; // mobile, tablet, desktop
  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;
  
  // Traffic sources
  referrers: Record<string, number>;
  utmSources: Record<string, number>;
  utmMediums: Record<string, number>;
  utmCampaigns: Record<string, number>;
  
  // Time-based analytics
  clicksByHour: Record<string, number>; // 0-23
  clicksByDay: Record<string, number>; // 0-6 (Sunday-Saturday)
  clicksByDate: Record<string, number>; // YYYY-MM-DD
  clicksByMonth: Record<string, number>; // YYYY-MM
}

// API Response Types
export interface AnalyticsResponse {
  success: boolean;
  data?: LinkAnalytics;
  error?: string;
}

export interface ClickEventsResponse {
  success: boolean;
  data?: {
    events: ClickEvent[];
    totalCount: number;
    hasMore: boolean;
  };
  error?: string;
}

// Dashboard Analytics Summary
export interface AnalyticsSummary {
  totalClicks: number;
  uniqueClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  topCountries: Array<{ country: string; clicks: number }>;
  topReferrers: Array<{ referrer: string; clicks: number }>;
  topDevices: Array<{ device: string; clicks: number }>;
  recentClicks: ClickEvent[];
}

// Link protection types
export interface LinkProtection {
  password?: string;
  expiresAt?: Date;
}

export interface PasswordVerificationRequest {
  shortCode: string;
  password: string;
}

export interface PasswordVerificationResponse {
  success: boolean;
  valid?: boolean;
  error?: string;
}

// Export formats
export type ExportFormat = 'csv' | 'json' | 'xlsx';

export interface ExportRequest {
  shortCode: string;
  format: ExportFormat;
  dateRange?: {
    start: string; // ISO date string
    end: string;   // ISO date string
  };
  includeEvents?: boolean;
  includeAggregated?: boolean;
}

// Newsletter types
export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Timestamp | FieldValue;
  active: boolean;
  source: string; // 'landing-page', 'dashboard', etc.
}

export interface NewsletterSubscriptionRequest {
  email: string;
  source?: string;
}

export interface NewsletterSubscriptionResponse {
  success: boolean;
  message?: string;
  error?: string;
}