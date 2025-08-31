'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import Spotlight from './Spotlight';

interface SpotlightDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpotlightDialog({ isOpen, onClose }: SpotlightDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed max-w-none min-w-full w-full h-full border-none p-0 backdrop-blur-md bg-black/20">
        {/* Accessibility requirements - hidden from visual display */}
        <DialogTitle className="sr-only">Spotlight Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search and create short URLs using the spotlight interface
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
            <Spotlight isOpen={isOpen} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}