import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),tailwindcss(),vueDevTools(),],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'./src')
    }
  },
  build:{
    rollupOptions:{
      output:{
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 拆成 node_modules/包名，例如 node_modules/lodash-es/
            const parts = id.toString().split('node_modules/')[1].split('/');
            const name = parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
            return `npm.${name}`;
          }
        }
      }
    }
  }
})

