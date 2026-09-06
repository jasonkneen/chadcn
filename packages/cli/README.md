# chadcn-ux

The CLI for [chadcn](https://chadcn.dev), a library of components, blocks, and apps.
Requires Node.js 22 or later. This is the first release; we are iterating in public.

![chadcn homepage](https://raw.githubusercontent.com/jasonkneen/chadcn/main/docs/images/homepage.png)

For coding agents: read [AGENTS.md](https://github.com/jasonkneen/chadcn/blob/main/AGENTS.md)
and [llms.txt](https://chadcn.dev/llms.txt). Consumer guidance is also bundled in this package.

```sh
npx chadcn-ux init
npx chadcn-ux add button card
```

This release delegates installation to a pinned version of the shadcn CLI. It
configures your project, installs dependencies, and copies component source into
your project using the upstream installer. Bare names use the shadcn default
registry. Registry URLs and namespaces configured in `components.json` are passed
through unchanged; no provider variants are silently combined.

```sh
npx chadcn-ux add button --dry-run
npx chadcn-ux view button
npx chadcn-ux init --help
npx chadcn-ux add --help
```

`init`, `add`, `view`, and `search` accept the corresponding shadcn CLI options,
including `--cwd`. Run `npx chadcn-ux --help` for an overview.

The chadcn website includes workspace-only compositions and demos that are not
yet independently installable. This CLI does not claim to distribute those items
or every library shown in the website catalog.

Licensed under MIT. Installed components retain their respective upstream licenses.
