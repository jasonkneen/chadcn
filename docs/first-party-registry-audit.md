# First-party registry candidate audit

Source inspection: 2026-09-06. Scope: Agent Farm desktop plus four recent relevant sibling projects. This is an extraction inventory, not an implementation or publishing claim. No sibling source was changed; no application was run or visually verified.

## Main finding

There is already enough project-specific UI to seed a first-party registry. Start with Agent Farm's composer selector and docking UI, Andromeda's packaged logs/timeline, and Conductor's resource rows/provisioning state. Some useful boundaries already exist: Conductor has a UI barrel; Andromeda has actual workspace package exports. The missing step is a portable dependency/theme contract and registry packaging. Canopy's spatial review and WorldClaw's studio are more substantial later extractions.

“First-party candidate” here means source composition in the user's projects with local history supporting an authored implementation. It does not establish exclusive legal ownership. Upstream primitives, wrappers, and copied examples remain separately attributed.

## Selection and provenance

Directory modification times were used to discover recent work, then Git/source history and package boundaries were checked. Directory recency alone is unreliable: the recently touched `kibo` clone has a May 4 latest commit and was excluded from this first-party shortlist. CLI-only and native-only projects were deprioritized for this React registry.

| Project and source root | Latest observed repository commit | Boundary and provenance evidence |
| --- | --- | --- |
| Agent Farm: `../../claude-farm/desktop/frontend` | Sep 6, “Refactoring and optimisations and desktop” | Actual requested project: origin is `jasonkneen/Agent-Farm-Web-Desktop`. React 19.2.6 app; private `usage-farm-desktop` package, no package exports. `dock-tabs.tsx` history includes Jason Kneen's July 30 initial public release (`76f1c71`). Repository `LICENSE` is AGPL v3; establish intended per-file distribution license before moving these candidates into a differently licensed registry. |
| Andromeda: `../../sky-zest-marble-umbra` | Sep 6, “Avoid treating an unrelated preview server as this app” | React 19 + TanStack Start. `packages/blocks/package.json:9` exports chat/logs/workflow/database; UI package has subpath exports. `c89aaa4` (Sep 6, Jason Kneen) explicitly extracted independent UI and chat/log packages. Root MIT license names Jason Kneen. |
| Conductor: `../../conductor-cloud` | Sep 6, “Snapshot Conductor before embedding it in the proxy” | React 19 + TanStack Start. `src/ui/index.ts:1` exports primitives and blocks; root package remains a private app without exports. `b5fc29a` (Sep 4, Jason Kneen) explicitly extracted the reusable UI kit. Root `LICENSE`/`LICENSE.md` was not present in this check. |
| Canopy: `../../canopy` | Sep 5, “fix(review): canvas interactions, shortcut dispatcher, Radix help dialog, file presentation” | React 19 + TanStack Start. Private app without package exports. FileCard history includes Jason Kneen's `05dd087` and `0a18da9`. Root `LICENSE`/`LICENSE.md` was not present in this check. |
| WorldClaw: `../../worldclaw` | Sep 6, “Fix WorldClaw generation, auth, evidence recovery and QA” | React 19 + TanStack Start, Three/Fiber/Drei. Private app without exports. PipelineBar history includes Jason Kneen's initial commit `d8ed633`. Root MIT license names Jason Kneen. |

All five repositories' root AGENTS.md files were consulted. No nested AGENTS.md was found under their `src` directories. Their application-build instructions do not turn this read-only inventory into an application build task.

## Recommended entries

Status meanings: **Ready** = existing component architecture is suitable for registry ingestion, subject to packaging/provenance verification; **Adaptation required** = identified portable unit with concrete changes below; **App-bound** = currently owns application state/runtime and should not be copied as a standalone component. No entry is claimed to have passed an isolated chadcn integration test.

### 1. `composer-select` — Components — Ready

Source: [composer-select.tsx](../../claude-farm/desktop/frontend/src/components/composer-select.tsx:15).

`ComposerSelectOption` has value, label, optional description/group. The component accepts controlled value/options/onChange, label and className (`:22`). Imports are Lucide, shadcn dropdown-menu, and `cn`; there is no app store or host dependency. Uses standard `muted-foreground`, `foreground`, and `muted` tokens.

Extraction: register source with dropdown-menu and Lucide dependencies; resolve the `@/` paths against the consumer; add grouped/ungrouped and empty-options examples. Keep model catalogs out of this component. This is a locally authored composition over upstream Radix/shadcn primitives, not a new dropdown primitive.

