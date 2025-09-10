import { NextRequest } from 'next/server';
import { 
  ClickEvent, 
  DeviceInfo, 
  BrowserInfo, 
  OSInfo, 
  GeographicData, 
  UTMParameters 
} from '@/app/types/types';
import { nanoid } from 'nanoid';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Parses User Agent string to extract device, browser, and OS information
 */
function parseUserAgent(userAgent: string): {
  device: DeviceInfo;
  browser: BrowserInfo;
  os: OSInfo;
} {
  const ua = userAgent.toLowerCase();
  
  // Device detection
  const isMobile = /mobile|android|iphone|ipad|phone|blackberry|opera mini|windows phone/i.test(userAgent);
  const isTablet = /ipad|tablet|kindle|silk|gt-p|sm-t|nexus 7|nexus 9|nexus 10/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;
  
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (isMobile && !isTablet) deviceType = 'mobile';
  else if (isTablet) deviceType = 'tablet';
  
  const device: DeviceInfo = {
    type: deviceType,
    isMobile,
    isTablet,
    isDesktop
  };

  // Browser detection
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  let browserEngine = 'Unknown';

  if (ua.includes('firefox')) {
    browserName = 'Firefox';
    browserEngine = 'Gecko';
    const match = userAgent.match(/firefox\/([\d.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('chrome') && !ua.includes('edg')) {
    browserName = 'Chrome';
    browserEngine = 'Blink';
    const match = userAgent.match(/chrome\/([\d.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browserName = 'Safari';
    browserEngine = 'WebKit';
    const match = userAgent.match(/version\/([\d.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('edg')) {
    browserName = 'Edge';
    browserEngine = 'Blink';
    const match = userAgent.match(/edg\/([\d.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('opera')) {
    browserName = 'Opera';
    browserEngine = 'Blink';
    const match = userAgent.match(/opera\/([\d.]+)/);
    if (match) browserVersion = match[1];
  }

  const browser: BrowserInfo = {
    name: browserName,
    version: browserVersion,
    engine: browserEngine
  };

  // OS detection
  let osName = 'Unknown';
  let osVersion = 'Unknown';
  let osPlatform = 'Unknown';

  if (ua.includes('windows')) {
    osName = 'Windows';
    osPlatform = 'Windows';
    if (ua.includes('windows nt 10.0')) osVersion = '10';
    else if (ua.includes('windows nt 6.3')) osVersion = '8.1';
    else if (ua.includes('windows nt 6.2')) osVersion = '8';
    else if (ua.includes('windows nt 6.1')) osVersion = '7';
  } else if (ua.includes('mac os')) {
    osName = 'macOS';
    osPlatform = 'macOS';
    const match = userAgent.match(/mac os x ([\d_]+)/);
    if (match) osVersion = match[1].replace(/_/g, '.');
  } else if (ua.includes('linux')) {
    osName = 'Linux';
    osPlatform = 'Linux';
  } else if (ua.includes('android')) {
    osName = 'Android';
    osPlatform = 'Android';
    const match = userAgent.match(/android ([\d.]+)/);
    if (match) osVersion = match[1];
  } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
    osName = 'iOS';
    osPlatform = 'iOS';
    const match = userAgent.match(/os ([\d_]+)/);
    if (match) osVersion = match[1].replace(/_/g, '.');
  }

  const os: OSInfo = {
    name: osName,
    version: osVersion,
    platform: osPlatform
  };

  return { device, browser, os };
}

/**
 * Extracts UTM parameters from URL or referer
 */
export function extractUTMParameters(url: string): UTMParameters {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined
    };
  } catch {
    return {};
  }
}

/**
 * Gets client IP address from request headers
 */
export function getClientIP(request: NextRequest): string {
  // Try different headers in order of preference
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;
  
  const xClientIP = request.headers.get('x-client-ip');
  if (xClientIP) return xClientIP;
  
  // Fallback to localhost (development)
  return '127.0.0.1';
}

/**
 * Mock geolocation service - in production, use a real service like MaxMind or IP2Location
 */
export async function getGeographicData(ip: string): Promise<GeographicData | null> {
  // For development/demo purposes, return mock data
  // In production, integrate with a real geolocation service
  
  if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return {
      country: 'Brasil',
      countryCode: 'BR',
      region: 'São Paulo',
      city: 'São Paulo',
      timezone: 'America/Sao_Paulo'
    };
  }
  
  // Mock data for different IP ranges
  const mockGeoData: GeographicData = {
    country: 'Brasil',
    countryCode: 'BR',
    region: 'São Paulo',
    city: 'São Paulo',
    timezone: 'America/Sao_Paulo'
  };
  
  return mockGeoData;
}

/**
 * Creates a complete ClickEvent from request data
 */
export async function createClickEvent(
  request: NextRequest,
  shortCode: string
): Promise<ClickEvent> {
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const referer = request.headers.get('referer');
  const ip = getClientIP(request);
  
  // Parse user agent for device/browser/OS info
  const { device, browser, os } = parseUserAgent(userAgent);
  
  // Extract UTM parameters from referer if available
  let utmParams: UTMParameters = {};
  if (referer) {
    utmParams = extractUTMParameters(referer);
  }
  
  // Get geographic data
  const geoData = await getGeographicData(ip);
  
  const clickEvent: ClickEvent = {
    id: nanoid(),
    shortCode,
    timestamp: FieldValue.serverTimestamp(),
    userAgent,
    ip,
    referer: referer || null,
    device,
    browser,
    os,
    ...utmParams
  };
  
  // Add geographic data if available
  if (geoData) {
    clickEvent.country = geoData.country;
    clickEvent.countryCode = geoData.countryCode;
    clickEvent.region = geoData.region;
    clickEvent.city = geoData.city;
  }
  
  return clickEvent;
}

/**
 * Processes referer URL to extract meaningful referrer information
 */
export function processReferer(referer: string | null): string {
  if (!referer) return 'Direct';
  
  try {
    const url = new URL(referer);
    const hostname = url.hostname.toLowerCase();
    
    // Social media platforms
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'Facebook';
    if (hostname.includes('twitter.com') || hostname.includes('t.co')) return 'Twitter';
    if (hostname.includes('instagram.com')) return 'Instagram';
    if (hostname.includes('linkedin.com')) return 'LinkedIn';
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube';
    if (hostname.includes('tiktok.com')) return 'TikTok';
    if (hostname.includes('pinterest.com')) return 'Pinterest';
    if (hostname.includes('reddit.com')) return 'Reddit';
    
    // Search engines
    if (hostname.includes('google.com')) return 'Google Search';
    if (hostname.includes('bing.com')) return 'Bing Search';
    if (hostname.includes('yahoo.com')) return 'Yahoo Search';
    if (hostname.includes('duckduckgo.com')) return 'DuckDuckGo';
    
    // Messaging apps
    if (hostname.includes('whatsapp.com') || hostname.includes('wa.me')) return 'WhatsApp';
    if (hostname.includes('telegram.org') || hostname.includes('t.me')) return 'Telegram';
    if (hostname.includes('discord.com')) return 'Discord';
    
    // Email clients
    if (hostname.includes('mail.google.com')) return 'Gmail';
    if (hostname.includes('outlook.com') || hostname.includes('hotmail.com')) return 'Outlook';
    
    // Generic domain
    return hostname;
  } catch {
    return 'Unknown';
  }
}