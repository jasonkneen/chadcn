# Catalog record disposition

Checked against the local adapter exports and upstream registry JSON on 6 September 2026.

- The ten legacy shadcn form examples are now assembled from the original registry JSON by `scripts/assemble-legacy-forms.mjs`, including transitive controls and toast feedback. They are available in `LegacyFormEntries.ts`; they are no longer unavailable records. Zod v3 is selected explicitly to preserve their original validation contracts.
- Base UI, Radix UI, and React Aria `demo` records export a named `Demo`, not a default export. All three are connected as interface showcase blocks in `ProviderDemoEntries.ts`.
- Each provider's `example` module exports `Example` and `ExampleWrapper`, presentation wrappers already used by its original examples. These are supporting layout utilities, not missing standalone component demos. Source paths are `packages/upstream-shadcn-{base,radix,aria}/src/registry/bases/{base,radix,aria}/components/example.js`.
- Each provider's `direction` module re-exports direction context infrastructure. It requires children and supplies no standalone visual control. Source paths end in `registry/bases/{base,radix,aria}/ui/direction.js`.
- The three providers' `form` catalog records have no adapter export or corresponding UI implementation in their checked-out variant tree. The catalog retains those records for provenance; it does not invent provider implementations. Existing field controls and actual upstream form examples remain browsable.

`artifacts/demo-coverage.json` deliberately retains these nine unmatched supporting/unavailable records in its raw inventory rather than silently counting them as mounted demos.