### 2. `dock-tabs` — Components — Adaptation required

Source: [dock-tabs.tsx](../../claude-farm/desktop/frontend/src/components/dock-tabs.tsx:40).

Already exports generic tab data (`id`, ReactNode label/icon/badge, dirty/closable/disabled/pinned). `DockTabs` (`:176`) is controlled through activeId, activation, close, reorder, double-click and menu/toolbar render slots. `DockDropTarget` (`:287`) adds split/move drop regions. Imports are React, dnd-kit, Lucide, context-menu and `cn`, not Farm operations.

Extraction: carry the complete drag context/drop-target composition and required dnd-kit dependencies; replace or scope `dock-*`, `type-list` and `scrollbar-none` app styling. Define the parent-owned reorder/split contract and document provider composition. Verify keyboard tab navigation, focus after close, reorder and cross-pane drop; current source inspection alone does not establish those interactions work in an isolated consumer. A complete docked workspace example belongs in Blocks; the tabs themselves do not belong in Apps.

### 3. `resizable-bento-grid` — Components — Adaptation required

Source: [bento-grid.tsx](../../claude-farm/desktop/frontend/src/components/bento-grid.tsx:40).

`BentoPanelSpec` already accepts content/actions slots and size constraints. Grid handles reorder/resize via dnd-kit. Browser layout persistence is embedded in `loadLayout` (`:88`) and `window.localStorage.setItem` (`:289`). It uses app typography utilities (`type-heading`, `type-caption`, `type-label`) alongside shadcn tokens.

Extraction: expose layout/defaultLayout/onLayoutChange and make persistence an optional adapter; export layout types; keep panel reconciliation and bounds logic with the component; replace typography utilities. Verify resize, reorder, responsive collapse and malformed saved-layout recovery. Layout preferences are separate from Agent Farm's durable visual TODO ledger; do not copy a persistence pattern into task-status storage.

### 4. `code-review-panel` — Blocks — Adaptation required

Source: [review-surface.tsx](../../claude-farm/desktop/frontend/src/components/review-surface.tsx:281), [review-surface.css](../../claude-farm/desktop/frontend/src/components/review-surface.css:1).

`ReviewSurface` accepts snapshot, selectedPath, comments, refresh/comment/selection callbacks and loading/error; no host API is imported. The file also exports patch parsing, comment chips and a summary card. Remaining domain coupling is the `ReviewComment`/`WorkspaceDiffFile`/`WorkspaceDiffSnapshot` import from `@/types/farm` (`:12`). CSS mostly uses standard tokens, but also requires `--success` and `--code-font-size`.

Extraction: move minimal review DTOs into the portable unit, split parser from rendering, scope/include CSS and semantic success token, and specify async comment failure handling. Verify additions/deletions, multi-hunk patches, binary/empty files and line-comment mapping. Use this as the initial review panel; Canopy's renderer has stronger app/store coupling and should converge on a shared review contract later.

### 5. `mermaid-diagram` — Components — Adaptation required; upstream-backed renderer

Source: [mermaid-diagram.tsx](../../claude-farm/desktop/frontend/src/components/mermaid-diagram.tsx:20).

The small React wrapper takes `code`, lazy-loads Mermaid and provides loading/error states. Its comments explicitly say mounted diagrams do not re-theme (`:24`); theme is read from the document's `dark` class (`:44`). It renders Mermaid SVG (`:77`) and uses the app's `type-caption` utility.

Extraction: replace typography utility, provide an explicit theme input or theme-change subscription, define how concurrent renders share Mermaid initialization, and document/test the permitted Mermaid configuration and invalid-input handling. Credit Mermaid as the rendering engine. Value is the integration wrapper, not ownership of diagram rendering.

### 6. `log-viewer` — Blocks — Adaptation required; package boundary ready

Source: [LogViewerBlock.tsx](../../sky-zest-marble-umbra/packages/blocks/src/logs/LogViewerBlock.tsx:10).

Already exported through `@andromeda/blocks/logs`; accepts log records/string input, title/running state, clear/download callbacks, filters, timestamps, scroll and sizing options (`:21`). No app store or server API. Imports only React, Lucide and the extracted UI package. The old app component is a one-line re-export, so extract from `packages/blocks`, not the shim in `src/components`.

Extraction: map `@andromeda/ui` imports to registry dependencies and normalize its theme utilities. Prefer explicit timestamp/level data: `parseLogLine` (`:35`) currently invents missing timestamps with Date.now and infers levels from words. Document optional string parsing as presentation convenience, not authoritative event status. Verify structured filtering, copy/download and scroll behavior.

