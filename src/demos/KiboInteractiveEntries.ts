import type { ComponentType } from 'react';
import type { Demo } from './manifest';
const entry = (id: string, title: string, path: string, component: keyof typeof import('./KiboInteractiveExamples'), kind: 'Component' | 'Block', description: string): Demo => ({ id: `kibo:${id}`, title, source: 'kibo', kind, description, importPath: path, load: () => import('./KiboInteractiveExamples').then(m => ({ default: m[component] as ComponentType })) });
export const kiboInteractiveEntries: Demo[] = [
  entry('editor', 'Editor', '@chadcn/upstream-kibo/editor', 'KiboEditorDemo', 'Block', 'Editable TipTap editor with selection formatting.'),
  entry('stories', 'Stories', '@chadcn/upstream-kibo/stories', 'KiboStoriesDemo', 'Block', 'Navigable stories carousel with author overlays.'),
  entry('gantt', 'Gantt', '@chadcn/upstream-kibo/gantt', 'KiboGanttDemo', 'Block', 'Interactive roadmap timeline with selectable items.'),
];
