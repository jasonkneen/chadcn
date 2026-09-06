import { test } from 'node:test';
import assert from 'node:assert/strict';
import { materializeIcons } from '../scripts/icons.mjs';

test('icon adapter preserves client directive, props, and explicit library selection',()=>{
 const output=materializeIcons('"use client"; import {IconPlaceholder} from "@/app/(create)/components/icon-placeholder"; export const Demo=()=> <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" className="size-4" aria-label="Selected"/>;','demo.tsx');
 assert.match(output,/^"use client"/);assert.match(output,/CheckIcon as ChadcnCheckIcon/);assert.match(output,/from "lucide-react"/);assert.match(output,/aria-label="Selected"/);assert.doesNotMatch(output,/icon-placeholder|tabler=/);
});
test('unresolved dynamic placeholders remain explicit instead of losing their import',()=>{
 const output=materializeIcons('import {IconPlaceholder} from "@/icon-placeholder"; export const Demo=()=> <><IconPlaceholder lucide="CheckIcon"/><IconPlaceholder lucide={dynamicIcon}/></>;','demo.tsx');
 assert.match(output,/from "@\/icon-placeholder"/);assert.match(output,/lucide=\{dynamicIcon\}/);
});
