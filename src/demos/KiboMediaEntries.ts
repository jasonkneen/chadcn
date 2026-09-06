import type { ComponentType } from 'react';
import type { Demo } from './manifest';
const entry = (id: string, title: string, importPath: string, component: keyof typeof import('./KiboMediaExamples'), kind: 'Component' | 'Block', description: string): Demo => ({ id: `kibo:${id}`, title, source: 'kibo', kind, description, importPath, load: () => import('./KiboMediaExamples').then(m => ({ default: m[component] as ComponentType })) });
export const kiboMediaEntries: Demo[] = [
  entry('image-crop', 'Image crop', '@chadcn/upstream-kibo/image-crop', 'KiboImageCropDemo', 'Component', 'Choose a local image and crop it with Kibo.'),
  entry('video-player', 'Video player', '@chadcn/upstream-kibo/video-player', 'KiboVideoPlayerDemo', 'Block', 'Media Chrome player with standard controls.'),
  entry('sandbox', 'Sandbox', '@chadcn/upstream-kibo/sandbox', 'KiboSandboxDemo', 'Block', 'Editable Sandpack source with a live preview.'),
];
