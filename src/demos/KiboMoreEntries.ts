import type { Demo } from './manifest';

export const kiboMoreEntries: Demo[] = [
  { id: 'kibo:avatar-stack', title: 'Avatar stack', source: 'kibo', kind: 'Component', description: 'Overlapping participant avatars with hover spacing.', importPath: '@chadcn/upstream-kibo/avatar-stack', load: () => import('./KiboMoreExamples').then(m => ({ default: m.AvatarStackDemo })) },
  { id: 'kibo:code-block', title: 'Code block', source: 'kibo', kind: 'Block', description: 'A syntax highlighted code block backed by Kibo code parts.', importPath: '@chadcn/upstream-kibo/code-block', load: () => import('./KiboMoreExamples').then(m => ({ default: m.CodeBlockDemo })) },
  { id: 'kibo:color-picker', title: 'Color picker', source: 'kibo', kind: 'Component', description: 'Interactive color selection with live output.', importPath: '@chadcn/upstream-kibo/color-picker', load: () => import('./KiboMoreExamples').then(m => ({ default: m.ColorPickerDemo })) },
  { id: 'kibo:dialog-stack', title: 'Dialog stack', source: 'kibo', kind: 'Block', description: 'Navigable layered panels in a dialog stack.', importPath: '@chadcn/upstream-kibo/dialog-stack', load: () => import('./KiboMoreExamples').then(m => ({ default: m.DialogStackDemo })) },
  { id: 'kibo:dropzone', title: 'Dropzone', source: 'kibo', kind: 'Component', description: 'Local image file dropzone with selected file feedback.', importPath: '@chadcn/upstream-kibo/dropzone', load: () => import('./KiboMoreExamples').then(m => ({ default: m.DropzoneDemo })) },
  { id: 'kibo:mini-calendar', title: 'Mini calendar', source: 'kibo', kind: 'Component', description: 'Five day calendar with navigation and selection.', importPath: '@chadcn/upstream-kibo/mini-calendar', load: () => import('./KiboMoreExamples').then(m => ({ default: m.MiniCalendarDemo })) },
  { id: 'kibo:combobox', title: 'Combobox', source: 'kibo', kind: 'Component', description: 'Searchable team selector with local options.', importPath: '@chadcn/upstream-kibo/combobox', load: () => import('./KiboMoreExamples').then(m => ({ default: m.ComboboxDemo })) },
  { id: 'kibo:tags', title: 'Tags', source: 'kibo', kind: 'Component', description: 'Searchable tag picker with removable selection.', importPath: '@chadcn/upstream-kibo/tags', load: () => import('./KiboMoreExamples').then(m => ({ default: m.TagsDemo })) },
];
