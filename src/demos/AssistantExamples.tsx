import { useState } from 'react';
import {
  AssistantRuntimeProvider,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useExternalStoreRuntime,
  type AppendMessage,
  type ThreadMessageLike,
} from '@assistant-ui/react';

const initialMessages: readonly ThreadMessageLike[] = [
  { role: 'assistant', content: [{ type: 'text', text: 'Hello. I am a local scripted assistant. Ask me about this demo.' }] },
];

function MessageText({ text }: { text: string }) {
  return <p>{text}</p>;
}

function UserMessage() {
  return <MessagePrimitive.Root className="demo-form"><MessagePrimitive.Parts components={{ Text: MessageText }} /></MessagePrimitive.Root>;
}

function AssistantMessage() {
  return <MessagePrimitive.Root className="demo-form"><MessagePrimitive.Parts components={{ Text: MessageText }} /></MessagePrimitive.Root>;
}

function LocalThread() {
  return <ThreadPrimitive.Root className="demo-form"><ThreadPrimitive.Viewport className="demo-form" style={{ maxHeight: 260, overflowY: 'auto' }}><ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage }} /><ThreadPrimitive.ViewportFooter><ComposerPrimitive.Root><ComposerPrimitive.Input aria-label="Message assistant" placeholder="Ask a question..." /><ComposerPrimitive.Send type="submit">Send</ComposerPrimitive.Send></ComposerPrimitive.Root></ThreadPrimitive.ViewportFooter></ThreadPrimitive.Viewport></ThreadPrimitive.Root>;
}

export function AssistantDemo() {
  const [messages, setMessages] = useState<readonly ThreadMessageLike[]>(initialMessages);
  const onNew = async (message: AppendMessage) => {
    const textPart = message.content[0];
    if (!textPart || textPart.type !== 'text') return;
    const text = textPart.text;
    setMessages(current => [...current, { role: 'user', content: [{ type: 'text', text }] }]);
    await new Promise(resolve => window.setTimeout(resolve, 350));
    setMessages(current => [...current, { role: 'assistant', content: [{ type: 'text', text: `This local demo received “${text}”. No model, network request, or external tool was used.` }] }]);
  };
  const runtime = useExternalStoreRuntime<ThreadMessageLike>({ messages, setMessages, onNew, convertMessage: message => message });
  return <AssistantRuntimeProvider runtime={runtime}><LocalThread /></AssistantRuntimeProvider>;
}
