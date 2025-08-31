'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';
import { Link2, MousePointerClick, Calendar, Copy, ExternalLink, BarChart3, Plus } from 'lucide-react';
import { LinkData } from '@/app/utils/database';
import { copyToClipboard, formatDate } from "../utils/functions";
import { fetchStats, fetchLinks, createLink } from '@/app/services/dashboardService';

interface UserStats {
  totalLinks: number;
  totalClicks: number;
  todayClicks: number;
}

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

  const handleFetchStats = async () => {
    const result = await fetchStats();
    if (result) {
      setStats(result);
    }
  };

  const handleFetchLinks = async (page: number) => {
    setLoading(true);
    const result = await fetchLinks(page, 20);
    if (result) {
      setLinks(result.links);
      setTotalCount(result.totalCount);
      setTotalPages(Math.ceil(result.totalCount / 20));
    }
    setLoading(false);
  };

  const handleCreateLink = async () => {
    setCreating(true);
    const result = await createLink(newUrl);
    if (result.success) {
      setNewUrl('');
      await handleFetchStats();
      await handleFetchLinks(currentPage);
    }
    setCreating(false);
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">

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
            <div className="flex gap-2">
              <Input
                placeholder="Digite a URL que deseja encurtar..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateLink()}
              />
              
              <Button onClick={handleCreateLink} disabled={creating}>
                {creating ? 'Criando...' : 'Encurtar'}
              </Button>
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
                            <Calendar className="h-3 w-3 text-muted-foreground" />

                            <span className="text-sm text-muted-foreground">
                              {formatDate(link.createdAt)}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(link.analyticsUrl, '_blank')}
                          >
                            <BarChart3 className="h-3 w-3" />
                          </Button>
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
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
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
                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
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
    </div>
  );
}