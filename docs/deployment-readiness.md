# Deployment readiness — 2026-09-06

The site is a Vite static build with two entry points: index.html and demo.html. Deploy the contents of dist together; demo assets and source-reference JSON must retain their paths. Route unknown document paths to index.html without overriding existing files or demo.html.

Typechecking and all 13 unit tests passed during the launch check. The fresh production build passed (2m 51s); large-chunk warnings remain. Earlier mount checks cover 1,016 demos but do not constitute exhaustive visual or workflow validation.

Netlify CLI is authenticated to jasonkneen’s team, with agensis.io and tinyworld.build among its 49 projects. This checkout is not yet linked to a Netlify project. The requested domain spelling needs confirming before DNS changes.

Netlify project `chadcn-library` is connected to the private GitHub repository `jasonkneen/chadcn`, with production branch `main` and custom domain `chadcn.dev`. The build uses `deploy/package-lock.json`, fetches the upstream revisions recorded in `sources.lock.json`, generates adapters, and builds both Vite entry points. `netlify.toml` configures the install base, command, publish directory, and SPA fallback. A successful hosted build and DNS cutover still require verification.

The deploy key is read-only. GitHub push and pull-request webhooks trigger deployments. Local Netlify state and installed dependencies remain ignored.

The four apps are interactive demonstrations. Email delivery and real AI services are not connected. Public shadcn add distribution is not implemented. The first-party component inventory and JSON UI format research are available as documentation; inventory candidates have not all been extracted into distributable packages.
