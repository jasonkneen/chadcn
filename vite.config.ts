import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import stylex from './scripts/stylex-vite.mjs';
const require = createRequire(import.meta.url);
export default defineConfig({
  define: {'process.env': '{}'},
  plugins: [{name:'registry-runtime-versions',enforce:'pre',resolveId(source,importer){
    if(source==='@base-ui/react/otp-field'&&importer?.includes('/packages/upstream-shadcn-cssinjs/'))return fileURLToPath(new URL('./src/runtime/base-otp.ts',import.meta.url));
    if(source==='@tanstack/react-table'&&importer?.includes('/packages/upstream-shadcn'))return this.resolve('@chadcn/table-v9',importer,{skipSelf:true});
  },transform(code,id){
    if(id.endsWith('/packages/upstream-magicui/src/registry/example/icon-cloud-demo.js'))return code.replace('`https://cdn.simpleicons.org/${slug}/${slug}`','`/demo-logos/${slug}.svg`');
    if(id.endsWith('/packages/upstream-magicui/src/registry/example/marquee-logos.js'))return code.replace(/https:\/\/cdn\.simpleicons\.org\/([a-z]+)\/000\/fff/g,'/demo-logos/$1.svg');
    if(id.includes('/packages/upstream-shadcn')&&id.endsWith('/registry/icons/create-icon-loader.js')){
      return code.replace('import(`./__${libraryName}__`)', '({lucide:()=>import("lucide-react"),tabler:()=>import("@tabler/icons-react")}[libraryName] ?? (()=>Promise.reject(new Error("Unsupported preview icon library: "+libraryName))))()');
    }
  }}, stylex(), vue(), tailwindcss()],
  resolve: {
    alias: {
      'next/font/google': fileURLToPath(new URL('./src/runtime/next-font.ts', import.meta.url)),
      '@repo/shadcn-vue': fileURLToPath(new URL('../ai-elements-vue/packages/shadcn-vue', import.meta.url)),
      vue: require.resolve('vue/dist/vue.runtime.esm-bundler.js'),
      'motion-v': require.resolve('motion-v'),
      clsx: require.resolve('clsx'),
      'tailwind-merge': require.resolve('tailwind-merge'),
    },
    dedupe: ['react', 'react-dom', 'vue'],
  },
  server: { port: 4310, fs: { allow: ['.', '../ai-elements-vue'] } },
  build: { target: 'es2022', rollupOptions: { input: ['index.html', 'demo.html'] } },
});
