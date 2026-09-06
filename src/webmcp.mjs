export function createCatalogTools(demos, open) {
  const describe = ({ id, title, source, kind, description, family, variantLabel }) => ({
    id, title, source, kind, description, family, variant: variantLabel,
    url: `https://chadcn.dev/?demo=${encodeURIComponent(id)}`,
    installation: 'Preview availability does not imply independent installation. Inspect the selected registry before installing.',
  });
  const find = (id) => {
    const demo = demos.find(item => item.id === id);
    if (!demo) throw new Error('Unknown demo ID. Search the catalog first.');
    return demo;
  };
  return [
    {
      name: 'chadcn_search', description: 'Search runnable chadcn demos by title, registry, or kind. Returns distinct provider variants with exact IDs.',
      inputSchema: { type: 'object', properties: { query: { type: 'string' }, source: { type: 'string' }, kind: { type: 'string', enum: ['App', 'Block', 'Component', 'Composition'] }, offset: { type: 'integer', minimum: 0 } }, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: async ({ query = '', source, kind, offset = 0 } = {}) => {
        if (typeof query !== 'string' || (source !== undefined && typeof source !== 'string') || !Number.isInteger(offset) || offset < 0) throw new Error('Invalid search arguments.');
        const matches = demos.filter(d => (!source || d.source === source) && (!kind || d.kind === kind) && `${d.title} ${d.source} ${d.family ?? ''}`.toLowerCase().includes(query.toLowerCase()));
        return { total: matches.length, offset, nextOffset: offset + 25 < matches.length ? offset + 25 : null, items: matches.slice(offset, offset + 25).map(describe) };
      },
    },
    {
      name: 'chadcn_inspect', description: 'Inspect an exact demo and its same-family registry variants. Does not run code or install packages.',
      inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: async ({ id }) => {
        const demo = find(id);
        return { ...describe(demo), variants: demos.filter(d => d.id === id || (demo.family && d.family === demo.family)).map(describe), guides: ['https://chadcn.dev/llms.txt', 'https://chadcn.dev/AGENTS.md'] };
      },
    },
    {
      name: 'chadcn_open_demo', description: 'Open a catalog demo in this browser tab. Changes the visible selection; does not install anything or contact the private database service.',
      inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
      annotations: { readOnlyHint: false },
      execute: async ({ id }) => { const demo = find(id); open(demo); return { opened: describe(demo) }; },
    },
  ];
}

export async function registerCatalogTools(context, tools) {
  if (!context?.registerTool) return () => {};
  const controller = new AbortController();
  try {
    for (const tool of tools) await context.registerTool(tool, { signal: controller.signal });
  } catch (error) {
    controller.abort();
    throw error;
  }
  return () => controller.abort();
}
