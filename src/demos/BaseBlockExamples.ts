import type { Demo } from './manifest';

const registryBlock = (source: string, variantLabel: string, name: string, title: string, description: string, load: Demo['load']): Demo => ({
  id: `${source}:${name}`,
  family: name,
  variantLabel,
  title,
  source,
  kind: 'Block',
  description,
  importPath: `@chadcn/upstream-${source}/${name}`,
  load,
});

const baseBlock = (name: string, title: string, description: string, load: Demo['load']) =>
  registryBlock('shadcn-base', 'Base UI', name, title, description, load);

const radixBlock = (name: string, title: string, description: string, load: Demo['load']) =>
  registryBlock('shadcn-radix', 'Radix UI', name, title, description, load);

const ariaBlock = (name: string, title: string, description: string, load: Demo['load']) =>
  registryBlock('shadcn-aria', 'React Aria', name, title, description, load);

export const baseBlockExamples: Demo[] = [
  baseBlock('login-01', 'Login 01', 'A simple login form.', () => import('@chadcn/upstream-shadcn-base/login-01')),
  baseBlock('login-02', 'Login 02', 'A two column login page with a cover image.', () => import('@chadcn/upstream-shadcn-base/login-02')),
  baseBlock('login-03', 'Login 03', 'A login page with a muted background color.', () => import('@chadcn/upstream-shadcn-base/login-03')),
  baseBlock('login-04', 'Login 04', 'A login page with form and image.', () => import('@chadcn/upstream-shadcn-base/login-04')),
  baseBlock('login-05', 'Login 05', 'A simple email-only login page.', () => import('@chadcn/upstream-shadcn-base/login-05')),
  baseBlock('signup-01', 'Signup 01', 'A simple signup form.', () => import('@chadcn/upstream-shadcn-base/signup-01')),
  baseBlock('signup-02', 'Signup 02', 'A two column signup page with a cover image.', () => import('@chadcn/upstream-shadcn-base/signup-02')),
  baseBlock('signup-03', 'Signup 03', 'A signup page with a muted background color.', () => import('@chadcn/upstream-shadcn-base/signup-03')),
  baseBlock('signup-04', 'Signup 04', 'A signup page with form and image.', () => import('@chadcn/upstream-shadcn-base/signup-04')),
  baseBlock('signup-05', 'Signup 05', 'A simple signup form with social providers.', () => import('@chadcn/upstream-shadcn-base/signup-05')),
  baseBlock('sidebar-01', 'Sidebar 01', 'A simple sidebar with navigation grouped by section.', () => import('@chadcn/upstream-shadcn-base/sidebar-01')),
  baseBlock('sidebar-02', 'Sidebar 02', 'A sidebar with collapsible sections.', () => import('@chadcn/upstream-shadcn-base/sidebar-02')),
  baseBlock('sidebar-03', 'Sidebar 03', 'A sidebar with submenus.', () => import('@chadcn/upstream-shadcn-base/sidebar-03')),
  baseBlock('sidebar-04', 'Sidebar 04', 'A floating sidebar with submenus.', () => import('@chadcn/upstream-shadcn-base/sidebar-04')),
  baseBlock('sidebar-05', 'Sidebar 05', 'A sidebar with collapsible submenus.', () => import('@chadcn/upstream-shadcn-base/sidebar-05')),
  baseBlock('sidebar-06', 'Sidebar 06', 'A sidebar with submenus as dropdowns.', () => import('@chadcn/upstream-shadcn-base/sidebar-06')),
  baseBlock('sidebar-07', 'Sidebar 07', 'A sidebar that collapses to icons.', () => import('@chadcn/upstream-shadcn-base/sidebar-07')),
  baseBlock('sidebar-08', 'Sidebar 08', 'An inset sidebar with secondary navigation.', () => import('@chadcn/upstream-shadcn-base/sidebar-08')),
  baseBlock('sidebar-09', 'Sidebar 09', 'Collapsible nested sidebars.', () => import('@chadcn/upstream-shadcn-base/sidebar-09')),
  baseBlock('sidebar-10', 'Sidebar 10', 'A sidebar in a popover.', () => import('@chadcn/upstream-shadcn-base/sidebar-10')),
  baseBlock('sidebar-11', 'Sidebar 11', 'A sidebar with a collapsible file tree.', () => import('@chadcn/upstream-shadcn-base/sidebar-11')),
  baseBlock('sidebar-12', 'Sidebar 12', 'A sidebar with calendar navigation.', () => import('@chadcn/upstream-shadcn-base/sidebar-12')),
  baseBlock('sidebar-13', 'Sidebar 13', 'A sidebar in a dialog.', () => import('@chadcn/upstream-shadcn-base/sidebar-13')),
  baseBlock('sidebar-14', 'Sidebar 14', 'A sidebar on the right.', () => import('@chadcn/upstream-shadcn-base/sidebar-14')),
  baseBlock('sidebar-15', 'Sidebar 15', 'A sidebar with dual navigation panels.', () => import('@chadcn/upstream-shadcn-base/sidebar-15')),
  baseBlock('sidebar-16', 'Sidebar 16', 'A sidebar with a header and a search form.', () => import('@chadcn/upstream-shadcn-base/sidebar-16')),
];

