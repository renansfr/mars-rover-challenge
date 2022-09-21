import { App } from 'vue'
import { maska as maskaDirective } from 'maska'

export const maska = (app: App) => {
  app.directive('mask', maskaDirective)
}
