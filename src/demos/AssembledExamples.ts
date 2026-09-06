import type { Demo } from './manifest';

export const kiboExamples: Demo[] = [
  { id: 'kibo:announcement', title: 'Announcement', source: 'kibo', kind: 'Component', description: 'A themed announcement badge with a tag and title.', importPath: '@chadcn/upstream-kibo/announcement', load: () => import('./KiboExamples').then(m => ({ default: m.AnnouncementDemo })) },
  { id: 'kibo:banner', title: 'Banner', source: 'kibo', kind: 'Component', description: 'Dismissible workspace banner with an action and restore control.', importPath: '@chadcn/upstream-kibo/banner', load: () => import('./KiboExamples').then(m => ({ default: m.BannerDemo })) },
  { id: 'kibo:choicebox', title: 'Choicebox', source: 'kibo', kind: 'Component', description: 'Selectable plan options built from Kibo choicebox parts.', importPath: '@chadcn/upstream-kibo/choicebox', load: () => import('./KiboExamples').then(m => ({ default: m.ChoiceboxDemo })) },
  { id: 'kibo:pill', title: 'Pill', source: 'kibo', kind: 'Component', description: 'A compact status pill with an interactive follow action.', importPath: '@chadcn/upstream-kibo/pill', load: () => import('./KiboExamples').then(m => ({ default: m.PillDemo })) },
  { id: 'kibo:rating', title: 'Rating', source: 'kibo', kind: 'Component', description: 'Keyboard accessible five star rating control.', importPath: '@chadcn/upstream-kibo/rating', load: () => import('./KiboExamples').then(m => ({ default: m.RatingDemo })) },
  { id: 'kibo:relative-time', title: 'Relative time', source: 'kibo', kind: 'Component', description: 'Live time display across two time zones.', importPath: '@chadcn/upstream-kibo/relative-time', load: () => import('./KiboExamples').then(m => ({ default: m.RelativeTimeDemo })) },
  { id: 'kibo:status', title: 'Status', source: 'kibo', kind: 'Component', description: 'Animated service status indicator with cycling state.', importPath: '@chadcn/upstream-kibo/status', load: () => import('./KiboExamples').then(m => ({ default: m.StatusDemo })) },
  { id: 'kibo:ticker', title: 'Ticker', source: 'kibo', kind: 'Component', description: 'Clickable market ticker with formatted price and change.', importPath: '@chadcn/upstream-kibo/ticker', load: () => import('./KiboExamples').then(m => ({ default: m.TickerDemo })) },
  { id: 'kibo:theme-switcher', title: 'Theme switcher', source: 'kibo', kind: 'Component', description: 'Three way system, light, and dark theme selector.', importPath: '@chadcn/upstream-kibo/theme-switcher', load: () => import('./KiboExamples').then(m => ({ default: m.ThemeSwitcherDemo })) },
];


export const aiElementExamples: Demo[] = [
  { id: 'ai-elements:message', title: 'Message', source: 'ai-elements', kind: 'Component', description: 'Assistant message with a copy action and live feedback.', importPath: '@chadcn/upstream-ai-elements/message', load: () => import('./AiElementExamples').then(m => ({ default: m.AiMessageDemo })) },
  { id: 'ai-elements:loader', title: 'Loader', source: 'ai-elements', kind: 'Component', description: 'Compact loading indicator for an in-progress response.', importPath: '@chadcn/upstream-ai-elements/loader', load: () => import('./AiElementExamples').then(m => ({ default: m.AiLoaderDemo })) },
  { id: 'ai-elements:shimmer', title: 'Shimmer', source: 'ai-elements', kind: 'Component', description: 'Animated text treatment for drafting states.', importPath: '@chadcn/upstream-ai-elements/shimmer', load: () => import('./AiElementExamples').then(m => ({ default: m.AiShimmerDemo })) },
  { id: 'ai-elements:reasoning', title: 'Reasoning', source: 'ai-elements', kind: 'Component', description: 'Collapsible reasoning content with a streaming toggle.', importPath: '@chadcn/upstream-ai-elements/reasoning', load: () => import('./AiElementExamples').then(m => ({ default: m.AiReasoningDemo })) },
  { id: 'ai-elements:chain-of-thought', title: 'Chain of thought', source: 'ai-elements', kind: 'Block', description: 'Expandable steps and search results for an answer trace.', importPath: '@chadcn/upstream-ai-elements/chain-of-thought', load: () => import('./AiElementExamples').then(m => ({ default: m.AiChainOfThoughtDemo })) },
  { id: 'ai-elements:plan', title: 'Plan', source: 'ai-elements', kind: 'Block', description: 'Expandable execution plan with progress steps.', importPath: '@chadcn/upstream-ai-elements/plan', load: () => import('./AiElementExamples').then(m => ({ default: m.AiPlanDemo })) },
  { id: 'ai-elements:task', title: 'Task', source: 'ai-elements', kind: 'Block', description: 'Collapsible task trace with referenced files.', importPath: '@chadcn/upstream-ai-elements/task', load: () => import('./AiElementExamples').then(m => ({ default: m.AiTaskDemo })) },
  { id: 'ai-elements:sources', title: 'Sources', source: 'ai-elements', kind: 'Block', description: 'Expandable list of links supporting an answer.', importPath: '@chadcn/upstream-ai-elements/sources', load: () => import('./AiElementExamples').then(m => ({ default: m.AiSourcesDemo })) },
  { id: 'ai-elements:suggestions', title: 'Suggestions', source: 'ai-elements', kind: 'Component', description: 'Clickable suggested prompts with selected state.', importPath: '@chadcn/upstream-ai-elements/suggestion', load: () => import('./AiElementExamples').then(m => ({ default: m.AiSuggestionsDemo })) },
];


export const assistantExamples: Demo[] = [
  { id: 'assistant-ui:thread', title: 'Assistant thread', source: 'assistant-ui', kind: 'Block', description: 'A real assistant-ui thread primitive wired to a local scripted response.', importPath: '@assistant-ui/react', load: () => import('./AssistantExamples').then(m => ({ default: m.AssistantDemo })) },
];

export const vueExamples: Demo[] = [
  {
    id: 'ai-elements-vue:loader', title: 'Loader', source: 'ai-elements-vue', kind: 'Component',
    description: 'Vue loading indicator mounted from the ai-elements-vue source package.',
    importPath: '@repo/elements/loader', load: () => import('./VueExamples').then(m => ({ default: m.VueLoaderDemo })),
  },
  {
    id: 'ai-elements-vue:shimmer', title: 'Shimmer', source: 'ai-elements-vue', kind: 'Component',
    description: 'Vue shimmer text treatment mounted from the ai-elements-vue source package.',
    importPath: '@repo/elements/shimmer', load: () => import('./VueExamples').then(m => ({ default: m.VueShimmerDemo })),
  },
];
