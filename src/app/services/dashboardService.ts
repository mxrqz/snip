import { toast } from 'sonner';
import { PaginatedLinks } from '@/app/utils/database';
import { CreateLinkResponse } from "../types/types";

interface UserStats {
  totalLinks: number;
  totalClicks: number;
  todayClicks: number;
}

export const fetchStats = async (): Promise<UserStats | null> => {
  try {
    const response = await fetch('/api/dashboard/stats');
    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      toast.error('Erro ao carregar estatísticas');
      return null;
    }
  } catch (error) {
    toast.error(`Erro ao carregar estatísticas ${error}`);
    return null;
  }
};

export const fetchLinks = async (page: number = 1, limit: number = 20): Promise<PaginatedLinks | null> => {
  try {
    const response = await fetch(`/api/dashboard/links?page=${page}&limit=${limit}`);
    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      toast.error('Erro ao carregar links');
      return null;
    }
  } catch (error) {
    toast.error(`Erro ao carregar links ${error}`);
    return null;
  }
};

const validateAndNormalizeUrl = (url: string): string | null => {
  if (!url.trim()) {
    return null;
  }

  let normalizedUrl = url.trim();

  // Remove espaços e caracteres especiais do início/fim
  normalizedUrl = normalizedUrl.replace(/^[\s\u200B-\u200D\uFEFF]+|[\s\u200B-\u200D\uFEFF]+$/g, '');

  // Se não tem protocolo, adiciona https://
  if (!normalizedUrl.match(/^https?:\/\//i)) {
    // Se começa com www, adiciona https://
    if (normalizedUrl.match(/^www\./i)) {
      normalizedUrl = `https://${normalizedUrl}`;
    } else {
      // Se não tem www nem protocolo, adiciona https://
      normalizedUrl = `https://${normalizedUrl}`;
    }
  }

  try {
    const urlObj = new URL(normalizedUrl);
    
    // Verifica se tem um domínio válido (pelo menos um ponto)
    if (!urlObj.hostname.includes('.')) {
      return null;
    }

    // Verifica se não é só o protocolo
    if (urlObj.hostname.length < 3) {
      return null;
    }

    return urlObj.toString();
  } catch {
    return null;
  }
};


export const createLink = async (url: string): Promise<CreateLinkResponse> => {
  const validUrl = validateAndNormalizeUrl(url);
  
  if (!validUrl) {
    toast.error('Digite uma URL válida (ex: google.com, www.site.com, https://exemplo.com)');
    return { success: false, error: 'URL inválida' };
  }

  try {
    const response = await fetch(`/api/encurtar?url=${encodeURIComponent(validUrl)}`);
    const data = await response.json();

    if (data.success) {
      toast.success('Link criado com sucesso!');
      return { success: true, data: data.data };
    } else {
      toast.error(data.error || 'Erro ao criar link');
      return { success: false, error: data.error || 'Erro ao criar link' };
    }
  } catch (error) {
    const errorMsg = `Erro ao criar link ${error}`;
    toast.error(errorMsg);
    return { success: false, error: errorMsg };
  }
};