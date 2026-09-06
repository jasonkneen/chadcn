import { legacyFormEntries } from './LegacyFormEntries';
import { providerDemoEntries } from './ProviderDemoEntries';
import { stylexComboboxEntry } from './StylexComboboxEntry';
import { providerShowcaseEntries } from './ProviderShowcaseEntries';
import { aiFinalEntries } from './AiFinalEntries';
import { aiGraphEntries } from './AiGraphEntries';
import { kiboInteractiveEntries } from './KiboInteractiveEntries';
import { kiboMediaEntries } from './KiboMediaEntries';
import { kiboDataEntries } from './KiboDataEntries';
import { stylexRemainingEntries } from './StylexRemainingEntries';
import { stylexAdaptedEntries } from './StylexAdaptedEntries';
import { aiMoreEntries } from './AiMoreEntries';
import { stylexMoreEntries } from './StylexMoreEntries';
import { kiboFinalEntries } from './KiboFinalEntries';
import { remainingShadcnExamples } from './RemainingShadcnExamples';
import { providerUpstreamExamples } from './ProviderUpstreamExamples';
import { remainingBlocks } from './RemainingBlocks';
import { kiboMoreEntries } from './KiboMoreEntries';
import { assistantExamples, aiElementExamples, kiboExamples, vueExamples } from './AssembledExamples';
import { baseBlockExamples, radixBlockExamples, ariaBlockExamples } from './BaseBlockExamples';
import { magicExamples } from './MagicExamples';
import type { ComponentType } from 'react';
import { blockDemos } from './BlockDemos';
import { upstreamExamples } from './UpstreamExamples';
export type Demo = { id: string; defaultExample?: boolean; family?: string; variantLabel?: string; title: string; source: string; kind: string; description: string; importPath: string; referencePath?: string; load: () => Promise<{default: ComponentType}> };
const variantModules = {
  shadcn: () => import('./ShadcnDemos'),
  'shadcn-base': () => import('./BaseDemos'),
  'shadcn-radix': () => import('./RadixDemos'),
  'shadcn-aria': () => import('./AriaDemos'),
  'shadcn-cssinjs': () => import('./StylexExamples'),
};
const variantDemos: Demo[] = Object.entries(variantModules).flatMap(([source, load]) =>
  (['button', 'input', 'textarea', 'checkbox', 'accordion'] as const)
    .filter(name => (source !== 'shadcn' || !['input','textarea'].includes(name)) && (source !== 'shadcn-cssinjs' || name !== 'textarea'))
    .map(name => ({
      id: `${source}:${name}`, title: name[0].toUpperCase() + name.slice(1), source,
      kind: 'Component', description: `Interactive ${name} from the ${source} registry.`,
      importPath: `@chadcn/upstream-${source}/${name}`,
      load: () => load().then(module => ({default: module[`${source === 'shadcn-cssinjs' ? 'Stylex' : ''}${name[0].toUpperCase()}${name.slice(1)}Demo` as keyof typeof module]})),
    })));
export const demos: Demo[] = [
  ...legacyFormEntries, ...providerDemoEntries, stylexComboboxEntry, ...providerShowcaseEntries, ...aiFinalEntries, ...aiGraphEntries, ...kiboInteractiveEntries, ...kiboMediaEntries, ...kiboDataEntries,
  ...stylexRemainingEntries, ...stylexAdaptedEntries, ...aiMoreEntries, ...stylexMoreEntries, ...kiboFinalEntries, ...remainingShadcnExamples, ...providerUpstreamExamples, ...remainingBlocks, ...kiboMoreEntries, ...vueExamples, ...assistantExamples, ...baseBlockExamples, ...radixBlockExamples, ...ariaBlockExamples, ...kiboExamples, ...magicExamples, ...aiElementExamples,
  ...(['dashboard','mail','crm','assistant'] as const).map((kind) => ({id:`chadcn:workspace-${kind}`,title:({dashboard:'Studio dashboard',mail:'Postbox email client',crm:'Relations CRM',assistant:'Threadwork assistant'})[kind],source:'chadcn',kind:'App',description:'A complete interactive workspace with navigation, settings, and detail panels. Uses local sample data; external services are not connected.',importPath:'src/demos/WorkspaceApps',load:()=>import('./WorkspaceApps').then(m=>({default:({dashboard:m.DashboardApp,mail:m.MailApp,crm:m.CRMApp,assistant:m.AssistantApp})[kind]}))})),
  ...variantDemos,
  ...blockDemos,
  ...upstreamExamples,
  {id:'chadcn:collection-card',title:'Collection card',source:'chadcn + shadcn + kibo',kind:'Composition',description:'A custom card with an interactive loading state.',importPath:'@chadcn/ui/collection-card',load:()=>import('../CompositionPreview')},
  {id:'shadcn:input',title:'Input',source:'shadcn',kind:'Component',description:'Controlled text entry and a disabled field.',importPath:'@chadcn/upstream-shadcn/input',load:()=>import('./ComponentDemos').then(m=>({default:m.InputDemo}))},
  {id:'shadcn:textarea',title:'Textarea',source:'shadcn',kind:'Component',description:'Editable notes with a live character count.',importPath:'@chadcn/upstream-shadcn/textarea',load:()=>import('./ComponentDemos').then(m=>({default:m.TextareaDemo}))},
  {id:'shadcn:table',title:'Project table',source:'shadcn',kind:'Component',description:'A searchable table composed from upstream table primitives.',importPath:'@chadcn/upstream-shadcn/table',load:()=>import('./ComponentDemos').then(m=>({default:m.TableDemo}))},
  {id:'kibo:spinner',title:'Spinner variants',source:'kibo',kind:'Component',description:'Compare eight animated loading indicators.',importPath:'@chadcn/upstream-kibo/spinner',load:()=>import('./ComponentDemos').then(m=>({default:m.SpinnerDemo}))},
  {id:'blocks:stats-01',title:'Financial overview',source:'blocks',kind:'Block',description:'The original four-metric financial overview block.',importPath:'@chadcn/upstream-blocks/stats-01',load:()=>import('@chadcn/upstream-blocks/stats-01')},
  {id:'blocks:stats-03',title:'Statistics / 03',source:'blocks',kind:'Block',description:'An alternate upstream statistics layout.',importPath:'@chadcn/upstream-blocks/stats-03',load:()=>import('@chadcn/upstream-blocks/stats-03')},
  {id:'blocks:stats-05',title:'Statistics / 05',source:'blocks',kind:'Block',description:'A different arrangement of the same reporting pattern.',importPath:'@chadcn/upstream-blocks/stats-05',load:()=>import('@chadcn/upstream-blocks/stats-05')},
  {id:'blocks:stats-13',title:'Statistics / 13',source:'blocks',kind:'Block',description:'Browse the original block and compare its themed presentation.',importPath:'@chadcn/upstream-blocks/stats-13',load:()=>import('@chadcn/upstream-blocks/stats-13')},
  {id:'blocks:stats-15',title:'Statistics / 15',source:'blocks',kind:'Block',description:'Another preserved upstream statistics variant.',importPath:'@chadcn/upstream-blocks/stats-15',load:()=>import('@chadcn/upstream-blocks/stats-15').then(m=>({default:m.Stats15}))},
];
