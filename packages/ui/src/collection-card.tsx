"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@chadcn/upstream-shadcn/card';
import { Spinner } from '@chadcn/upstream-kibo/spinner';
import type { ReactNode } from 'react';

export interface CollectionCardProps {
 title: string;
 description: string;
 children?: ReactNode;
 footer?: ReactNode;
 loading?: boolean;
}

export function CollectionCard({ title, description, children, footer, loading = false }: CollectionCardProps) {
 return <Card>
  <CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader>
  <CardContent>{loading ? <Spinner variant="ellipsis" aria-label="Loading collection"/> : children}</CardContent>
  {footer && <CardFooter>{footer}</CardFooter>}
 </Card>;
}
