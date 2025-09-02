'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, Share, ExternalLink, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { copyToClipboard } from '@/app/utils/functions';
import Image from "next/image";

interface QRCodeDialogWithLogoProps {
  shortUrl: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
}

export function QRCodeDialogWithLogo({
  shortUrl,
  originalUrl,
  shortCode,
  clicks
}: QRCodeDialogWithLogoProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    try {
      setIsGenerating(true);
      
      // Gera QR Code com correção de erro alta para permitir logo
      const qrDataURL = await QRCode.toDataURL(shortUrl, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'H', // Alta correção de erro (30%)
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Cria canvas para adicionar logo
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;

      if (ctx) {
        // Desenha QR Code base
        const qrImage = new window.Image();
        qrImage.onload = () => {
          ctx.drawImage(qrImage, 0, 0, 300, 300);

          // Adiciona logo no centro
          const logoSize = 60; // 20% do tamanho do QR
          const logoX = (300 - logoSize) / 2;
          const logoY = (300 - logoSize) / 2;

          // Fundo branco arredondado para logo
          const bgRadius = 8;
          const bgSize = logoSize + 10;
          const bgX = logoX - 5;
          const bgY = logoY - 5;
          
          // Desenha retângulo arredondado branco
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(bgX, bgY, bgSize, bgSize, bgRadius);
          ctx.fill();
          
          // Carrega logo SVG
          const logoImage = new window.Image();
          logoImage.onload = () => {
            // Calcula proporções para manter aspect ratio
            const logoAspectRatio = logoImage.width / logoImage.height;
            let drawWidth = logoSize - 10;
            let drawHeight = logoSize - 10;
            
            if (logoAspectRatio > 1) {
              // Logo é mais larga que alta
              drawHeight = drawWidth / logoAspectRatio;
            } else {
              // Logo é mais alta que larga
              drawWidth = drawHeight * logoAspectRatio;
            }
            
            // Centraliza logo considerando as novas dimensões
            const drawX = logoX + (logoSize - drawWidth) / 2;
            const drawY = logoY + (logoSize - drawHeight) / 2;
            
            ctx.drawImage(logoImage, drawX, drawY, drawWidth, drawHeight);
            // Converte canvas final para dataURL
            setQrCodeDataURL(canvas.toDataURL('image/png'));
          };
          
          logoImage.onerror = () => {
            // Fallback: texto S se SVG não carregar
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('S', 150, 150);
            setQrCodeDataURL(canvas.toDataURL('image/png'));
          };
          logoImage.src = '/S.svg';
        };
        qrImage.src = qrDataURL;
      } else {
        // Fallback sem logo
        setQrCodeDataURL(qrDataURL);
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataURL) return;

    const link = document.createElement('a');
    link.download = `qr-code-${shortCode}.png`;
    link.href = qrCodeDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQRCode = async () => {
    if (navigator.share && qrCodeDataURL) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeDataURL);
        const blob = await response.blob();
        const file = new File([blob], `qr-code-${shortCode}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `QR Code - ${shortCode}`,
          text: `QR Code para: ${shortUrl}`,
          files: [file]
        });
      } catch (error) {
        // Fallback: copy URL
        copyToClipboard(shortUrl);
      }
    } else {
      // Fallback: copy URL
      copyToClipboard(shortUrl);
    }
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => generateQRCode()}
          title="Ver QR Code (com logo)"
        >
          <QrCode className="h-3 w-3" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            QR Code (com Logo)
            <Badge variant="secondary">{clicks} cliques</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            {isGenerating ? (
              <div className="w-[300px] h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Gerando QR Code...</div>
              </div>
            ) : qrCodeDataURL ? (
              <Image
                src={qrCodeDataURL}
                alt="QR Code com Logo"
                className="w-[300px] h-[300px] rounded-lg border"
                width={300}
                height={300}
              />
            ) : (
              <div className="w-[300px] h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Clique para gerar QR Code</div>
              </div>
            )}
          </div>

          {/* Link Info */}
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-foreground">Link curto:</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 text-background bg-foreground px-2 py-1 rounded text-sm font-mono">
                  {shortUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background"
                  onClick={() => copyToClipboard(shortUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Destino:</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex-1 text-sm text-foreground border px-2 py-1 rounded">
                  {truncateUrl(originalUrl)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background"
                  onClick={() => window.open(originalUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={downloadQRCode}
              disabled={!qrCodeDataURL}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>

            <Button
              variant="outline"
              onClick={shareQRCode}
              disabled={!qrCodeDataURL}
              className="flex-1"
            >
              <Share className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}