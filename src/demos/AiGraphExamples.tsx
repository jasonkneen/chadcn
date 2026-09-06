import { Button } from '@chadcn/upstream-shadcn/button';
import { Canvas } from '@chadcn/upstream-ai-elements/canvas';
import { Controls } from '@chadcn/upstream-ai-elements/controls';
import { Panel } from '@chadcn/upstream-ai-elements/panel';
import { Node as AiNode, NodeContent, NodeHeader, NodeTitle } from '@chadcn/upstream-ai-elements/node';
import { Edge as AiEdge } from '@chadcn/upstream-ai-elements/edge';
import { Connection as AiConnection } from '@chadcn/upstream-ai-elements/connection';
import { addEdge, useEdgesState, useNodesState, type Connection, type Edge, type Node, type NodeProps } from '@xyflow/react';

function GraphNode({ data }: NodeProps) {
  return <AiNode handles={{ target: true, source: true }}><NodeHeader><NodeTitle>{String(data.label)}</NodeTitle></NodeHeader><NodeContent>Local graph step</NodeContent></AiNode>;
}

export function AiGraphDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([{ id: 'request', position: { x: 40, y: 100 }, data: { label: 'Request' }, type: 'default' }, { id: 'answer', position: { x: 260, y: 100 }, data: { label: 'Answer' }, type: 'default' }]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([{ id: 'request-answer', source: 'request', target: 'answer', type: 'animated' }]);
  const onConnect = (connection: Connection) => setEdges(current => addEdge(connection, current));
  const addNode = () => setNodes(current => [...current, { id: `step-${current.length}`, position: { x: 140, y: 220 }, data: { label: 'Local step' }, type: 'default' }]);
  return <div style={{ height: 320 }}><Canvas nodes={nodes} edges={edges} nodeTypes={{ default: GraphNode }} edgeTypes={{ animated: AiEdge.Animated }} connectionLineComponent={AiConnection} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView><Controls /><Panel position="top-left"><Button type="button" onClick={addNode}>Add node</Button></Panel></Canvas></div>;
}
