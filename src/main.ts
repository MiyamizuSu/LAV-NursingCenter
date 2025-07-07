import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { router } from './lib/router'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import 'element-plus/theme-chalk/dark/css-vars.css'
const pinia=createPinia()
createApp(App).use(pinia).use(router).mount('#app')

const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