### 7. `run-timeline` — Blocks — Adaptation required; package boundary ready

Source: [RunTimelineBlock.tsx](../../sky-zest-marble-umbra/packages/blocks/src/logs/RunTimelineBlock.tsx:12), [timeline-layout.ts](../../sky-zest-marble-umbra/packages/blocks/src/logs/timeline-layout.ts).

Controlled steps/edges, running state, duration and onStepClick; imports its separate layout algorithm and UI utilities. Handles live timing with a cleanup interval. Stronger reuse opportunity than a generic loading indicator because overlapping execution lanes and attempts are already modeled.

Extraction: include timeline-layout and formatDuration, map `fg-*`, `bg-*`, `rounded-app`, success/danger/info tokens to chadcn's theme contract. Keep retry/overlap/dependency fixtures; verify them in an isolated consumer. Do not package the workflow engine to display its timeline.

### 8. `workflow-canvas` — Blocks — Adaptation required; React Flow wrapper

Source: [workflow/index.tsx](../../sky-zest-marble-umbra/packages/blocks/src/workflow/index.tsx:20).

Generic node/edge types, controlled node/edge arrays and change/connect callbacks, custom renderers, toolbar/children slots, readonly/minimap/background options. Uses ReactFlowProvider and React Flow CSS. No workflow store in this module; application-specific nodes and execution stay outside.

Extraction: supply React Flow dependency/CSS, map `bg-bg-canvas` styling, document sizing/provider ownership and export a minimal node example. Classify this as first-party composition around upstream React Flow, not a first-party graph engine. It is a Block, not a complete workflow application.

### 9. `editable-data-grid` — Blocks — Adaptation required

Source: [DbDataGridBlock.tsx](../../sky-zest-marble-umbra/packages/blocks/src/database/DbDataGridBlock.tsx:11).

Already receives columns/rows/readOnly and cell-commit/add/refresh callbacks. Imports database schema-flow formatting, row identity and DbColumn types (`:7`), so its package boundary still couples UI to the database package. Optional seed/reset controls are product-specific.

Extraction: extract a small column/row identity/formatter contract, move seed-generation controls into a separate example/slot, normalize tokens, and specify pending/failing edit behavior. Avoid making a display block pull database drivers or server execution into a browser consumer.

### 10. `resource-list-row` and `provisioning-state` — Components / Blocks — Adaptation required

Sources: [data-list.tsx](../../conductor-cloud/src/ui/blocks/data-list.tsx:11), [provisioning.tsx](../../conductor-cloud/src/ui/blocks/provisioning.tsx:9).

ResourceListRow is a controlled presentation row with status, title, metadata, people, diff counts, score, time, menu and open callback; it even accepts `now` for stable relative-time presentation. ProvisioningState accepts icon/title/subtitle/steps/activeKey/footnote and imports only React and `cn`. Both are exported from the existing UI kit. Source test files exist alongside them; their presence is not a claim that this audit ran them.

Extraction: map `fg-*`, `bg-*`, status and border tokens; carry or replace avatar/metrics/status primitives; scope `shimmer`/`pulse-dot` animations and reduced-motion behavior. Resource row belongs in Components; a resource list composition and the multi-step provisioning panel belong in Blocks. Define unknown-active-step, success and failure states explicitly in provisioning examples.

Conductor's [composer-run-bar.tsx](../../conductor-cloud/src/ui/blocks/composer-run-bar.tsx:1) is a later `agent-run-controls` Block: it is controlled but imports the app's runtime/model catalogs and coercion logic. Inject catalogs and policy callbacks before extraction; do not freeze model identifiers in registry UI.

### 11. `spatial-file-review` — Blocks — App-bound today

Sources: [spatial-canvas.tsx](../../canopy/src/components/spatial-canvas.tsx:1), [file-card.tsx](../../canopy/src/components/file-card.tsx:30), [unified-diff.tsx](../../canopy/src/components/unified-diff.tsx:1).

Distinctive reusable interaction: clustered file cards, camera pan/zoom/fit, focus/expansion and inline diffs. However SpatialCanvas has no props and reads the review store directly. FileCard takes data/pose but also reads selection, zoom and lazy hunk loading from that store. UnifiedDiff's inline composer calls `postComment` and mutates optimistic application comments (`:46`, `:77`). Its CSS vocabulary (`fg`, `surface`, `elevated`, `add`, `del`, custom shadows/text sizes) differs from shadcn.

