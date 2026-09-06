import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { transformSync } = require('@babel/core');
const stylexPlugin = require('@stylexjs/babel-plugin');
const prefix = 'virtual:chadcn-stylex/';

/** @returns {import('vite').Plugin} */
export default function stylexVite() {
  const styles = new Map();
  return {
    name: 'chadcn-stylex',
    enforce: 'pre',
    resolveId(id) {
      return id.startsWith(prefix) ? `\0${id}` : undefined;
    },
    load(id) {
      if (!id.startsWith(`\0${prefix}`)) return undefined;
      return styles.get(id.slice(1)) ?? '';
    },
    transform(code, id) {
      if (!id.endsWith('.js') || !code.includes('@stylexjs/stylex')) return undefined;
      const result = transformSync(code, {
        filename: id,
        configFile: false,
        babelrc: false,
        parserOpts: { plugins: ['jsx', 'typescript'] },
        plugins: [[stylexPlugin, {
          unstable_moduleResolution: { type: 'commonJS', rootDir: process.cwd() },
        }]],
      });
      const cssId = `${prefix}${encodeURIComponent(id)}.css`;
      styles.set(cssId, stylexPlugin.processStylexRules(result?.metadata?.stylex ?? []));
      return { code: `${result.code}\nimport ${JSON.stringify(cssId)};`, map: result.map ?? null };
    },
  };
}
