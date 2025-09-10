'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  MousePointerClick, 
  Users, 
  Globe, 
  Smartphone, 
  Monitor,
  Calendar,
  ExternalLink,
  Copy
} from 'lucide-react';
import { LinkAnalytics, LinkData } from '@/app/types/types';
import { copyToClipboard, formatDate, formatDateTime } from '@/app/utils/functions';
import BarChart from '@/app/components/charts/BarChart';
import LineChart from '@/app/components/charts/LineChart';
import PieChart from '@/app/components/charts/PieChart';

export default function AnalyticsPage() {
  const { isLoaded, userId } = useAuth();
  const params = useParams();
  const router = useRouter();
  const shortCode = params.shortCode as string;

  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && userId && shortCode) {
      fetchAnalytics();
      fetchLinkData();
    }
  }, [isLoaded, userId, shortCode]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/${shortCode}`);
      
      // Verificar código de status específico para acesso negado
      if (response.status === 403) {
        setError('Acesso negado - Você não tem permissão para visualizar estes analytics');
        return;
      }
      
      if (response.status === 404) {
        setError('Analytics não encontrados');
        return;
      }
      
      if (!response.ok) {
        setError(`Erro ${response.status}: ${response.statusText}`);
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        setAnalytics(result.data);
      } else {
        setError(result.error || 'Erro ao carregar analytics');
      }
    } catch (err) {
      setError(`v ${err}`);
    }
  };

  const fetchLinkData = async () => {
    try {
      const response = await fetch(`/api/dashboard/links/${shortCode}`);
      
      // Verificar código de status específico para acesso negado
      if (response.status === 403) {
        setError('Acesso negado - Você não tem permissão para visualizar este link');
        setLoading(false);
        return;
      }
      
      if (response.status === 404) {
        setError('Link não encontrado');
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        setError(`Erro ${response.status}: ${response.statusText}`);
        setLoading(false);
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        setLinkData(result.data);
      } else {
        setError(result.error || 'Erro ao carregar dados do link');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do link:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const getTopItems = (data: Record<string, number>, limit: number = 5) => {
    return Object.entries(data)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit);
  };

  const formatHourlyData = (clicksByHour: Record<string, number>) => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString());
    return hours.map(hour => ({
      label: `${hour}h`,
      value: clicksByHour[hour] || 0
    }));
  };

  const formatTopCountriesData = (countries: Record<string, number>) => {
    const total = Object.values(countries).reduce((sum, count) => sum + count, 0);
    return Object.entries(countries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([country, count]) => ({
        label: country,
        value: count,
        percentage: Math.round((count / total) * 100)
      }));
  };

  const formatDeviceData = (devices: Record<string, number>) => {
    const total = Object.values(devices).reduce((sum, count) => sum + count, 0);
    return Object.entries(devices)
      .map(([device, count]) => ({
        label: device.charAt(0).toUpperCase() + device.slice(1),
        value: count,
        percentage: Math.round((count / total) * 100)
      }));
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Carregando analytics...</div>
      </div>
    );
  }

  if (error || !analytics || !linkData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500">{error || 'Analytics não encontrados'}</div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => router.push('/dashboard')} 
              variant="ghost" 
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">Código: {shortCode}</p>
            </div>
          </div>
        </div>

        {/* Link Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Informações do Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">URL Original</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm break-all">{linkData.originalUrl}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(linkData.originalUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">URL Curta</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-foreground text-background px-2 py-1 rounded">
                    {linkData.shortUrl}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(linkData.shortUrl)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Criado em: {formatDate(linkData.createdAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalClicks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cliques Únicos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.uniqueClicks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Países</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(analytics.countries).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispositivos</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(analytics.devices).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Geographic Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Localização Geográfica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Países</h4>
                  <div className="space-y-2">
                    {getTopItems(analytics.countries).map(([country, clicks]) => (
                      <div key={country} className="flex justify-between items-center">
                        <span className="text-sm">{country}</span>
                        <Badge variant="secondary">{clicks}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Regiões</h4>
                  <div className="space-y-2">
                    {getTopItems(analytics.regions).map(([region, clicks]) => (
                      <div key={region} className="flex justify-between items-center">
                        <span className="text-sm">{region}</span>
                        <Badge variant="secondary">{clicks}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Dispositivos e Tecnologia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Tipos de Dispositivo</h4>
                  <div className="space-y-2">
                    {getTopItems(analytics.devices).map(([device, clicks]) => (
                      <div key={device} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{device}</span>
                        <Badge variant="secondary">{clicks}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Navegadores</h4>
                  <div className="space-y-2">
                    {getTopItems(analytics.browsers).map(([browser, clicks]) => (
                      <div key={browser} className="flex justify-between items-center">
                        <span className="text-sm">{browser}</span>
                        <Badge variant="secondary">{clicks}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Sistemas Operacionais</h4>
                  <div className="space-y-2">
                    {getTopItems(analytics.operatingSystems).map(([os, clicks]) => (
                      <div key={os} className="flex justify-between items-center">
                        <span className="text-sm">{os}</span>
                        <Badge variant="secondary">{clicks}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Fontes de Tráfego
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Referrers</h4>
                  <div className="space-y-2">
                    {getTopItems(analytics.referrers).map(([referrer, clicks]) => (
                      <div key={referrer} className="flex justify-between items-center">
                        <span className="text-sm">{referrer}</span>
                        <Badge variant="secondary">{clicks}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                {Object.keys(analytics.utmSources).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">UTM Sources</h4>
                    <div className="space-y-2">
                      {getTopItems(analytics.utmSources).map(([source, clicks]) => (
                        <div key={source} className="flex justify-between items-center">
                          <span className="text-sm">{source}</span>
                          <Badge variant="secondary">{clicks}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {Object.keys(analytics.utmMediums).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">UTM Mediums</h4>
                    <div className="space-y-2">
                      {getTopItems(analytics.utmMediums).map(([medium, clicks]) => (
                        <div key={medium} className="flex justify-between items-center">
                          <span className="text-sm">{medium}</span>
                          <Badge variant="secondary">{clicks}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {Object.keys(analytics.utmCampaigns).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">UTM Campaigns</h4>
                    <div className="space-y-2">
                      {getTopItems(analytics.utmCampaigns).map(([campaign, clicks]) => (
                        <div key={campaign} className="flex justify-between items-center">
                          <span className="text-sm">{campaign}</span>
                          <Badge variant="secondary">{clicks}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Hourly Traffic Chart */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <LineChart
                data={formatHourlyData(analytics.clicksByHour)}
                title="Cliques por Hora do Dia"
                height={250}
              />
            </CardContent>
          </Card>
          
          {/* Top Countries Chart */}
          <Card>
            <CardContent className="p-0">
              <BarChart
                data={formatTopCountriesData(analytics.countries)}
                title="Principais Países"
                showPercentage={true}
                maxBars={8}
              />
            </CardContent>
          </Card>
          
          {/* Device Breakdown Chart */}
          <Card>
            <CardContent className="p-0">
              <PieChart
                data={formatDeviceData(analytics.devices)}
                title="Tipos de Dispositivo"
                size={250}
              />
            </CardContent>
          </Card>
          
        </div>

        {/* Last Click Information */}
        {analytics.lastClickAt && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Última Atividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Último clique registrado em: {' '}
                <span className="font-medium text-foreground">
                  {analytics.lastClickAt && typeof analytics.lastClickAt === 'object' && 'seconds' in analytics.lastClickAt 
                    ? new Date(analytics.lastClickAt.seconds * 1000).toLocaleString('pt-BR')
                    : 'Data não disponível'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}