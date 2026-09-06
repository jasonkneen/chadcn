import type { Demo } from './manifest';

const components = [
  ['alert', 'Alert', 'An alert message preview.', 'AlertExample'], ['badge', 'Badge', 'Badge variants preview.', 'BadgeExample'], ['card', 'Card', 'A card layout preview.', 'CardExample'], ['dialog', 'Dialog', 'An interactive dialog preview.', 'DialogExample'], ['select', 'Select', 'A select menu preview.', 'SelectExample'], ['tabs', 'Tabs', 'Tabbed content preview.', 'TabsExample'], ['switch', 'Switch', 'A controlled switch preview.', 'SwitchExample'], ['slider', 'Slider', 'A range slider preview.', 'SliderExample'], ['progress', 'Progress', 'A progress indicator preview.', 'ProgressExample'], ['avatar', 'Avatar', 'An avatar fallback preview.', 'AvatarExample'], ['separator', 'Separator', 'A visual separator preview.', 'SeparatorExample'], ['tooltip', 'Tooltip', 'A tooltip interaction preview.', 'TooltipExample'], ['popover', 'Popover', 'A popover interaction preview.', 'PopoverExample'],
] as const;

export const variantComponentEntries: Demo[] = components.map(([name, title, description, component]) => ({
  id: `shadcn-base:${name}-example`, family: name, variantLabel: 'Base UI', title, source: 'shadcn-base', kind: 'Component', description,
  importPath: `@chadcn/upstream-shadcn-base/${name}`,
  load: () => import('./VariantComponentExamples').then(module => ({ default: module[component] })),
}));
