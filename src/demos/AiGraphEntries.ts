import type { Demo } from './manifest';

export const aiGraphEntries: Demo[] = [{
  id: 'ai-elements:canvas', title: 'Canvas graph', source: 'ai-elements', kind: 'Component',
  description: 'A local two node graph using the packaged AI Elements canvas and controls.',
  importPath: '@chadcn/upstream-ai-elements/canvas',
  load: () => import('./AiGraphExamples').then(m => ({ default: m.AiGraphDemo })),
}];

for (const part of ['connection','controls','edge','node','panel']) aiGraphEntries.push({ id:`ai-elements:${part}`, title:part[0].toUpperCase()+part.slice(1), source:'ai-elements', kind:'Component', description:`The actual AI Elements ${part} shown in a working graph with draggable nodes, connections, and controls.`, importPath:`@chadcn/upstream-ai-elements/${part}`, load:()=>import('./AiGraphExamples').then(m=>({default:m.AiGraphDemo})) });
