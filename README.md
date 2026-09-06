# chadcn

A connected workspace for UI components, blocks, variants, and example applications.

Upstream implementations live in their original repositories. This workspace builds them into local dependency packages; custom components import those packages. It does not maintain forks of component source files.

## Run

Requires Node 22+, Python 3 on macOS/Linux for the OS workspace lock, and the upstream checkouts named in `sources.json`.

```sh
npm run bootstrap
npm run dev
```

Open http://127.0.0.1:4310. The development command watches upstream source directories: local changes and pulls trigger adapter regeneration. If an upstream introduces a new npm dependency, run `npm run install:upstreams` to install it.

Bootstrap acquires TypeScript with `npm exec`, generates the workspace packages before dependency resolution, then runs the full install. This avoids referencing unpublished local packages before they exist. A complete workspace npm lock is still pending successful full installation; the current lock records the catalog/preview dependencies only.

For this restricted environment, the catalog dependencies and a small preview dependency profile have been installed from cache. Full dependency installation remains incomplete; see `STATUS.md`. Existing local package links can be recreated with `npm run link:upstreams`.

## Use components

```tsx
import { Card, CardContent } from '@chadcn/upstream-shadcn/card';
import { Spinner } from '@chadcn/upstream-kibo/spinner';
import { CollectionCard } from '@chadcn/ui/collection-card';
```

`packages/ui` contains our authored compositions. `packages/upstream-*` contains ignored, reproducible build output from the original sources. Only import the subpaths you need; there is no global barrel importing the entire ecosystem. The adapters preserve client directives, transform TypeScript/JSX into ESM, rewrite local imports, derive npm dependencies from upstream manifests, generate declarations, and retain upstream licenses and file hashes. Declaration generation preserves declared API shapes but does not replace typechecking against the full installed dependency graph.

The `CollectionCard` example imports a shadcn Card and Kibo Spinner. Find it under **Examples & apps** in the catalog. It is a live interactive component, not a screenshot.

## Variants retain provenance

Same-name components are grouped into a family in the browser, but every implementation keeps its own identity, source registry, upstream file paths, import path, and integration status. Open a family to select its registry variants. Uncheck **Group components with the same name** to list every version separately.

Duplicate names inside one registry receive a stable suffix derived from their source paths. Display names remain unchanged. This retains, for example, both the single-file and multi-file `file-upload-01` from blocks. Base UI, Radix UI, React Aria, and CSS-in-JS implementations are independent variants; grouping does not assert API compatibility.

## Sources

