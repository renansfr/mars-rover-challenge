import { RouteRecordRaw } from 'vue-router'
import { routes as homeRoutes } from './home'
export { installComponents, installDirectives } from './app'

export const routes = [
  ...homeRoutes
] as unknown as RouteRecordRaw[]
