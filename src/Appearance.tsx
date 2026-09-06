import { Button } from '@chadcn/upstream-shadcn/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import Dropdown from './Dropdown';
import { useEffect, useState } from 'react';
import { themes, readAppearance, type ThemeId } from './themes';

export default function Appearance() {
  const [appearance, setAppearance] = useState(readAppearance);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = appearance.mode === 'dark' || (appearance.mode === 'system' && media.matches);
      document.documentElement.dataset.theme = appearance.theme;
      document.documentElement.dataset.mode = dark ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    };
    apply();
    media.addEventListener('change', apply);
    try { localStorage.setItem('chadcn:appearance', JSON.stringify(appearance)); } catch {}
    return () => media.removeEventListener('change', apply);
  }, [appearance]);
  return <div className="appearance-controls" aria-label="Appearance">
    <div className="theme-select"><Dropdown label="Choose theme" value={appearance.theme} onChange={theme=>setAppearance({...appearance,theme:theme as ThemeId})} options={themes.map(theme=>({value:theme.id,label:theme.name}))}/></div>
    <div className="mode-switch" role="group" aria-label="Color mode">
      {(['light', 'dark', 'system'] as const).map(mode => {const Icon=mode==='light'?Sun:mode==='dark'?Moon:Monitor;return <Button variant="ghost" size="icon" key={mode} title={`${mode[0].toUpperCase()+mode.slice(1)} mode`} aria-label={`${mode[0].toUpperCase()+mode.slice(1)} mode`} aria-pressed={appearance.mode === mode} onClick={() => setAppearance({ ...appearance, mode })}><Icon size={18}/></Button>})}
    </div>
  </div>;
}
