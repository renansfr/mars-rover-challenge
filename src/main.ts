import { createApp } from 'vue'
import App from './App.vue'
import { installComponents, installDirectives } from './modules'
import router from './router'

import './assets/css/styles.css'
import './assets/css/tailwind.css'
import { headlessui } from './external-components'

export const app = createApp(App)

app.use(router)
  .use(installComponents)
  .use(installDirectives)
  .use(headlessui)
  .mount('#app')
