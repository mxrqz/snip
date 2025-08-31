import { useHotkeys } from 'react-hotkeys-hook';

// Shortcut Ctrl/Cmd+K - Abrir spotlight/search
export const useSpotlightShortcut = ({onShortcut}: { onShortcut: () => void;}) => {
  useHotkeys('ctrl+k, cmd+k', (event) => {
    event.preventDefault();
    // alert('Shortcut Ctrl/Cmd+K funcionando!');
    onShortcut()
  });
};

// Hook para importar todos os shortcuts (opcional)
export const useAllShortcuts = () => {
  useSpotlightShortcut({
    onShortcut: () => alert('Shortcut funcionando!')
  });
};