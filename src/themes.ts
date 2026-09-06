export const themes = [
  { id: 'base', name: 'Base' },
  { id: 'ocean', name: 'Ocean' },
  { id: 'rose', name: 'Rose' },
  { id: 'terminal', name: 'Terminal' },
  { id: 'neo-brutal', name: 'Rounded Neo Brutal' },
  { id: 'classic-brutal', name: 'Classic Brutal' },
  { id: 'atelier', name: 'Atelier' },
  { id: 'blueprint', name: 'Blueprint' },
] as const;
export type ThemeId = typeof themes[number]['id'];
export type ColorMode = 'light' | 'dark' | 'system';
export function readAppearance(): { theme: ThemeId; mode: ColorMode } {
  try {
    const saved = JSON.parse(localStorage.getItem('chadcn:appearance') ?? '{}');
    return {
      theme: themes.some(t => t.id === saved.theme) ? saved.theme : 'base',
      mode: ['light', 'dark', 'system'].includes(saved.mode) ? saved.mode : 'light',
    };
  } catch { return { theme: 'base', mode: 'light' }; }
}
