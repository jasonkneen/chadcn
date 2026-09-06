import type { Demo } from './manifest';
export const kiboDataEntries: Demo[] = [
  { id: 'kibo:kanban', family: 'kanban', variantLabel: 'Kibo', title: 'Kanban board', source: 'kibo', kind: 'Component', description: 'Drag cards between Kibo kanban columns.', importPath: '@chadcn/upstream-kibo/kanban', load: () => import('./KiboDataExamples').then(m => ({ default: m.KiboKanbanDemo })) },
  { id: 'kibo:list', family: 'list', variantLabel: 'Kibo', title: 'List board', source: 'kibo', kind: 'Component', description: 'Drag list items between Kibo groups.', importPath: '@chadcn/upstream-kibo/list', load: () => import('./KiboDataExamples').then(m => ({ default: m.KiboListDemo })) },
  { id: 'kibo:table', family: 'table', variantLabel: 'Kibo', title: 'Data table', source: 'kibo', kind: 'Component', description: 'Sortable data table rendered from local project data.', importPath: '@chadcn/upstream-kibo/table', load: () => import('./KiboDataExamples').then(m => ({ default: m.KiboTableDemo })) },
];
