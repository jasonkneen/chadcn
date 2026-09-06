# chadcn-ux for coding agents

Requires Node.js 22+. Commands: init, add, view, search.
Run `npx chadcn-ux --help` and `<command> --help` for supported options.

1. Inspect the target framework, components.json, aliases, and styling.
2. Initialize with `npx chadcn-ux init` if required.
3. Inspect a component with `npx chadcn-ux view button`.
4. Preview changes with `npx chadcn-ux add button --dry-run`.
5. Install with `npx chadcn-ux add button`; verify the resulting diff and UI.

This CLI delegates to shadcn 4.21.0. Bare names use the default shadcn registry.
Pass explicit registry URLs or configured namespaces for other providers.
Never substitute one provider variant for another without checking compatibility.
Do not overwrite project files without reviewing changes. Keep upstream licenses.

The website catalog is broader than installable coverage. Private workspace
packages @chadcn/ui and @chadcn/upstream-* are not public npm dependencies.
App demos use local state, not connected email or AI services.
The website supports WebMCP discovery in compatible browsers; this CLI itself
does not expose an MCP transport. See https://chadcn.dev/llms.txt for current tools.

Website: https://chadcn.dev
Repository instructions: https://github.com/jasonkneen/chadcn/blob/main/AGENTS.md
