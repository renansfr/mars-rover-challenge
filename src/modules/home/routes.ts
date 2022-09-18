import { Layout } from '@/layouts/layouts.enum'
import HomePage from './pages/home.page.vue'

export const routes = [
  {
    name: 'home.index',
    path: '/',
    component: HomePage,
    meta: {
      layout: Layout.MAIN
    }
  }
]
