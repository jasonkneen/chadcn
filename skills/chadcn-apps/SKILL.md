---
name: chadcn-apps
description: Build functional chadcn blocks and app examples with complete local workflows, honest data behavior, and source provenance. Use when adding or extending demos.
---

# Build usable examples

Choose a bounded workflow before implementation: a task manager with create/edit/
filter/delete, a CRM with deal editing and stage moves, or mail with folders,
selection, compose, drafts, and settings. Inspect existing examples for reuse.

- A component is an individual control. A block combines controls. An app includes
  navigation, settings, and complete user workflows. A login form is a block.
- Every visible action must work. Implement submit, cancel, edit, delete, filtering,
  selection, empty states, and drag-and-drop where offered. Avoid dead placeholder
  links and buttons. Local simulation is acceptable when explicitly described.
- Keep state behind a replaceable data adapter. Use local state or storage for the
  demo; do not claim a server service is connected. Include reset behavior.
- db.chadcn.dev and the mock database schema system are proprietary future work.
  Do not add their implementation, credentials, or private schemas to this public
  repository, package, catalog, or generated documentation. Integrate only through
  a separately documented public contract when one actually exists.
- Reuse system components and selected registry variants. Keep upstream licenses
  and provenance. Register the demo with its actual kind and provide source.
- Validate the workflow in the browser, not just its initial screenshot. Test a
  narrow viewport and theme changes; run relevant typechecks and tests.
- Report exactly what persists, what is simulated, and what needs a backend.

For scheduled/free-model work, first verify model availability and zero-cost
constraints in the configured environment. Do not invent model names or silently
use a paid fallback. Scheduling is not supplied by this skill.
