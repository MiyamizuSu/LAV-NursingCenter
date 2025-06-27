import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueDevTools from 'vite-plugin-vue-devtools'
import postCssPxToRem from 'postcss-pxtorem'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),tailwindcss(),vueDevTools(),
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
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 16, // 基准值
          propList: ['*'], // 需要转换的属性，这里选择全部
          selectorBlackList: [], // 过滤掉不需要转换的类名
        }),
      ],
    },
  },
})

