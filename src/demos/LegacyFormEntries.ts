import type { Demo } from './manifest';

const form = (name: string, load: Demo['load']): Demo => ({ id: `shadcn:${name}`,  variantLabel: 'shadcn', title: name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), source: 'shadcn', kind: 'Example', description: 'Upstream registry form example assembled from source JSON.', referencePath:`chadcn:legacy-form:${name}`, importPath: `../.generated/legacy-forms/examples/${name}.tsx`, load });
export const legacyFormEntries: Demo[] = [
  form('checkbox-form-multiple', () => import('../../.generated/legacy-forms/previews/checkbox-form-multiple')),
  form('checkbox-form-single', () => import('../../.generated/legacy-forms/previews/checkbox-form-single')),
  form('combobox-form', () => import('../../.generated/legacy-forms/previews/combobox-form')),
  form('date-picker-form', () => import('../../.generated/legacy-forms/previews/date-picker-form')),
  form('input-form', () => import('../../.generated/legacy-forms/previews/input-form')),
  form('input-otp-form', () => import('../../.generated/legacy-forms/previews/input-otp-form')),
  form('radio-group-form', () => import('../../.generated/legacy-forms/previews/radio-group-form')),
  form('select-form', () => import('../../.generated/legacy-forms/previews/select-form')),
  form('switch-form', () => import('../../.generated/legacy-forms/previews/switch-form')),
  form('textarea-form', () => import('../../.generated/legacy-forms/previews/textarea-form')),
];
