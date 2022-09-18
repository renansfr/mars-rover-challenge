import { App } from 'vue'
import * as components from './components'
import * as directives from './directives'

export const installComponents = (vueApp: App) => {
  Object.keys(components).forEach(componentFileName => {
    const component = components[componentFileName]
    const componentName = component.name || componentFileName

    vueApp.component(componentName, component)
  })
}

export const installDirectives = (vueApp: App) => {
  vueApp.directive('autofocus', directives.autofocus)
}
