import { app } from '@/main'
import { Dialog } from '../plugins/dialog'

export function useDialog() {
  const isInstalled = app.config.globalProperties.$dialog
  if (!isInstalled) {
    Dialog(app, {
      name: '$dialog'
    })
  }

  const dialog: Dialog = app.config.globalProperties.$dialog
  return dialog
}