- The complete local shadcn v4 JSON registry, plus Base UI, Radix UI, and React Aria registry declarations.
- The complete blocks JSON registry, including duplicate names.
- All Kibo component packages with an `index.tsx` entry point.
- Magic UI, AI Elements, and shadcn-cssinjs registry adapters.
- assistant-ui's published package and AI Elements Vue are identified, with installation/adaptation still pending.
- Every resource in the fetched [awesome-shadcn-ui list](https://github.com/birobirobiro/awesome-shadcn-ui) and every entry in the local shadcn registry directory are indexed. Discovery is separate from installation: the list also contains apps, paid products, tools, and non-package resources.

Add a source in `sources.json`. Supported kinds are `registry` (JSON), `registry-tree` (static TypeScript registry declarations), `packages` (component folders), `tree` (TSX entries), `npm`, and `directory`. TypeScript registry declarations are parsed statically, never executed.

Override checkout locations in ignored `sources.local.json`:

```json
{"shadcn":"/my/checkouts/ui","shadcn-base":"/my/checkouts/ui","shadcn-radix":"/my/checkouts/ui","shadcn-aria":"/my/checkouts/ui","blocks":"/my/checkouts/blocks","kibo":"/my/checkouts/kibo"}
```

## Updates

```sh
# Regenerate from the current local checkouts.
npm run sync

# Regenerate and install their dependencies.
npm run update:upstreams

# Fast-forward clean upstream checkouts, then regenerate and install.
npm run update:upstreams -- --pull

# Also refresh the awesome-shadcn discovery list.
npm run update:upstreams -- --discovery

# Search from the terminal.
npm run catalog -- file-upload
```

`--pull` refuses dirty checkouts and uses `git pull --ff-only`. It does not clone repositories, discard edits, or touch our compositions. The committed source lock records upstream commit IDs, dirty state, and content hashes; dirty checkouts cannot be reconstructed from commit IDs alone. The build reads current source files rather than trusting potentially stale embedded JSON source strings.

Generated output is prepared in a staging directory before replacing adapters. Parsing and compilation failures leave the previous generation available. Package replacement rolls back on failure and preserves installed nested dependencies. Packages, catalog data, and the source lock share the rollback transaction. An OS advisory lock rejects concurrent sync/install/update commands and releases automatically when its owning processes stop. The catalog and source lock carry a matching generation identifier, checked by `npm run check`. Readers can briefly observe filesystem replacements; process-crash recovery during the replacement window still needs further work.

## Integration states

| State | Evidence |
| --- | --- |
| Packaged | Entry files and their local import graph resolved and transpiled. Does not imply dependency installation, rendering, or compatibility with every framework. |
| Adapter needed | Missing upstream files, unresolved aliases, or dependencies without a known version. Issues are shown in the browser. |
| Metadata | Registry style/configuration item without a JavaScript entry point. |
| npm available | An identified upstream npm package; installation is tracked separately. |
| Discovered | A catalog resource with no completed installation adapter. |

Styling systems remain separate. Tailwind presets, fonts, assets, Next.js requirements, Vue support, and StyleX/Panda build transforms need their own adapters and preview environments. The current live composition has scoped preview styling; full upstream styling coverage is pending.

## Verification

```sh
npm test
npm run check
npm run typecheck
npm run build
```

Tests cover same-name variants, discovery parsing, alias resolution, icon materialization, missing-import reporting, and upstream-update propagation without overwriting a composition. `check` compares live source hashes and generated export targets. Browser checks exercise filtering, variant selection, keyboard dismissal, and the live composition's loading state.

`registry.json` describes the first local composition. Packages are private workspace packages, not published npm artifacts; external `shadcn add` distribution is not yet implemented. `STATUS.md` records the remaining scope rather than treating catalog coverage as full integration.

## Appearance and live demos

The top toolbar provides Light, Dark, and System modes plus Base, Ocean, Rose, Terminal, Rounded Neo Brutal, Classic Brutal, Atelier, and Blueprint skins. Base preserves the original simple visual direction; alternative skins change shared color, typography, and corner-radius tokens. Preferences persist locally. The theme chooser is an in-page keyboard-accessible listbox anchored to its trigger, avoiding detached native browser popups. Catalog names are 16px and descriptions 14px at desktop sizes.

The browser has four sections: **Components**, **Blocks**, **Apps**, and **Documentation**, with **Registries** as the source filter. Selecting an item immediately shows its interactive preview. Registry and example selectors switch implementations in place; usage and source details are collapsed beneath the preview. Internal registry metadata such as `index` and `style` is omitted from the component browser. All duplicate versions remain in the catalog; variants without a preview are marked unavailable in the registry selector.

1,016 connected demos run in separate same-origin frames with theme synchronization, responsive widths, reset, and full-tab opening. Browser lists show connected previews; source-linked variants remain distinct. Mount checks and selected interaction evidence are recorded under `artifacts/`; remote assets and exhaustive workflow coverage remain tracked in `STATUS.md`.

The shadcn adapter also exports its upstream Nova stylesheet and Tailwind helpers with provenance hashes. The demo host supplies the upstream tooltip provider. Literal CVA variant schemas are preserved in generated declarations; dynamic schemas still require full upstream declaration builds.

Login, signup, sidebar, and standalone chat compositions belong under Blocks. Apps contains four complete workspace demonstrations: dashboard, email, CRM, and assistant, with navigation, settings, detail panels, and local stateful workflows. Email delivery and AI services are not connected.

Documentation opens 13 internal library profiles with captured homepage screenshots, repository creation dates, maintainer attribution, license and repository statistics, source links, and recent commits. Profiles refresh GitHub statistics and activity when opened, with a dated saved snapshot when unavailable. Rebuild the profile snapshot with `node scripts/library-profiles.mjs`. Registry, example, and viewport controls use the upstream shadcn Select.

The browser nests items under their category and shows preview and source alongside each other on desktop. Research inventories: [first-party registry candidates](docs/first-party-registry-audit.md) and [JSON UI formats](docs/json-ui-formats-research.md). Vue demos currently require the configured sibling ai-elements-vue checkout.
