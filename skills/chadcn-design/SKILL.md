---
name: chadcn-design
description: Design and implement interfaces with chadcn components, provider variants, and themes. Use when composing a UI from the chadcn catalog or improving an existing chadcn screen.
---

# Design with chadcn

1. Identify the user's primary task and the information they must see together.
   Inspect the existing project, theme tokens, framework, and components.json.
2. Discover controls at https://chadcn.dev/llms.txt. In a WebMCP-enabled browser,
   use chadcn_search and chadcn_inspect. Otherwise read /agent/catalog.json;
   this larger catalog includes metadata and is not a list of runnable demos.
3. Choose a specific registry implementation. Preserve its identity and license.
   Use `npx chadcn-ux view button` and `add button --dry-run` before installation.
   Bare names target shadcn, not every item shown on chadcn.dev.
4. Compose existing system controls instead of introducing native select menus,
   duplicate button styles, or new one-off inputs. Preserve accessible names,
   keyboard behavior, focus, and portal positioning.
5. Give primary content the space it needs. Nest component navigation under its
   category. Use wrapping title-only tags for short example lists. Apps get a
   full-width preview with secondary material in tabs. Avoid empty columns and
   oversized toolbars; keep readable body text rather than shrinking everything.
6. Retain Base and existing skins. Theme semantic tokens and component anatomy,
   including padding, spacing, borders, shadows, focus states, and portalled UI.
   Brutal themes need deliberate hard borders and offset shadows with enough room
   to avoid clipping; do not turn every navigation row into an oversized card.
7. Verify light/dark modes, a narrow viewport, menus, keyboard navigation, and real
   interactions. Inspect a screenshot before claiming visual completion.

Do not install @chadcn/upstream-* or @chadcn/ui from npm: they are private workspace
adapters. Source availability and preview availability are separate from distribution.
