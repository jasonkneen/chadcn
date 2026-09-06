import type { Demo } from './manifest';
const entries=[['calendar','CalendarDemo'],['scroll-area','ScrollAreaDemo'],['menubar','MenubarDemo'],['navigation-menu','NavigationMenuDemo']] as const;
export const stylexRemainingEntries:Demo[]=entries.map(([name,component])=>({id:`shadcn-cssinjs:${name}`,family:name,title:name.replaceAll('-',' '),source:'shadcn-cssinjs',kind:'Component',description:'Interactive example using the original StyleX implementation.',importPath:`@chadcn/upstream-shadcn-cssinjs/${name}`,load:()=>import('./StylexRemainingExamples').then(m=>({default:m[component]}))}));
