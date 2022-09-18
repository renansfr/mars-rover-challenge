import { app } from '@/main'
import { Toast, ToastType, Notification } from '../plugins/toast'

export function useToast () {
  const isInstalled = app.config.globalProperties.$toast
  if (!isInstalled) {
    Toast(app, {
      name: '$toast'
    })
  }

  const toast = app.config.globalProperties.$toast as Record<ToastType, (notification: Notification | string) => void>

  return toast
}
