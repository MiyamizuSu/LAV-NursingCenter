import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { router } from './lib/router'
// import 'amfe-flexible'
import { setDomFontSize } from './lib/utils'

// setDomFontSize()
createApp(App).use(router).mount('#app')
