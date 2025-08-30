import { auth } from '@clerk/nextjs/server';

export async function validateAuth() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { 
        isValid: false, 
        error: 'Usuário não autenticado',
        status: 401 
      };
    }

    return { 
      isValid: true, 
      userId 
    };
  } catch (error) {
    return { 
      isValid: false, 
      error: `Erro ao validar autenticação ${error}`,
      status: 500 
    };
  }
}