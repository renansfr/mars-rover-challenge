import { App } from 'vue'
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/vue'

export const headlessui = (app: App) => {
  app.component('h-menu', Menu)
  app.component('h-menu-button', MenuButton)
  app.component('h-menu-items', MenuItems)
  app.component('h-menu-item', MenuItem)
  app.component('h-dialog', Dialog)
  app.component('h-dialog-panel', DialogPanel)
  app.component('h-dialog-title', DialogTitle)
  app.component('h-dialog-description', DialogDescription)
  app.component('h-transition-root', TransitionRoot)
  app.component('h-transition-child', TransitionChild)
  app.component('h-disclosure', Disclosure)
  app.component('h-disclosure-button', DisclosureButton)
  app.component('h-disclosure-panel', DisclosurePanel)
}
