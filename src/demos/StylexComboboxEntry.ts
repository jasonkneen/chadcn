import type { ComponentType } from 'react';
import type { Demo } from './manifest';
export const stylexComboboxEntry: Demo = { id: 'shadcn-cssinjs:combobox-examples', family: 'combobox', title: 'combobox examples', source: 'shadcn-cssinjs', kind: 'Component', description: 'Controlled StyleX combobox with local filtering and selection.', importPath: '@chadcn/upstream-shadcn-cssinjs/combobox', load: () => import('./StylexComboboxExample').then(m => ({ default: m.StylexComboboxExample as ComponentType })) };
