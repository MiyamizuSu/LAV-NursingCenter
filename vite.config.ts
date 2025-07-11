import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueDevTools from 'vite-plugin-vue-devtools'

import ElementPlus from 'unplugin-element-plus/vite'
export default defineConfig({
  server:{
    host: "0.0.0.0", // 监听所有地址
    port: 5173 // 可选：指定端口号
  },
  plugins: [vue(),tailwindcss(),vueDevTools(),ElementPlus({}),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
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
            const parts = id.toString().split('node_modules/')[1].split('/');
            const name = parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
            return `npm.${name}`;
          }
        }
      }
    }
  },
})
