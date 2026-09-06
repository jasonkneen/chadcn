import type { Demo } from './manifest';
import type { ComponentType } from 'react';
const entry = (id: string, title: string, importPath: string, component: string, kind: 'Component' | 'Block', description: string): Demo => ({ id: `kibo:${id}`, title, source: 'kibo', kind, description, importPath, load: () => import('./KiboFinalExamples').then(m => ({ default: m[component as keyof typeof m] as ComponentType })) });
export const kiboFinalEntries: Demo[] = [
  entry('calendar', 'Calendar', '@chadcn/upstream-kibo/calendar', 'KiboCalendarDemo', 'Block', 'Calendar controls for browsing month and year.'),
  entry('comparison', 'Comparison', '@chadcn/upstream-kibo/comparison', 'KiboComparisonDemo', 'Component', 'Drag handle comparison between two states.'),
  entry('deck', 'Deck', '@chadcn/upstream-kibo/deck', 'KiboDeckDemo', 'Block', 'Swipeable stacked cards with an empty state.'),
  entry('cursor', 'Cursor', '@chadcn/upstream-kibo/cursor', 'KiboCursorDemo', 'Component', 'Collaborative cursor with participant context.'),
  entry('glimpse', 'Glimpse', '@chadcn/upstream-kibo/glimpse', 'KiboGlimpseDemo', 'Component', 'Hover preview for contextual information.'),
  entry('marquee', 'Marquee', '@chadcn/upstream-kibo/marquee', 'KiboMarqueeDemo', 'Component', 'Hover-pausable scrolling content strip.'),
  entry('qr-code', 'QR code', '@chadcn/upstream-kibo/qr-code', 'KiboQRCodeDemo', 'Component', 'Live QR code generated from editable data.'),
  entry('snippet', 'Snippet', '@chadcn/upstream-kibo/snippet', 'KiboSnippetDemo', 'Block', 'Tabbed code snippet with copy action.'),
  entry('tree', 'Tree', '@chadcn/upstream-kibo/tree', 'KiboTreeDemo', 'Block', 'Expandable selectable workspace tree.'),
  entry('contribution-graph', 'Contribution graph', '@chadcn/upstream-kibo/contribution-graph', 'KiboContributionDemo', 'Block', 'Activity graph backed by local sample data.'),
  entry('credit-card', 'Credit card', '@chadcn/upstream-kibo/credit-card', 'KiboCreditCardDemo', 'Component', 'Rendered payment card with card details.'),
  entry('image-zoom', 'Image zoom', '@chadcn/upstream-kibo/image-zoom', 'KiboImageZoomDemo', 'Component', 'Click to zoom an image preview.'),
  entry('reel', 'Reel', '@chadcn/upstream-kibo/reel', 'KiboReelDemo', 'Block', 'Local image reel with previous and next controls.'),
];