Extraction: isolate controlled camera/selection/expanded state, content renderers and lazy-load callbacks; separate GitHub comment transport from the review component; extract layout/pose helpers; adapt tokens and keyboard handling. A complete navigable review interface with a documented data adapter can later become `code-review-app` under Apps. FileCard alone is not an App.

### 12. `pipeline-progress` — Components — Adaptation required

Source: [PipelineBar.tsx](../../worldclaw/src/components/worldclaw/PipelineBar.tsx:1).

Useful compact stage/progress presentation using standard shadcn tokens, but currently reads `useWorldClaw` and hard-codes a world-generation stage ordering and active-stage logic. Extraction is small: accept stages, progress and explicit per-stage status/running state; let the application derive statuses from its domain. Label the progressbar accessibly and handle zero/failed/cancelled/completed examples.

WorldClaw's [StudioJobActivity.tsx](../../worldclaw/src/components/worldclaw/StudioJobActivity.tsx:1) is a possible later `generation-activity` Block over upstream AI Elements: adapt StudioJob into generic events/sources/status. Its current “complete unless last running” mapping should not become a generic authority for event outcome.

## Keep app-bound or upstream-attributed

| Surface | Evidence and disposition |
| --- | --- |
| Agent Farm terminal pane | [terminal-pane.tsx:5](../../claude-farm/desktop/frontend/src/components/terminal-pane.tsx:5) imports Farm terminal operations, host detection and visual TODO worker startup. Extract an xterm transport adapter first; do not register the current pane as a portable terminal. Theme currently resolves at mount (`:48`). |
| Agent Farm sidebar chrome | [sidebar-chrome.tsx:5](../../claude-farm/desktop/frontend/src/components/sidebar-chrome.tsx:5) is prop-driven but relies on global `workspace-sidebar-*` CSS. Lower priority than docking/composer because basic sidebar primitives already exist; extract only distinctive composition. |
| WorldClaw asset browser/studio | [AssetLibraryBrowser.tsx:1](../../worldclaw/src/components/worldclaw/AssetLibraryBrowser.tsx:1) imports router navigation, current-user auth, version service, studio target and studio editing. Whole studio is a later Apps candidate only with complete navigation/data/renderer setup. A preview card or pipeline bar is not an App. |
| WorldClaw shine border | [AssetPreviewShineBorder.tsx:3](../../worldclaw/src/components/worldclaw/AssetPreviewShineBorder.tsx:3) explicitly credits `../chadcn/packages/upstream-magicui/.../shine-border.js`, Magic UI MIT. It is an upstream adaptation already sourced from chadcn, not new first-party inventory. |
| AI Elements compositions | WorldClaw StudioJobActivity explicitly imports `~/vendor/ai-elements`. Agent Farm also has an `ai-elements` directory. Preserve attribution and check individual files before claiming originality; wrapper/composition work can be first-party while underlying primitives remain upstream. |
| Conductor `src/blocks-so` | Keep separate from authored `src/ui`. The source tree is organized as imported library examples (chat/sidebar/tables/etc.); this audit does not establish per-file provenance or redistribution terms. Do not relabel those examples as authored merely because they are in Conductor. |
| Andromeda `packages/ui` primitives | Existing package extraction is useful dependency infrastructure, not evidence that buttons/dialogs are original inventions. Prefer chadcn's existing primitive layer and extract distinctive blocks. |

## Concrete ingestion order

1. Establish provenance/license metadata per candidate and a small theme adapter, then ingest `composer-select` as the first isolated Component.
2. Bring in `resource-list-row`, `provisioning-state`, `log-viewer`, and `run-timeline`; these already have portable data contracts and provide useful registry breadth.
3. Extract `dock-tabs`, `resizable-bento-grid`, and `code-review-panel` as the distinctive Agent Farm set, including their support code/styles and meaningful interaction examples.
4. Add workflow/data-grid adapters, then tackle Canopy spatial review and WorldClaw activity/studio compositions.

Each registry item should include source/support files, declared package and registry dependencies, exports/props documentation, a runnable example, theme contract and source attribution. Use Components for focused controls, Blocks for composed functional surfaces, and Apps only for complete interfaces with navigation and documented data/runtime adapters. Apps can compose these entries without duplicating their implementations.

This inventory verifies source boundaries and coupling only. Extraction, cross-project import/build checks, accessibility/interaction checks, light/dark theme previews and publication remain unperformed.
