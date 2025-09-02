'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, Copy, BarChart3, QrCode, Calendar } from 'lucide-react';
import Fuse from 'fuse.js';
import { LinkData } from '@/app/types/types';
import { copyToClipboard, formatDate } from '@/app/utils/functions';
import { QRCodeDialog } from './QRCodeDialog';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  links: LinkData[];
}

export function SearchDialog({ isOpen, onClose, links }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // Configuração do Fuse.js para fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(links, {
      keys: [
        { name: 'originalUrl', weight: 0.7 },
        { name: 'shortCode', weight: 0.3 }
      ],
      threshold: 0.3, // 0 = exact match, 1 = very fuzzy
      includeScore: true,
      includeMatches: true
    });
  }, [links]);

  // Filtra links com base na busca
  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) {
      return links.slice(0, 8); // Mostra últimos 8 links
    }

    const results = fuse.search(searchQuery);
    return results.map(result => result.item).slice(0, 8);
  }, [searchQuery, fuse, links]);

  // Reset quando dialog abre/fecha
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Reset selected quando filteredLinks muda
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredLinks]);

  // Auto-scroll para o item selecionado
  useEffect(() => {
    if (selectedItemRef.current && resultsContainerRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredLinks.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredLinks[selectedIndex]) {
          handleLinkAction(filteredLinks[selectedIndex], 'open');
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleLinkAction = (link: LinkData, action: 'open' | 'copy' | 'qr' | 'analytics') => {
    switch (action) {
      case 'open':
        window.open(link.originalUrl, '_blank');
        onClose();
        break;
      case 'copy':
        copyToClipboard(link.shortUrl);
        break;
      case 'qr':
        setSelectedLink(link);
        setShowQRDialog(true);
        break;
      case 'analytics':
        window.open(link.analyticsUrl, '_blank');
        onClose();
        break;
    }
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="fixed max-w-none min-w-full w-full h-full border-none p-0 backdrop-blur-md bg-black/20">
          {/* Accessibility requirements */}
          <DialogTitle className="sr-only">Buscar Links</DialogTitle>

          <DialogDescription className="sr-only">
            Busque e encontre seus links encurtados rapidamente
          </DialogDescription>

          {/* Full screen container with glass effect */}
          <div
            className="w-full h-full flex items-center justify-center p-6"
            onClick={onClose}
          >
            <div
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Main Search Container */}
              <div className="bg-foreground rounded-3xl shadow-2xl overflow-hidden max-h-fit h-fit aspect-[16/10] flex flex-col">

                {/* Top Bar */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-background rounded-full"></div>
                      <div className="w-3 h-3 bg-background rounded-full"></div>
                      <div className="w-3 h-3 bg-background rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Buscar Links</div>
                  </div>
                </div>

                {/* Search Input */}
                <div className="p-6">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar por URL ou código..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none text-black placeholder-gray-400 text-lg"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Results Area */}
                <div className="px-6 pb-6 h-full overflow-y-auto" ref={resultsContainerRef}>
                  {filteredLinks.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="text-gray-500 text-sm">
                        {searchQuery ? 'Nenhum link encontrado' : 'Digite para buscar seus links'}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredLinks.map((link, index) => (
                        <div
                          key={link.shortCode}
                          ref={index === selectedIndex ? selectedItemRef : null}
                          className={`p-4 rounded-2xl cursor-pointer transition-all ${index === selectedIndex
                            ? 'bg-background text-foreground'
                            : 'hover:bg-gray-50 text-background'
                            }`}
                          onClick={() => handleLinkAction(link, 'open')}
                        >
                          {/* Link Info */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === selectedIndex ? 'bg-white' : 'bg-black'
                                }`}>
                                <ExternalLink className={`w-4 h-4 ${index === selectedIndex ? 'text-black' : 'text-white'
                                  }`} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className={`font-medium text-sm ${index === selectedIndex ? 'text-white' : 'text-black'
                                  }`}>
                                  {truncateUrl(link.originalUrl)}
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                  <code className={`text-xs px-2 py-1 rounded ${index === selectedIndex
                                    ? 'bg-foreground text-background'
                                    : 'bg-background text-foreground'
                                    }`}>
                                    {link.shortCode}
                                  </code>

                                  <code className={`text-xs px-2 py-1 rounded ${index === selectedIndex
                                    ? 'border border-foreground text-foreground'
                                    : 'border border-background text-background'
                                    }`}>
                                    {link.clicks || 0} cliques
                                  </code>
                                </div>
                              </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-1 text-xs opacity-70">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(link.createdAt)}</span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLinkAction(link, 'copy');
                              }}
                              className={`h-8 text-xs ${index === selectedIndex
                                ? 'text-white hover:bg-gray-800'
                                : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copiar
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLinkAction(link, 'qr');
                              }}
                              className={`h-8 text-xs ${index === selectedIndex
                                ? 'text-white hover:bg-gray-800'
                                : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                              <QrCode className="w-3 h-3 mr-1" />
                              QR
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLinkAction(link, 'analytics');
                              }}
                              className={`h-8 text-xs ${index === selectedIndex
                                ? 'text-white hover:bg-gray-800'
                                : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                              <BarChart3 className="w-3 h-3 mr-1" />
                              Stats
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Keyboard Hint */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-white text-sm">
                  <kbd className="px-2 py-1 bg-white text-black rounded text-xs">↑↓</kbd>
                  <span>navegar</span>
                  <kbd className="px-2 py-1 bg-white text-black rounded text-xs">Enter</kbd>
                  <span>abrir</span>
                  <kbd className="px-2 py-1 bg-white text-black rounded text-xs">Esc</kbd>
                  <span>fechar</span>
                </div>
              </div>

            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      {selectedLink && (
        <QRCodeDialog
          isOpen={showQRDialog}
          onClose={() => setShowQRDialog(false)}
          shortUrl={selectedLink.shortUrl}
          originalUrl={selectedLink.originalUrl}
          shortCode={selectedLink.shortCode}
          clicks={selectedLink.clicks || 0}
        />
      )}
    </>
  );
}