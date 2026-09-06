# Deployment readiness — 2026-09-06

The site is a Vite static build with two entry points: index.html and demo.html. Deploy the contents of dist together; demo assets and source-reference JSON must retain their paths. Route unknown document paths to index.html without overriding existing files or demo.html.

Typechecking and all 13 unit tests passed during the launch check. The fresh production build passed (2m 51s); large-chunk warnings remain. Earlier mount checks cover 1,016 demos but do not constitute exhaustive visual or workflow validation.

Netlify CLI is authenticated to jasonkneen’s team, with agensis.io and tinyworld.build among its 49 projects. This checkout is not yet linked to a Netlify project. The requested domain spelling needs confirming before DNS changes.

For the first launch, build on the configured local workstation and upload static output. A clean remote build is not yet established: generated upstream packages are ignored, the Vue alias uses a sibling checkout, and dependency setup relies on the local runtime installation. Do not assume a standard npm ci build works on a fresh host.

The four apps are interactive demonstrations. Email delivery and real AI services are not connected. Public shadcn add distribution is not implemented. The first-party component inventory and JSON UI format research are available as documentation; inventory candidates have not all been extracted into distributable packages.
