import { useState } from 'react';
import { EditorBubbleMenu, EditorFormatBold, EditorFormatItalic, EditorProvider } from '@chadcn/upstream-kibo/editor';
import { Stories, StoriesContent, Story, StoryAuthor, StoryAuthorImage, StoryAuthorName, StoryImage, StoryTitle } from '@chadcn/upstream-kibo/stories';
import { GanttFeatureItem, GanttFeatureItemCard, GanttFeatureList, GanttFeatureListGroup, GanttFeatureRow, GanttHeader, GanttProvider, GanttSidebar, GanttSidebarGroup, GanttSidebarItem, GanttTimeline, GanttToday } from '@chadcn/upstream-kibo/gantt';

export function KiboEditorDemo() {
  return <EditorProvider content="<h2>Project brief</h2><p>Select text to open the formatting menu. This editor runs entirely in the browser.</p>"><EditorBubbleMenu><EditorFormatBold hideName /><EditorFormatItalic hideName /></EditorBubbleMenu></EditorProvider>;
}

export function KiboStoriesDemo() {
  const [selected, setSelected] = useState(0);
  const stories = [{ title: 'Design review', author: 'Alex', fallback: 'A' }, { title: 'Launch notes', author: 'Morgan', fallback: 'M' }, { title: 'Team updates', author: 'Jordan', fallback: 'J' }];
  return <div className="demo-form"><Stories><StoriesContent>{stories.map((story, index) => <Story key={story.title} onClick={() => setSelected(index)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected(index); } }} aria-label={`Open ${story.title}`} className={selected === index ? 'ring-2 ring-ring' : ''}><StoryImage alt={story.title} src={`https://images.unsplash.com/photo-${['1557682250-33bd709cbe85', '1516321318423-f06f85e504b3', '1497366754035-f200968a6e72'][index]}?w=320`} /><StoryTitle>{story.title}</StoryTitle><StoryAuthor><StoryAuthorImage fallback={story.fallback} name={story.author} /><StoryAuthorName>{story.author}</StoryAuthorName></StoryAuthor></Story>)}</StoriesContent></Stories><p aria-live="polite">Selected story: {stories[selected].title}</p></div>;
}

export function KiboGanttDemo() {
  const [selected, setSelected] = useState('');
  const today = new Date();
  const [features, setFeatures] = useState(() => [{ id: 'brief', name: 'Project brief', startAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4), endAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12), status: { id: 'planned', name: 'Planned', color: '#7c3aed' } }, { id: 'review', name: 'Design review', startAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), endAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 18), status: { id: 'active', name: 'Active', color: '#0891b2' } }]);
  const onMove = (id: string, startAt: Date, endAt: Date | null) => setFeatures(current => current.map(feature => feature.id === id ? { ...feature, startAt, endAt: endAt ?? feature.endAt } : feature));
  return <GanttProvider range="monthly" zoom={80} className="h-64 overflow-auto rounded border"><GanttHeader /><div className="flex min-w-[700px]"><GanttSidebar><GanttSidebarGroup name="Roadmap">{features.map(feature => <GanttSidebarItem key={feature.id} feature={feature} onSelectItem={setSelected} />)}</GanttSidebarGroup></GanttSidebar><GanttTimeline><GanttToday /><GanttFeatureList><GanttFeatureListGroup><GanttFeatureRow features={features} onMove={onMove}>{feature => <GanttFeatureItem key={feature.id} {...feature} onMove={onMove}><GanttFeatureItemCard id={feature.id}>{feature.name}</GanttFeatureItemCard></GanttFeatureItem>}</GanttFeatureRow></GanttFeatureListGroup></GanttFeatureList></GanttTimeline></div><p aria-live="polite">{selected ? `Selected: ${selected}` : 'Select or drag a roadmap item'}</p></GanttProvider>;
}
