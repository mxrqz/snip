'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';
import { Link2, MousePointerClick, Calendar, Copy, ExternalLink, BarChart3, Plus, HomeIcon, PlusIcon, SearchIcon, Settings, Lock, Clock, Eye, EyeOff } from 'lucide-react';
import { copyToClipboard, formatDate } from "../utils/functions";
import { fetchStats, fetchLinks, createLink } from '@/app/services/dashboardService';
import { LinkData } from "../types/types";
import { QRCodeDialog } from '@/app/components/dashboard/QRCodeDialog';
import { QRCodeDialogWithLogo } from "../components/dashboard/QRCodeDialogWithLogo";
import { SearchDialog } from '@/app/components/dashboard/SearchDialog';
import { useSearchShortcut, useSpotlightShortcut } from '@/app/hooks/useShortcuts';
import { FloatingDock, DockAction, DockItem } from "../components/FloatingDock";
import SpotlightDialog from "../components/SpotlightDialog";

interface UserStats {
  totalLinks: number;
  totalClicks: number;
  todayClicks: number;
}

const navItems: DockItem[] = [
  {
    title: "Home",
    icon: <HomeIcon className="size-4" />,
    action: 'home'
  },
  {
    title: "Novo",
    icon: <PlusIcon className="size-4" />,
    action: 'create'
  },
  {
    title: "Search",
    icon: <SearchIcon className="size-4" />,
    action: 'search'
  },
]

export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const [stats, setStats] = useState<UserStats>({ totalLinks: 0, totalClicks: 0, todayClicks: 0 });
  const [links, setLinks] = useState<LinkData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [password, setPassword] = useState('');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const handleFetchStats = async () => {
    const result = await fetchStats();
    if (result) {
      setStats(result);
    }
  };

  const handleFetchLinks = async (page: number) => {
    setLoading(true);
    const result = await fetchLinks(page, 10);
    if (result) {
      setLinks(result.links);
      setTotalCount(result.totalCount);
      setTotalPages(Math.ceil(result.totalCount / 10));
    }
    setLoading(false);
  };

  const handleCreateLink = async () => {
    setCreating(true);
    const result = await createLink(newUrl, true, { 
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      password: password || undefined
    });
    if (result.success) {
      setNewUrl('');
      setExpiresAt('');
      setPassword('');
      setShowAdvanced(false);
      await handleFetchStats();
      await handleFetchLinks(currentPage);
    }
    setCreating(false);
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const togglePasswordVisibility = (shortCode: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(shortCode)) {
      newVisible.delete(shortCode);
    } else {
      newVisible.add(shortCode);
    }
    setVisiblePasswords(newVisible);
  };

  const closeQRDialog = () => {
    setQrDialogOpen(false);
    setSelectedLink(null);
  };

  // Search shortcuts
  useSearchShortcut(() => {
    setSearchDialogOpen(!searchDialogOpen);
  });

  useSpotlightShortcut(() => {
    setIsSpotlightOpen(!isSpotlightOpen)
  })

  const handleDockAction = (action: DockAction) => {
    switch (action) {
      case 'create':
        setIsSpotlightOpen(!isSpotlightOpen)
        break;

      case "search":
        setSearchDialogOpen(!searchDialogOpen);
        break;

      case "home":
        break;
    }
  }

  useEffect(() => {
    if (isLoaded && userId) {
      handleFetchStats();
      handleFetchLinks(1);
    }
  }, [isLoaded, userId]);

  if (!isLoaded || !userId) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div>Carregando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center w-full">
      <div className="max-w-7xl mx-auto space-y-6 w-full">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Links</CardTitle>
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLinks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cliques Totais</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClicks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cliques Hoje</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{stats.todayClicks}</div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Criar Novo Link
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite a URL que deseja encurtar..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateLink()}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  title="Opções avançadas"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button onClick={handleCreateLink} disabled={creating}>
                  {creating ? 'Criando...' : 'Encurtar'}
                </Button>
              </div>
              
              {showAdvanced && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium">Opções Avançadas</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Data de Expiração
                      </label>
                      <Input
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Lock className="h-3 w-3" />
                        Senha de Acesso
                      </label>
                      <Input
                        type="password"
                        placeholder="Opcional"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Links com expiração ou senha ficam protegidos e só podem ser acessados mediante autenticação.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Links Table */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Links</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando links...</div>
            ) : links.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum link encontrado. Crie seu primeiro link acima!
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL Original</TableHead>
                      <TableHead>URL Curta</TableHead>
                      <TableHead className="text-center">Cliques</TableHead>
                      <TableHead className="text-center">Proteção</TableHead>
                      <TableHead className="text-center">Expira</TableHead>
                      <TableHead className="text-center">Data</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {links.map((link) => (
                      <TableRow key={link.shortCode}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span title={link.originalUrl}>
                              {truncateUrl(link.originalUrl)}
                            </span>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(link.originalUrl, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="bg-foreground text-background px-2 py-1 rounded text-sm">
                              {link.shortCode}
                            </code>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(link.shortUrl)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge className="bg-foreground text-background">{link.clicks || 0}</Badge>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            {link.password && (
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  <Lock className="h-3 w-3 mr-1" />
                                  {visiblePasswords.has(link.shortCode) ? link.password : '••••••'}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => togglePasswordVisibility(link.shortCode)}
                                  className="h-6 w-6 p-0"
                                  title={visiblePasswords.has(link.shortCode) ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                  {visiblePasswords.has(link.shortCode) ? (
                                    <EyeOff className="h-3 w-3" />
                                  ) : (
                                    <Eye className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            )}
                            {!link.password && (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            {link.expiresAt ? (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(link.expiresAt)}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />

                            <span className="text-sm text-muted-foreground">
                              {formatDate(link.createdAt)}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openQRDialog(link)}
                              title="Ver QR Code"
                            >
                              <QrCode className="h-3 w-3" />
                            </Button> */}

                            {/* <QRCodeDialog
                              shortUrl={link.shortUrl}
                              originalUrl={link.originalUrl}
                              shortCode={link.shortCode}
                              clicks={link.clicks || 0}
                            /> */}

                            <QRCodeDialogWithLogo
                              shortUrl={link.shortUrl}
                              originalUrl={link.originalUrl}
                              shortCode={link.shortCode}
                              clicks={link.clicks || 0}
                            />

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/analytics/${link.shortCode}`, '_blank')}
                              title="Ver Analytics"
                            >
                              <BarChart3 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => {
                              if (currentPage > 1) {
                                setCurrentPage(currentPage - 1);
                                handleFetchLinks(currentPage - 1);
                              }
                            }}
                            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>

                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => {
                                  setCurrentPage(page);
                                  handleFetchLinks(page);
                                }}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => {
                              if (currentPage < totalPages) {
                                setCurrentPage(currentPage + 1);
                                handleFetchLinks(currentPage + 1);
                              }
                            }}
                            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* QR Code Dialog */}
      {selectedLink && (
        <QRCodeDialog
          isOpen={qrDialogOpen}
          onClose={closeQRDialog}
          shortUrl={selectedLink.shortUrl}
          originalUrl={selectedLink.originalUrl}
          shortCode={selectedLink.shortCode}
          clicks={selectedLink.clicks || 0}
        />
      )}

      <FloatingDock
        items={navItems}
        onAction={handleDockAction}
        desktopClassName="sticky bottom-10 z-[999]"
        mobileClassName="fixed bottom-10 right-3 z-[999]"
      />

      {/* Search Dialog */}
      <SearchDialog
        isOpen={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        links={links}
      />

      <SpotlightDialog isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} />
    </div>
  );
}
