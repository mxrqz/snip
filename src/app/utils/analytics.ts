import { 
  ClickEvent, 
  DeviceInfo, 
  BrowserInfo, 
  OSInfo, 
  GeographicData, 
  UTMParameters 
} from '@/app/types/types';

/**
 * Validates user agent string
 */
export function isValidUserAgent(userAgent: string): boolean {
  return typeof userAgent === 'string' && userAgent.length > 0 && userAgent.length <= 1000;
}

/**
 * Validates IP address (IPv4 or IPv6)
 */
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Validates referer URL
 */
export function isValidReferer(referer: string | null): boolean {
  if (referer === null || referer === '') return true;
  
  try {
    new URL(referer);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates UTM parameters
 */
export function validateUTMParameters(params: UTMParameters): UTMParameters {
  const validated: UTMParameters = {};
  
  if (params.source && typeof params.source === 'string' && params.source.length <= 100) {
    validated.source = params.source.trim();
  }
  
  if (params.medium && typeof params.medium === 'string' && params.medium.length <= 100) {
    validated.medium = params.medium.trim();
  }
  
  if (params.campaign && typeof params.campaign === 'string' && params.campaign.length <= 100) {
    validated.campaign = params.campaign.trim();
  }
  
  if (params.term && typeof params.term === 'string' && params.term.length <= 100) {
    validated.term = params.term.trim();
  }
  
  if (params.content && typeof params.content === 'string' && params.content.length <= 100) {
    validated.content = params.content.trim();
  }
  
  return validated;
}

/**
 * Validates device information
 */
export function validateDeviceInfo(device: DeviceInfo): boolean {
  return (
    typeof device === 'object' &&
    ['mobile', 'tablet', 'desktop'].includes(device.type) &&
    typeof device.isMobile === 'boolean' &&
    typeof device.isTablet === 'boolean' &&
    typeof device.isDesktop === 'boolean'
  );
}

/**
 * Validates browser information
 */
export function validateBrowserInfo(browser: BrowserInfo): boolean {
  return (
    typeof browser === 'object' &&
    typeof browser.name === 'string' &&
    typeof browser.version === 'string' &&
    typeof browser.engine === 'string' &&
    browser.name.length > 0 &&
    browser.name.length <= 50
  );
}

/**
 * Validates OS information
 */
export function validateOSInfo(os: OSInfo): boolean {
  return (
    typeof os === 'object' &&
    typeof os.name === 'string' &&
    typeof os.version === 'string' &&
    typeof os.platform === 'string' &&
    os.name.length > 0 &&
    os.name.length <= 50
  );
}

/**
 * Validates geographic data
 */
export function validateGeographicData(geo: GeographicData): boolean {
  if (typeof geo !== 'object') return false;
  
  // Country is required
  if (!geo.country || typeof geo.country !== 'string' || geo.country.length === 0) {
    return false;
  }
  
  // Country code should be 2-3 characters
  if (!geo.countryCode || typeof geo.countryCode !== 'string' || 
      geo.countryCode.length < 2 || geo.countryCode.length > 3) {
    return false;
  }
  
  // Optional fields validation
  if (geo.region && (typeof geo.region !== 'string' || geo.region.length > 100)) {
    return false;
  }
  
  if (geo.city && (typeof geo.city !== 'string' || geo.city.length > 100)) {
    return false;
  }
  
  if (geo.coordinates) {
    const { latitude, longitude } = geo.coordinates;
    if (typeof latitude !== 'number' || typeof longitude !== 'number' ||
        latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return false;
    }
  }
  
  return true;
}

/**
 * Validates complete click event data
 */
export function validateClickEvent(event: Partial<ClickEvent>): string[] {
  const errors: string[] = [];
  
  if (!event.shortCode || typeof event.shortCode !== 'string' || event.shortCode.length === 0) {
    errors.push('shortCode é obrigatório');
  }
  
  if (!event.userAgent || !isValidUserAgent(event.userAgent)) {
    errors.push('userAgent inválido');
  }
  
  if (!event.ip || !isValidIP(event.ip)) {
    errors.push('IP address inválido');
  }
  
  if (event.referer !== null && event.referer !== undefined && !isValidReferer(event.referer)) {
    errors.push('Referer URL inválido');
  }
  
  if (event.device && !validateDeviceInfo(event.device)) {
    errors.push('Informações de device inválidas');
  }
  
  if (event.browser && !validateBrowserInfo(event.browser)) {
    errors.push('Informações de browser inválidas');
  }
  
  if (event.os && !validateOSInfo(event.os)) {
    errors.push('Informações de OS inválidas');
  }
  
  return errors;
}

/**
 * Sanitizes and validates analytics data for storage
 */
export function sanitizeAnalyticsData<T extends Record<string, unknown>>(data: T): T {
  const sanitized = { ...data };
  
  // Remove any undefined values
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === undefined) {
      delete sanitized[key];
    }
  });
  
  // Sanitize string fields
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      (sanitized as Record<string, unknown>)[key] = (sanitized[key] as string).trim();
    }
  });
  
  return sanitized;
}

/**
 * Validates date range for analytics queries
 */
export function validateDateRange(start: string, end: string): { isValid: boolean; error?: string } {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { isValid: false, error: 'Data inválida fornecida' };
    }
    
    if (startDate > endDate) {
      return { isValid: false, error: 'Data de início deve ser anterior à data final' };
    }
    
    // Check if date range is not too large (e.g., max 1 year)
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (endDate.getTime() - startDate.getTime() > oneYear) {
      return { isValid: false, error: 'Range de datas não pode ser superior a 1 ano' };
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Formato de data inválido' };
  }
}

/**
 * Validates export format
 */
export function isValidExportFormat(format: string): format is 'csv' | 'json' | 'xlsx' {
  return ['csv', 'json', 'xlsx'].includes(format);
}