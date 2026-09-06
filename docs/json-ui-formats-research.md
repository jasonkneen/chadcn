# JSON UI formats and agent UI protocols

Research checked 6 September 2026. This is a research and integration proposal; no dependencies were installed and no renderer was implemented. Examples below are small, authored illustrations of documented shapes, not runtime-tested integrations.

The Vercel project is **json-render**, under Vercel Labs. It turns a component catalog plus a JSON specification into UI. MCP-UI now implements **MCP Apps**, which delivers an HTML application inside a sandbox and connects it to an MCP host. **A2UI** describes UI using catalog components; **AG-UI** transports agent interaction events. These occupy different layers and can be combined. [json-render repository](https://github.com/vercel-labs/json-render), [MCP-UI introduction](https://mcpui.dev/guide/introduction), [A2UI protocol](https://a2ui.org/specification/v0.9.1-a2ui/), [AG-UI architecture](https://docs.ag-ui.com/concepts/architecture)

## Comparison

| Project | What crosses the boundary | Who supplies the UI implementation? | Strongest fit for chadcn |
| --- | --- | --- | --- |
| json-render | JSON component specification; JSONL patches when streaming | Our catalog maps to our React components | First implementation for composing approved components |
| A2UI | Versioned surface, component, and data-model messages | Client renderer implements a negotiated catalog | Portable agent-produced interfaces with explicit lifecycle |
| MCP Apps | MCP metadata and HTML resource; JSON-RPC host bridge | App author bundles HTML/CSS/JS | Distributing chadcn views inside supporting MCP hosts |
| MCP-UI | MCP Apps resources and bridge, through SDK helpers | Same app model; client SDK embeds apps | Building a host for external MCP apps, or SDK convenience |
| Adaptive Cards | Versioned card JSON with a standard element vocabulary | Host's card renderer | Interoperability with existing card hosts |
| AG-UI | Run/message/tool/state events, including JSON Patch deltas | Application independently chooses its renderer | Agent execution and shared state surrounding generated UI |

This classification follows the projects' format and architecture documentation, rather than treating every JSON-using project as the same format. [json-render specs](https://json-render.dev/docs/streaming), [A2UI specification](https://a2ui.org/specification/v0.9.1-a2ui/), [MCP Apps overview](https://modelcontextprotocol.io/extensions/apps/overview), [Adaptive Cards introduction](https://learn.microsoft.com/en-us/adaptive-cards/authoring-cards/getting-started), [AG-UI events](https://docs.ag-ui.com/concepts/events)

## Versions, maturity, and licenses

These are source snapshots, not a claim that all packages or hosts implement identical capabilities. A manifest on `main` is distinguished from a published release and a protocol version.

| Project | Verified version/status | License |
| --- | --- | --- |
| json-render | Changelog **0.20.0**, 15 August 2026; core manifest agrees. Still a 0.x library with documented migrations. | Apache-2.0 in [core manifest](https://github.com/vercel-labs/json-render/blob/main/packages/core/package.json); [changelog](https://json-render.dev/docs/changelog) |
| A2UI | **0.9.1 Current Production**; **1.0 Candidate**. Current docs supersede cached 0.8 preview descriptions. | Apache-2.0; [current spec](https://a2ui.org/specification/v0.9.1-a2ui/), [license](https://github.com/a2ui-project/a2ui/blob/main/LICENSE) |
| MCP Apps | Stable dated spec **2026-01-26**, SEP-1865; SDK main manifest **1.7.5**. The dated spec and SDK semver are different version axes. | MIT; [dated specification](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx), [manifest](https://github.com/modelcontextprotocol/ext-apps/blob/main/package.json) |
| MCP-UI | Latest repository release returned **client/v7.1.1**, 9 May 2026; this identifies the client package, not every server SDK. | Apache-2.0; [release](https://github.com/MCP-UI-Org/mcp-ui/releases/tag/client%2Fv7.1.1), [license](https://github.com/MCP-UI-Org/mcp-ui/blob/main/LICENSE) |
| Adaptive Cards | Checked card schema **1.6**; JavaScript SDK release **3.0.6**, 7 April 2026. Target hosts may support a smaller schema subset. | MIT; [schema](https://github.com/microsoft/AdaptiveCards/blob/main/schemas/1.6.0/adaptive-card.json), [SDK release](https://github.com/microsoft/AdaptiveCards/releases/tag/adaptivecards%403.0.6), [repository](https://github.com/microsoft/AdaptiveCards) |
| AG-UI | TypeScript core main manifest **0.0.59**; event documentation labels certain extensions draft. Do not infer a stable 1.0 specification from adoption. | MIT; [manifest](https://github.com/ag-ui-protocol/ag-ui/blob/main/sdks/typescript/packages/core/package.json), [events](https://docs.ag-ui.com/concepts/events) |

## 1. json-render: our component library as a constrained vocabulary

The catalog defines component names, Zod prop schemas, descriptions, and actions. The runtime registry supplies implementations. `defineCatalog` can produce a prompt and JSON Schema; `defineRegistry` maps those definitions to React. The existing shadcn package is a useful reference, but chadcn can provide its own implementations. [Catalog](https://json-render.dev/docs/catalog), [registry](https://json-render.dev/docs/registry), [packages and shadcn example](https://github.com/vercel-labs/json-render/blob/main/README.md)

An illustrative specification using a proposed chadcn catalog:

```json
{
  "root": "collection",
  "elements": {
    "collection": {
      "type": "CollectionCard",
      "props": {
        "title": "Design resources",
        "description": "Selected for this workspace",
        "loading": { "$state": "/loading" }
      },
      "children": ["refresh"]
    },
    "refresh": {
      "type": "Button",
      "props": { "label": "Refresh" },
      "on": { "press": { "action": "refresh_collection" } },
      "children": []
    }
  },
  "state": { "loading": false }
}
```

`$state` reads JSON Pointer paths; `$bindState` supports input writes. Repeated components can use `$item`, `$index`, and `$bindItem`; external stores are supported. Components emit named events, which `on` maps to registered action handlers. Schemas describe permitted shapes; application handlers still determine what an action can actually do. [Binding](https://json-render.dev/docs/data-binding), [event and action mapping](https://json-render.dev/docs/registry)

Streaming uses **SpecStream**, JSONL carrying RFC 6902 operations, rather than asking the renderer to execute a half-written JavaScript component:

```jsonl
{"op":"add","path":"/root","value":"heading"}
{"op":"add","path":"/elements/heading","value":{"type":"Text","props":{"text":"Loading collection"},"children":[]}}
{"op":"replace","path":"/elements/heading/props/text","value":"Collection ready"}
```

The compiler accumulates patches; React's `useUIStream` provides request/error/abort handling. A transport can be an HTTP text stream; JSONL is the payload framing, not an authentication protocol. YAML and additional edit modes also exist, but JSON/SpecStream is the narrower initial integration. [Streaming](https://json-render.dev/docs/streaming), [YAML and edit-mode history](https://json-render.dev/docs/changelog)

The repository supplies React, Vue, Svelte, Solid, React Native, and specialized render targets including PDF, email, video, terminal, and 3D. That breadth does not make one platform's arbitrary catalog universally renderable: each target still needs matching implementations. [Package list](https://github.com/vercel-labs/json-render/blob/main/README.md)

**Security and compatibility recommendation:** validate incoming specs and action parameters, allowlist names and URL-bearing props, limit tree/patch sizes, and version our catalog separately from dependency versions. Registered React components execute with our app's privileges, so custom components and handlers remain the trust boundary. Never expose arbitrary imports or source execution as a catalog feature. This is an integration recommendation based on the registry execution model, not a claim that schema validation is a sandbox. [Registry](https://json-render.dev/docs/registry), [validation](https://json-render.dev/docs/validation)

## 2. A2UI: a portable surface protocol

A2UI separates surface creation, component updates, data updates, and deletion. Components form a flat adjacency list using IDs; the root ID is `root`. A surface names its catalog. The protocol requires ordered, framed delivery but does not mandate one transport. [Current protocol source](https://github.com/a2ui-project/a2ui/blob/main/specification/v0_9_1/docs/a2ui_protocol.md)

Illustrative v0.9.1 stream:

```jsonl
{"version":"v0.9.1","createSurface":{"surfaceId":"collection","catalogId":"https://a2ui.org/specification/v0_9_1/catalogs/basic/catalog.json"}}
{"version":"v0.9.1","updateComponents":{"surfaceId":"collection","components":[{"id":"root","component":"Text","text":{"path":"/title"}}]}}
{"version":"v0.9.1","updateDataModel":{"surfaceId":"collection","path":"/title","value":"Design resources"}}
```

This is a typed message protocol, not the same wire format as json-render's `{root,elements}`. `updateDataModel` replaces the value at its path; it is not a generic RFC 6902 operation array. Validate the message envelope and the chosen catalog, and pin both protocol and catalog compatibility. [Current protocol source](https://github.com/a2ui-project/a2ui/blob/main/specification/v0_9_1/docs/a2ui_protocol.md)

Dynamic values use `{ "path": "/field" }`; relative paths scope repeated content. Inputs write bound values. Server actions carry an event name and context; local actions call registered functions. `sendDataModel` can attach the surface's state to outgoing messages. Decide deliberately which state belongs in that surface before enabling full-state synchronization. [Data binding](https://a2ui.org/concepts/data-binding/), [actions](https://a2ui.org/concepts/actions/)

The maintained renderer matrix lists React, Lit, Angular, and Flutter as stable for 0.9.1; SwiftUI and Jetpack Compose are planned in that matrix. A custom chadcn catalog requires matching React mappings and agreements with producers. Transport options include A2A or AG-UI, with other bindings possible. The payload does not ship executable components; the client's registered catalog supplies them. [Renderer matrix](https://a2ui.org/reference/renderers/), [transport contract](https://a2ui.org/specification/v0.9-a2ui/)

**Recommendation:** use A2UI when compatibility with independent agents or renderers is an actual requirement. Build fixtures for the supported version and operations. json-render's A2UI guide currently demonstrates older `surfaceUpdate`/`beginRendering` messages and `literalString` values, rather than the 0.9.1 envelope above. It is an integration recipe, not evidence of a ready-made, lossless 0.9.1 bridge. [json-render A2UI integration](https://json-render.dev/docs/a2ui)

## 3. MCP Apps: distribute an application, not a component tree

MCP Apps associates a tool with a `ui://` resource through `_meta.ui.resourceUri`. A host reads HTML using `resources/read`, renders it in a sandboxed iframe, and bridges it using JSON-RPC over `postMessage`. The optional extension must be negotiated. [MCP Apps overview](https://modelcontextprotocol.io/extensions/apps/overview), [dated specification](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)

Illustrative tool declaration and separate resource response:

```json
{
  "name": "show_collection",
  "description": "Display a collection",
  "inputSchema": { "type": "object", "properties": {} },
  "_meta": { "ui": { "resourceUri": "ui://chadcn/collection" } }
}
```

```json
{
  "contents": [{
    "uri": "ui://chadcn/collection",
    "mimeType": "text/html;profile=mcp-app",
    "text": "<!doctype html><html><body><main id=\"root\">Collection</main></body></html>"
  }]
}
```

Tool inputs/results arrive through the bridge, and app requests can call server tools, request links, or send messages subject to host capabilities. It does not prescribe React state binding or component patches; the HTML application owns its UI model. React hooks are available, while plain JavaScript and other browser frameworks can use the bridge. [SDK overview](https://apps.extensions.modelcontextprotocol.io/api/documents/Overview.html), [SDK entry points](https://apps.extensions.modelcontextprotocol.io/)

The security boundary is executable HTML in an isolated iframe with host-enforced CSP and mediated capabilities. Resource metadata declares allowed connection/resource domains. Host support for a capability must be checked rather than assumed from generic MCP support. [Dated specification](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)

**Recommendation:** bundle trusted chadcn components into an MCP App if the goal is to display them inside assistant hosts. `@json-render/mcp` already provides `createMcpApp`, registration helpers, `useJsonRenderApp`, and HTML bundling utilities, allowing json-render to run inside the MCP Apps sandbox. [json-render MCP API](https://json-render.dev/docs/api/mcp)

## 4. MCP-UI: an SDK implementing that standard

Current MCP-UI documents `createUIResource` on the server and React `AppRenderer`/`AppFrame` on the host. Its contemporary resource envelope uses `text/html;profile=mcp-app`; it is not another portable JSON component language. TypeScript, Ruby, and Python server helpers are listed. [Introduction](https://mcpui.dev/guide/introduction)

```ts
const resource = await createUIResource({
  uri: "ui://chadcn/collection",
  content: {
    type: "rawHtml",
    htmlString: "<!doctype html><html><body>Collection</body></html>",
  },
  encoding: "text",
});
```

`AppRenderer` fetches resources and manages app lifecycle, tool input/results, sandbox configuration, and host callbacks. Catalog mapping and form state live inside the app. Streaming agent data is not itself an HTML/component patch protocol. [AppRenderer](https://mcpui.dev/guide/client/app-renderer)

Older material shows `UIResourceRenderer`, external-URL and Remote DOM approaches. The repository distinguishes legacy rendering from the recommended MCP Apps pattern; do not design a new integration from an older wire example without explicitly targeting a legacy host. [Repository](https://github.com/MCP-UI-Org/mcp-ui)

**Recommendation:** if chadcn becomes an MCP app host, evaluate `@mcp-ui/client` against the lower-level official `AppBridge`. If chadcn only publishes its own views, start with official MCP Apps helpers or json-render's bridge. The official SDK site itself points hosts toward MCP-UI and describes its own basic host as an example. [Official SDK site](https://apps.extensions.modelcontextprotocol.io/)

## 5. Adaptive Cards: a standard card vocabulary

Adaptive Cards describes nested card elements and actions using a standard schema. This illustrative payload deliberately targets 1.3 features for a smaller compatibility requirement:

```json
{
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.3",
  "body": [
    { "type": "TextBlock", "text": "Name this collection", "wrap": true },
    { "type": "Input.Text", "id": "name", "label": "Collection name" }
  ],
  "actions": [{ "type": "Action.Submit", "title": "Save", "data": { "operation": "saveCollection" } }]
}
```

`Action.Submit` collects inputs and data for host processing; `Action.OpenUrl`, `Action.ShowCard`, and `Action.ToggleVisibility` provide other interactions. `version`, `requires`, and fallback properties express compatibility. JSON Schema validates card structure; server-side action validation remains necessary. [Card schema](https://github.com/microsoft/AdaptiveCards/blob/main/schemas/1.6.0/adaptive-card.json)

Templating is a separate expansion step using expressions such as `${name}`, `$data` repetition, and `$when` conditions. It produces a card from a template and data; it is not a general live two-way binding protocol. Universal Actions add `Action.Execute` and refresh behavior in supporting hosts. The documented model does not supply a universal JSONL incremental component stream. [Template language](https://learn.microsoft.com/en-us/adaptive-cards/templating/language), [Universal Actions](https://learn.microsoft.com/en-us/adaptive-cards/authoring-cards/universal-action-model)

HostConfig controls appearance and behavior. Custom elements/actions are possible, but receivers must install the corresponding extension. The repository contains JavaScript and native renderer implementations; a React application can host the JavaScript renderer. Replacing every standard element with chadcn components would need an adapter and compatibility tests. [HostConfig](https://learn.microsoft.com/en-us/adaptive-cards/rendering-cards/host-config), [extensibility](https://learn.microsoft.com/en-us/adaptive-cards/rendering-cards/extensibility), [repository](https://github.com/microsoft/AdaptiveCards)

**Recommendation:** add an Adaptive Cards adapter only for a concrete card-host requirement. It is a useful compatibility target, but a less direct representation of arbitrary authored chadcn compositions.

## 6. AG-UI: execution and state surrounding the UI

AG-UI defines events for agent runs, text messages, tool calls, and state synchronization. It does not define what a `Button` or `CollectionCard` means. An application chooses that mapping or carries a separate UI format. TypeScript and Python SDKs and framework integrations are provided. HTTP event streaming is supported; the architecture allows transport flexibility. [Architecture](https://docs.ag-ui.com/concepts/architecture), [repository](https://github.com/ag-ui-protocol/ag-ui)

Illustrative consecutive events:

```jsonl
{"type":"STATE_SNAPSHOT","snapshot":{"collection":{"title":"Draft"}}}
{"type":"STATE_DELTA","delta":[{"op":"replace","path":"/collection/title","value":"Design resources"}]}
{"type":"CUSTOM","name":"chadcn.surface","value":{"format":"json-render","spec":{"root":"title","elements":{"title":{"type":"Text","props":{"text":"Design resources"},"children":[]}}}}}
```

The last event is an **application-defined envelope**, not a standardized AG-UI UI schema. Snapshots replace state and deltas apply RFC 6902 patches in sequence. Custom events need their own payload contracts. Validate that inner contract as well as the AG-UI event, and define reconnection/resynchronization behavior. [Events](https://docs.ag-ui.com/concepts/events), [TypeScript event schemas](https://github.com/ag-ui-protocol/ag-ui/blob/main/sdks/typescript/packages/core/src/events.ts)

**Recommendation:** add AG-UI when chadcn needs a live agent session with tool progress and shared state. It can carry or accompany A2UI/json-render; it does not replace their catalog or renderer.

## Practical proposal for this checkout

The inspected checkout already has authored `CollectionCard` under `packages/ui`, importing upstream Card and Spinner implementations. Its props include strings, `loading`, and ReactNode slots. Root `registry.json` is a shadcn distribution manifest with source provenance, not a runtime UI instance. Same-name upstream variants intentionally retain separate identities. [Local component](../packages/ui/src/collection-card.tsx), [package exports](../packages/ui/package.json), [distribution registry](../registry.json), [workspace conventions](../README.md)

Recommended next work, in order:

1. **Create a small json-render catalog** for 8–12 chosen primitives/compositions, including `CollectionCard`. Give each approved component explicit JSON props and action schemas. Keep executable renderer imports in a separate React registry; reuse the existing authored components and upstream package subpaths.
2. **Specify slot and variant semantics.** ReactNode props cannot simply be serialized. Map `children` and footer content to documented child/slot references or a deliberately restricted adapter. Preserve provenance IDs; do not collapse Base UI, Radix, React Aria, and other variants into an assumed common API.
3. **Define a chadcn envelope** with `format`, `formatVersion`, `catalogId`, `catalogVersion`, and `spec`. This is our proposed application contract, not an existing shared standard. Use it for storage/replay and version dispatch; keep each external format's envelope intact at its boundary.
4. **Prove one complete interaction:** load a collection, bind an input, invoke an allowlisted refresh/save action, stream an update, and replay the saved spec. Test unknown components, invalid props, dangling IDs, malformed patches, duplicate events, failed actions, and catalog-version mismatch. Browser-check focus, labels, and layout because JSON validation cannot prove accessibility or rendering quality.
5. **Expose the same registry through MCP Apps** using a bundled app and `@json-render/mcp` if assistant-host delivery is required. Verify initialization, tool input/result delivery, action round trips, theme/resize, capability refusal, and teardown in the intended host.
6. **Add A2UI 0.9.1 compatibility** only with a selected catalog and representative lifecycle fixtures; keep 1.0 Candidate separate. Add AG-UI for agent-session needs and Adaptive Cards for specific receiving hosts.

This proposal follows json-render's catalog/registry separation and existing MCP integration while preserving this repository's package/provenance model. It avoids requiring one format to absorb every transport, renderer, and application lifecycle. [Catalog](https://json-render.dev/docs/catalog), [MCP integration](https://json-render.dev/docs/api/mcp), [local README](../README.md)

The next deliverable should be a small working catalog adapter and replayable fixtures, not a new general UI language. Exact dependency pins, host compatibility, and runtime security behavior remain implementation gates; this research has not executed any of these third-party SDKs.
