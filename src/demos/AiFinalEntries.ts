import type { Demo } from './manifest';

const components = ['audio-player', 'code-block', 'image', 'mic-selector', 'open-in-chat', 'persona', 'prompt-input', 'sandbox', 'speech-input', 'toolbar', 'voice-selector'] as const;
const componentExports = {
  'audio-player': 'AiAudioPlayerDemo', 'code-block': 'AiCodeBlockDemo', image: 'AiImageDemo', 'mic-selector': 'AiMicSelectorDemo', 'open-in-chat': 'AiOpenInDemo', persona: 'AiPersonaDemo', 'prompt-input': 'AiPromptInputDemo', sandbox: 'AiSandboxDemo', 'speech-input': 'AiSpeechInputDemo', toolbar: 'AiToolbarDemo', 'voice-selector': 'AiVoiceSelectorDemo',
} as const;

export const aiFinalEntries: Demo[] = components.map(name => ({
  id: `ai-elements:${name}`, title: name.replaceAll('-', ' '), source: 'ai-elements', kind: 'Component',
  description: `Interactive ${name.replaceAll('-', ' ')} preview using the packaged AI Elements component.`,
  importPath: `@chadcn/upstream-ai-elements/${name}`,
  load: () => import('./AiFinalExamples').then(module => ({ default: module[componentExports[name]] })),
}));
