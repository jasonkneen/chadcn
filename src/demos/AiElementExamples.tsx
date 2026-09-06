import { Button } from '@chadcn/upstream-shadcn/button';
import { useState } from 'react';
import { Check, Copy, FileText, Search } from 'lucide-react';
import { ChainOfThought, ChainOfThoughtContent, ChainOfThoughtHeader, ChainOfThoughtSearchResult, ChainOfThoughtSearchResults, ChainOfThoughtStep } from '@chadcn/upstream-ai-elements/chain-of-thought';
import { Loader } from '@chadcn/upstream-ai-elements/loader';
import { Message, MessageAction, MessageActions, MessageContent } from '@chadcn/upstream-ai-elements/message';
import { Plan, PlanContent, PlanDescription, PlanFooter, PlanHeader, PlanTitle, PlanTrigger } from '@chadcn/upstream-ai-elements/plan';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@chadcn/upstream-ai-elements/reasoning';
import { Shimmer } from '@chadcn/upstream-ai-elements/shimmer';
import { Source, Sources, SourcesContent, SourcesTrigger } from '@chadcn/upstream-ai-elements/sources';
import { Suggestion, Suggestions } from '@chadcn/upstream-ai-elements/suggestion';
import { Task, TaskContent, TaskItem, TaskItemFile, TaskTrigger } from '@chadcn/upstream-ai-elements/task';

export function AiMessageDemo() {
  const [copied, setCopied] = useState(false);
  return <Message from="assistant"><MessageContent>Here is a concise project update: the review queue is ready for your approval.</MessageContent><MessageActions><MessageAction label="Copy response" tooltip="Copy response" onClick={async () => { try { await navigator.clipboard.writeText('Here is a concise project update: the review queue is ready for your approval.'); setCopied(true); } catch { setCopied(false); } }}>{copied ? <Check size={14} /> : <Copy size={14} />}</MessageAction></MessageActions></Message>;
}

export function AiLoaderDemo() {
  return <div className="demo-form"><Loader size={20} aria-label="Loading response" /><span>Preparing response</span></div>;
}

export function AiShimmerDemo() {
  return <Shimmer as="span" duration={1.5}>Drafting a thoughtful answer...</Shimmer>;
}

export function AiReasoningDemo() {
  const [streaming, setStreaming] = useState(false);
  return <div className="demo-form"><Reasoning isStreaming={streaming} defaultOpen><ReasoningTrigger /><ReasoningContent>I compared the constraints, checked the existing examples, and selected the smallest useful composition.</ReasoningContent></Reasoning><Button type="button" onClick={() => setStreaming(value => !value)}>{streaming ? 'Finish reasoning' : 'Start reasoning'}</Button></div>;
}

export function AiChainOfThoughtDemo() {
  return <ChainOfThought defaultOpen><ChainOfThoughtHeader>How this answer was formed</ChainOfThoughtHeader><ChainOfThoughtContent><ChainOfThoughtStep icon={Search} label="Read the request" description="Identify the desired output and constraints." status="complete" /><ChainOfThoughtStep icon={FileText} label="Inspect local sources" description="Use the available project context." status="complete" /><ChainOfThoughtSearchResults><ChainOfThoughtSearchResult>2 files</ChainOfThoughtSearchResult><ChainOfThoughtSearchResult>Local context</ChainOfThoughtSearchResult></ChainOfThoughtSearchResults></ChainOfThoughtContent></ChainOfThought>;
}

export function AiPlanDemo() {
  return <Plan defaultOpen><PlanHeader><div><PlanTitle>Prepare release notes</PlanTitle><PlanDescription>Three small steps based on the current workspace.</PlanDescription></div><PlanTrigger /></PlanHeader><PlanContent><ol><li>Review changed demos</li><li>Run the typecheck</li><li>Share the validation result</li></ol></PlanContent><PlanFooter>Ready for review</PlanFooter></Plan>;
}

export function AiTaskDemo() {
  return <Task defaultOpen><TaskTrigger title="Inspect the design system" /><TaskContent><TaskItem>Read component inventory <TaskItemFile>components.json</TaskItemFile></TaskItem><TaskItem>Compare theme tokens <TaskItemFile>tokens.css</TaskItemFile></TaskItem><TaskItem>Record open questions</TaskItem></TaskContent></Task>;
}

export function AiSourcesDemo() {
  return <Sources><SourcesTrigger count={2} /><SourcesContent><Source href="https://developer.mozilla.org/en-US/docs/Web/Accessibility" title="Web accessibility" /><Source href="https://react.dev/learn" title="React documentation" /></SourcesContent></Sources>;
}

export function AiSuggestionsDemo() {
  const [selected, setSelected] = useState('');
  return <div className="demo-form"><Suggestions aria-label="Suggested prompts"><Suggestion suggestion="Summarize this" onClick={setSelected} /><Suggestion suggestion="Show examples" onClick={setSelected} /><Suggestion suggestion="Explain the tradeoff" onClick={setSelected} /></Suggestions><p aria-live="polite">{selected ? `Selected: ${selected}` : 'Choose a suggested prompt.'}</p></div>;
}
