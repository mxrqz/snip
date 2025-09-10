import { toast } from "sonner";

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success('Copiado para área de transferência!');
    } catch (error) {
        toast.error(`Erro ao copiar ${error}`);
    }
};

const formatDate = (date: unknown) => {
    // Firebase Admin SDK format: {seconds: number, nanoseconds: number}
    if (date && typeof date === 'object' && 'seconds' in date) {
        return new Date((date as { seconds: number }).seconds * 1000).toLocaleDateString('pt-BR');
    }

    // Firestore serializado via API: {_seconds: number, _nanoseconds: number}
    if (date && typeof date === 'object' && '_seconds' in date) {
        return new Date((date as { _seconds: number })._seconds * 1000).toLocaleDateString('pt-BR');
    }

    // Timestamp real do Firestore (raro via API)
    if (date && typeof date === 'object' && 'toDate' in date) {
        return (date as { toDate: () => Date }).toDate().toLocaleDateString('pt-BR');
    }

    // Outros formatos (string, Date, etc)
    if (date) {
        try {
            return new Date(date as string | Date).toLocaleDateString('pt-BR');
        } catch {
            return 'Data inválida';
        }
    }

    return 'Data inválida';
};

const isValidUrl = (url: string): boolean => {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
};

/**
 * Calcula a diferença em dias entre uma data e hoje
 */
const daysSince = (date: unknown): number => {
    let targetDate: Date | null = null;
    
    // Firebase Admin SDK format: {seconds: number, nanoseconds: number}
    if (date && typeof date === 'object' && 'seconds' in date) {
        targetDate = new Date((date as { seconds: number }).seconds * 1000);
    }
    // Firestore serializado via API: {_seconds: number, _nanoseconds: number}
    else if (date && typeof date === 'object' && '_seconds' in date) {
        targetDate = new Date((date as { _seconds: number })._seconds * 1000);
    }
    // Timestamp real do Firestore
    else if (date && typeof date === 'object' && 'toDate' in date) {
        targetDate = (date as { toDate: () => Date }).toDate();
    }
    // Outros formatos (string, Date, etc)
    else if (date) {
        try {
            targetDate = new Date(date as string | Date);
        } catch {
            return -1;
        }
    }
    
    if (!targetDate) return -1;
    
    const now = new Date();
    const diffTime = now.getTime() - targetDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
};

const formatDateTime = (date: unknown) => {
    // Firebase Admin SDK format: {seconds: number, nanoseconds: number}
    if (date && typeof date === 'object' && 'seconds' in date) {
        return new Date((date as { seconds: number }).seconds * 1000).toLocaleString('pt-BR');
    }

    // Firestore serializado via API: {_seconds: number, _nanoseconds: number}
    if (date && typeof date === 'object' && '_seconds' in date) {
        return new Date((date as { _seconds: number })._seconds * 1000).toLocaleString('pt-BR');
    }

    // Timestamp real do Firestore (raro via API)
    if (date && typeof date === 'object' && 'toDate' in date) {
        return (date as { toDate: () => Date }).toDate().toLocaleString('pt-BR');
    }

    // Outros formatos (string, Date, etc)
    if (date) {
        try {
            return new Date(date as string | Date).toLocaleString('pt-BR');
        } catch {
            return 'Data inválida';
        }
    }

    return 'Data inválida';
};

export { copyToClipboard, formatDate, formatDateTime, isValidUrl, daysSince }