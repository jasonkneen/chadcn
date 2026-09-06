import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import './next-font.css';

// Vite supplies the same local font family that Next normally emits at build time.
export function Vazirmatn(_options?: unknown) {
 return {className:'font-vazirmatn',style:{fontFamily:'Vazirmatn, sans-serif'}};
}
