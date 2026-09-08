import { useState, type ReactNode } from 'react';
import { Code2, RotateCcw } from 'lucide-react';
import { AIChatBar } from '@chadcn/ui/ai-chat-bar';
import { AITodoList } from '@chadcn/ui/ai-todo-list';
import { SchemaBuilder } from '@chadcn/ui/schema-builder';
import './studio-lab.css';

function Stage({ kind, children }: { kind: 'chat' | 'todo' | 'schema'; children: ReactNode }) {
  return <div className="studio-stage" data-kind={kind}>{children}</div>;
}

export function ChatBarDemo() {
  return <Stage kind="chat"><AIChatBar /></Stage>;
}

export function TodoListDemo() {
  return <Stage kind="todo"><AITodoList autoPlay /></Stage>;
}

export function SchemaBuilderDemo() {
  return <Stage kind="schema"><SchemaBuilder /></Stage>;
}

const samples = [
  {
    key: 'ai-chat',
    number: '01',
    name: 'AI chat bar',
    file: 'ai-chat-bar/AIChatBar.tsx',
    note: 'Write a prompt, choose a model, or type @ to add context.',
    code: 'import { AIChatBar } from "@chadcn/ui/ai-chat-bar";\n\n<AIChatBar onSend={async (message) => {\n  // text, mode, model, context, files\n  // Connect your API here. This demo simulates processing.\n}} />',
  },
  {
    key: 'to-do',
    number: '02',
    name: 'AI to-do list',
    file: 'ai-todo-list/AITodoList.tsx',
    note: 'Watch the sequence complete, then click Tasks to reopen it.',
    code: 'import { AITodoList } from "@chadcn/ui/ai-todo-list";\n\n<AITodoList autoPlay onComplete={() => {\n  // Local sequence finished. Remount with a new key to replay.\n}} />',
  },
  {
    key: 'schema',
    number: '03',
    name: 'Schema builder',
    file: 'schema-builder/SchemaBuilder.tsx',
    note: 'Add properties and nested groups. Switch to JSON to edit or copy.',
    code: 'import { SchemaBuilder } from "@chadcn/ui/schema-builder";\n\n<SchemaBuilder onChange={(schema) => {\n  // JSON Schema subset: type, properties, required, items, string enum\n}} />',
  },
] as const;

function LabCard({
  sample,
  wide,
  onReset,
  children,
}: {
  sample: (typeof samples)[number];
  wide?: boolean;
  onReset: () => void;
  children: ReactNode;
}) {
  const [showCode, setShowCode] = useState(false);
  return <article className="studio-lab-card" data-wide={wide || undefined} id={sample.key}>
    <div className="studio-lab-top">
      <div>
        <span className="studio-lab-number">{sample.number}</span>
        <h3>{sample.name}</h3>
      </div>
      <div className="studio-lab-tools">
        <button type="button" aria-label={`Reset ${sample.name}`} title="Reset" onClick={onReset}><RotateCcw size={15} /></button>
        <button type="button" aria-label={`Show ${sample.name} usage`} aria-expanded={showCode} data-active={showCode} onClick={() => setShowCode(!showCode)}><Code2 size={16} /></button>
      </div>
    </div>
    {children}
    {showCode && <pre className="studio-lab-code"><code>{sample.code}</code></pre>}
    <div className="studio-lab-foot">
      <p>{sample.note}</p>
      <code>@chadcn/ui/{sample.file.replace(/\/[^/]+$/, '')}</code>
    </div>
  </article>;
}

export default function StudioLabDemo() {
  const [keys, setKeys] = useState([0, 0, 0]);
  const reset = (index: number) => setKeys((values) => values.map((value, i) => (i === index ? value + 1 : value)));
  return <div className="studio-lab">
    <div className="studio-lab-intro">
      <div>
        <p className="studio-lab-eyebrow">CHADCN / STUDIO</p>
        <h2>Small details. Fully interactive.</h2>
        <p>Three authored compositions with working local behaviour. Sending a prompt simulates processing; no model, checkout, or app install is connected.</p>
      </div>
      <div className="studio-lab-stack"><span>React</span><span>TypeScript</span><span>shadcn</span><span>CSS motion</span></div>
    </div>
    <div className="studio-lab-grid">
      <LabCard sample={samples[0]} onReset={() => reset(0)}>
        <Stage kind="chat"><AIChatBar key={keys[0]} /></Stage>
      </LabCard>
      <LabCard sample={samples[1]} onReset={() => reset(1)}>
        <Stage kind="todo"><AITodoList key={keys[1]} autoPlay /></Stage>
      </LabCard>
      <LabCard sample={samples[2]} wide onReset={() => reset(2)}>
        <Stage kind="schema"><SchemaBuilder key={keys[2]} /></Stage>
      </LabCard>
    </div>
  </div>;
}

export const studioExamples = [
  { id: 'chadcn:ai-chat-bar', load: async () => ({ default: ChatBarDemo }) },
  { id: 'chadcn:ai-todo-list', load: async () => ({ default: TodoListDemo }) },
  { id: 'chadcn:schema-builder', load: async () => ({ default: SchemaBuilderDemo }) },
  { id: 'chadcn:studio-lab', load: async () => ({ default: StudioLabDemo }) },
];

