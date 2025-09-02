import { useHotkeys } from 'react-hotkeys-hook';

// Shortcut Ctrl/Cmd+K - Abrir componente Spotlight (criar links)
export const useSpotlightShortcut = ({onShortcut}: { onShortcut: () => void;}) => {
  useHotkeys('ctrl+k, cmd+k', (event) => {
    event.preventDefault();
    onShortcut()
  });
};

// Shortcut Ctrl/Cmd+Shift+F - Buscar links existentes
export const useSearchShortcut = (callback: () => void) => {
  useHotkeys('ctrl+shift+f, cmd+shift+f', (event) => {
    event.preventDefault();
    callback();
  });
};

// Hook para importar todos os shortcuts (opcional)
export const useAllShortcuts = () => {
  useSpotlightShortcut({
    onShortcut: () => alert('Shortcut funcionando!')
  });
};