const loginDescription = 'A login page block.';
const signupDescription = 'A signup page block.';
const sidebarDescription = 'A sidebar block.';
const radixSidebars: Demo[] = [
  radixBlock('sidebar-01', 'Sidebar 01', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-01')),
  radixBlock('sidebar-02', 'Sidebar 02', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-02')),
  radixBlock('sidebar-03', 'Sidebar 03', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-03')),
  radixBlock('sidebar-04', 'Sidebar 04', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-04')),
  radixBlock('sidebar-05', 'Sidebar 05', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-05')),
  radixBlock('sidebar-06', 'Sidebar 06', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-06')),
  radixBlock('sidebar-07', 'Sidebar 07', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-07')),
  radixBlock('sidebar-08', 'Sidebar 08', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-08')),
  radixBlock('sidebar-09', 'Sidebar 09', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-09')),
  radixBlock('sidebar-10', 'Sidebar 10', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-10')),
  radixBlock('sidebar-11', 'Sidebar 11', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-11')),
  radixBlock('sidebar-12', 'Sidebar 12', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-12')),
  radixBlock('sidebar-13', 'Sidebar 13', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-13')),
  radixBlock('sidebar-14', 'Sidebar 14', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-14')),
  radixBlock('sidebar-15', 'Sidebar 15', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-15')),
  radixBlock('sidebar-16', 'Sidebar 16', sidebarDescription, () => import('@chadcn/upstream-shadcn-radix/sidebar-16')),
];
const ariaSidebars: Demo[] = [
  ariaBlock('sidebar-01', 'Sidebar 01', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-01')),
  ariaBlock('sidebar-02', 'Sidebar 02', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-02')),
  ariaBlock('sidebar-03', 'Sidebar 03', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-03')),
  ariaBlock('sidebar-04', 'Sidebar 04', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-04')),
  ariaBlock('sidebar-05', 'Sidebar 05', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-05')),
  ariaBlock('sidebar-06', 'Sidebar 06', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-06')),
  ariaBlock('sidebar-07', 'Sidebar 07', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-07')),
  ariaBlock('sidebar-08', 'Sidebar 08', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-08')),
  ariaBlock('sidebar-09', 'Sidebar 09', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-09')),
  ariaBlock('sidebar-10', 'Sidebar 10', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-10')),
  ariaBlock('sidebar-11', 'Sidebar 11', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-11')),
  ariaBlock('sidebar-12', 'Sidebar 12', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-12')),
  ariaBlock('sidebar-13', 'Sidebar 13', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-13')),
  ariaBlock('sidebar-14', 'Sidebar 14', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-14')),
  ariaBlock('sidebar-15', 'Sidebar 15', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-15')),
  ariaBlock('sidebar-16', 'Sidebar 16', sidebarDescription, () => import('@chadcn/upstream-shadcn-aria/sidebar-16')),
];

export const radixBlockExamples: Demo[] = [
  radixBlock('login-01', 'Login 01', loginDescription, () => import('@chadcn/upstream-shadcn-radix/login-01')),
  radixBlock('login-02', 'Login 02', loginDescription, () => import('@chadcn/upstream-shadcn-radix/login-02')),
  radixBlock('login-03', 'Login 03', loginDescription, () => import('@chadcn/upstream-shadcn-radix/login-03')),
  radixBlock('login-04', 'Login 04', loginDescription, () => import('@chadcn/upstream-shadcn-radix/login-04')),
  radixBlock('login-05', 'Login 05', loginDescription, () => import('@chadcn/upstream-shadcn-radix/login-05')),
  radixBlock('signup-01', 'Signup 01', signupDescription, () => import('@chadcn/upstream-shadcn-radix/signup-01')),
  radixBlock('signup-02', 'Signup 02', signupDescription, () => import('@chadcn/upstream-shadcn-radix/signup-02')),
  radixBlock('signup-03', 'Signup 03', signupDescription, () => import('@chadcn/upstream-shadcn-radix/signup-03')),
  radixBlock('signup-04', 'Signup 04', signupDescription, () => import('@chadcn/upstream-shadcn-radix/signup-04')),
  radixBlock('signup-05', 'Signup 05', signupDescription, () => import('@chadcn/upstream-shadcn-radix/signup-05')),
  ...radixSidebars,
];

export const ariaBlockExamples: Demo[] = [
  ariaBlock('login-01', 'Login 01', loginDescription, () => import('@chadcn/upstream-shadcn-aria/login-01')),
  ariaBlock('login-02', 'Login 02', loginDescription, () => import('@chadcn/upstream-shadcn-aria/login-02')),
  ariaBlock('login-03', 'Login 03', loginDescription, () => import('@chadcn/upstream-shadcn-aria/login-03')),
  ariaBlock('login-04', 'Login 04', loginDescription, () => import('@chadcn/upstream-shadcn-aria/login-04')),
  ariaBlock('login-05', 'Login 05', loginDescription, () => import('@chadcn/upstream-shadcn-aria/login-05')),
  ariaBlock('signup-01', 'Signup 01', signupDescription, () => import('@chadcn/upstream-shadcn-aria/signup-01')),
  ariaBlock('signup-02', 'Signup 02', signupDescription, () => import('@chadcn/upstream-shadcn-aria/signup-02')),
  ariaBlock('signup-03', 'Signup 03', signupDescription, () => import('@chadcn/upstream-shadcn-aria/signup-03')),
  ariaBlock('signup-04', 'Signup 04', signupDescription, () => import('@chadcn/upstream-shadcn-aria/signup-04')),
  ariaBlock('signup-05', 'Signup 05', signupDescription, () => import('@chadcn/upstream-shadcn-aria/signup-05')),
  ...ariaSidebars,
];
