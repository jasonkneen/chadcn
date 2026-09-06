import { useState } from 'react';
import { KanbanBoard, KanbanCards, KanbanCard, KanbanHeader, KanbanProvider } from '@chadcn/upstream-kibo/kanban';
import { ListGroup, ListHeader, ListItem, ListItems, ListProvider } from '@chadcn/upstream-kibo/list';
import { flexRender, createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { TableBody, TableCell, TableColumnHeader, TableHeader, TableHeaderGroup, TableHead, TableProvider, TableRow } from '@chadcn/upstream-kibo/table';

const columns = [{ id: 'todo', name: 'To do' }, { id: 'doing', name: 'In progress' }, { id: 'done', name: 'Done' }];
type Item = { id: string; name: string; column: string };

export function KiboKanbanDemo() {
  const [data, setData] = useState<Item[]>([{ id: 'brief', name: 'Write brief', column: 'todo' }, { id: 'prototype', name: 'Build prototype', column: 'doing' }, { id: 'review', name: 'Team review', column: 'done' }]);
  return <KanbanProvider columns={columns} data={data} onDataChange={setData}>{column => <KanbanBoard id={column.id} key={column.id}><KanbanHeader>{column.name}</KanbanHeader><KanbanCards id={column.id}>{item => <KanbanCard {...item}>{item.name}</KanbanCard>}</KanbanCards></KanbanBoard>}</KanbanProvider>;
}

export function KiboListDemo() {
  const [items, setItems] = useState([{ id: 'a', name: 'Design review', parent: 'today' }, { id: 'b', name: 'Update roadmap', parent: 'today' }, { id: 'c', name: 'Prepare release notes', parent: 'later' }]);
  return <ListProvider onDragEnd={event => { if (!event.over) return; const parent = String(event.over.id); setItems(current => current.map(item => item.id === String(event.active.id) ? { ...item, parent } : item)); }}><ListItems><ListGroup id="today"><ListHeader name="Today" color="var(--primary)" />{items.filter(item => item.parent === 'today').map((item, index) => <ListItem key={item.id} {...item} index={index}>{item.name}</ListItem>)}</ListGroup><ListGroup id="later"><ListHeader name="Later" color="var(--muted-foreground)" />{items.filter(item => item.parent === 'later').map((item, index) => <ListItem key={item.id} {...item} index={index}>{item.name}</ListItem>)}</ListGroup></ListItems></ListProvider>;
}

type Row = { project: string; owner: string; status: string };
const columnHelper = createColumnHelper<Row>();
const tableColumns: ColumnDef<Row, string>[] = [columnHelper.accessor('project', { header: ({column}) => <TableColumnHeader column={column} title="Project" />, cell: info => info.getValue() }), columnHelper.accessor('owner', { header: ({column}) => <TableColumnHeader column={column} title="Owner" />, cell: info => info.getValue() }), columnHelper.accessor('status', { header: ({column}) => <TableColumnHeader column={column} title="Status" />, cell: info => info.getValue() })];

export function KiboTableDemo() {
  const [rows] = useState<Row[]>([{ project: 'Atlas', owner: 'Mina', status: 'Active' }, { project: 'Orbit', owner: 'Jon', status: 'Planning' }, { project: 'Lumen', owner: 'Kai', status: 'Complete' }]);
  return <TableProvider columns={tableColumns} data={rows}><TableHeader>{({ headerGroup }) => <TableHeaderGroup key={headerGroup.id} headerGroup={headerGroup}>{({ header }) => <TableHead key={header.id} header={header} />}</TableHeaderGroup>}</TableHeader><TableBody>{({ row }) => <TableRow key={row.id} row={row}>{({ cell }) => <TableCell key={cell.id} cell={cell} />}</TableRow>}</TableBody></TableProvider>;
}
