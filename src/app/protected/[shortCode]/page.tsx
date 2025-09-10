'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ProtectedLinkPage() {
  const params = useParams();
  const router = useRouter();
  const shortCode = params.shortCode as string;
  
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shortCode,
          password,
        }),
      });

      const data = await response.json();

      if (data.success && data.valid) {
        toast.success('Senha correta! Redirecionando...');
        // Redirecionar para o link original
        setTimeout(() => {
          window.location.href = `/${shortCode}?password=${encodeURIComponent(password)}`;
        }, 1000);
      } else {
        toast.error('Senha incorreta. Tente novamente.');
        setError('Senha incorreta. Tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao verificar senha. Tente novamente.');
      setError('Erro ao verificar senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Link Protegido</CardTitle>
            <p className="text-sm text-muted-foreground">
              Este link está protegido por senha. Digite a senha para continuar.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-center"
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !password}
              >
                {loading ? 'Verificando...' : 'Acessar Link'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          Código: <code className="bg-muted px-1 py-0.5 rounded">{shortCode}</code>
        </div>
      </div>
    </div>
  );
}