# Working with chadcn

chadcn is the product and website. `chadcn-ux` is the public-facing npm CLI name.
This is a day-one project; check the live source and package release status before
claiming support. Never invent model identifiers or availability. Do not use emoji
unless requested.

## Using the library from another project

- Read `public/llms.txt` and `packages/cli/README.md` for the install contract.
- Published CLI: `npx chadcn-ux init`, then `npx chadcn-ux add button`.
- The CLI delegates to a pinned shadcn installer. Bare names use the default
  shadcn registry. Use an explicit registry URL or configured namespace for another
  provider. Use `add --dry-run` or `view` to inspect before installing.
- Check `components.json`, framework, aliases, and styling before making changes.
  Do not overwrite existing components without reviewing the diff.
- `@chadcn/ui` and `@chadcn/upstream-*` are private workspace packages, not
  independently published npm packages. Do not recommend installing them from npm.
- Preview availability is not installation availability. Preserve registry identity,
  variant provenance, upstream licenses, and source attribution.

## Editing this repository

- Start with `git status --short`. Preserve unrelated local changes.
- Read `README.md` and `docs/workspace.md`. Website code is in `src`; our authored
  compositions are in `packages/ui`; the standalone CLI is in `packages/cli`.
- `sources.json` configures upstream repositories; `sources.lock.json` pins them.
  Use ignored `sources.local.json` to override checkout paths.
- Never hand-edit ignored generated `packages/upstream-*` adapters. Fix the
  generator or original authored source, then regenerate with `npm run sync`.
- Reuse system UI controls. Preserve all themes and light/dark/system behavior.
  Test menus, focus, keyboard navigation, narrow viewports, and iframe previews.
- Components are individual controls. Blocks compose controls. Apps include a
  complete interface with navigation, settings, and functioning workflows.
- Use meaningful working examples. Forms must submit; controls must change state;
  drag-and-drop must work when offered. Label simulated services accurately.
- Keep the homepage at `/`. Do not turn it into an automatic component redirect.
- Validate with `npm test`, `npm run typecheck`, and the checks appropriate to the
  change. `npm run check` requires upstream checkouts. Use actual browser evidence
  for UI claims; compilation alone does not prove a demo works.

## CLI releases

- `node --test packages/cli/test/*.test.mjs`
- `npm pack ./packages/cli --pack-destination /tmp --json`
- Inspect the tarball and test it in an isolated consumer directory.
- Publish from `packages/cli`, never the private root website package.
- Verify npm account, package ownership, and published version. Never expose tokens.
- Update README publication status only after the registry confirms the release.

## Agent discovery and skills

`/llms.txt` (also `/llm.txt`) and `/AGENTS.md` are served as plain text.
`/agent/catalog.json` is a registry inventory, including non-runnable metadata.
Read `skills/chadcn-design/SKILL.md` for interface design and
`skills/chadcn-apps/SKILL.md` for complete demo workflows. Both are served under
`/skills/<name>/SKILL.md` as well. Run `npm run agent:assets` after guide changes.

In browsers exposing `document.modelContext.registerTool`, the catalog registers
`chadcn_search`, `chadcn_inspect`, and `chadcn_open_demo`. The first two are read-only;
the last changes browser selection. This is browser WebMCP, not a remote MCP server.
Do not configure a fictional /mcp endpoint. See `docs/webmcp.md`.

## Private boundary and planned work

The mock database schema system and db.chadcn.dev service are proprietary and
not implemented in this public repository. Never include private implementation,
credentials, or schemas in its source, published artifacts, or agent responses.
Scheduled example generation and broader distribution remain separate work.
Only use models verified as available and free when a job requires free models;
do not silently fall back to paid models.
