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

export { copyToClipboard, formatDate }