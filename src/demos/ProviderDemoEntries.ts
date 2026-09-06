import type { Demo } from './manifest';

export const providerDemoEntries: Demo[] = [
  { id: 'shadcn-base:demo', family: 'demo', variantLabel: 'Base UI', title: 'Interface controls showcase', source: 'shadcn-base', kind: 'Block', description: 'Packaged Base UI demo.', importPath: '@chadcn/upstream-shadcn-base/demo', load: () => import('@chadcn/upstream-shadcn-base/demo').then(m => ({ default: m.Demo })) },
  { id: 'shadcn-radix:demo', family: 'demo', variantLabel: 'Radix UI', title: 'Interface controls showcase', source: 'shadcn-radix', kind: 'Block', description: 'Packaged Radix UI demo.', importPath: '@chadcn/upstream-shadcn-radix/demo', load: () => import('@chadcn/upstream-shadcn-radix/demo').then(m => ({ default: m.Demo })) },
  { id: 'shadcn-aria:demo', family: 'demo', variantLabel: 'React Aria', title: 'Interface controls showcase', source: 'shadcn-aria', kind: 'Block', description: 'Packaged React Aria demo.', importPath: '@chadcn/upstream-shadcn-aria/demo', load: () => import('@chadcn/upstream-shadcn-aria/demo').then(m => ({ default: m.Demo })) },
];
