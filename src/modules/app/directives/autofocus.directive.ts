import { Directive } from 'vue'

export const autofocus: Directive = {
  mounted(el) {
    if (typeof el.focus === 'function') {
      setTimeout(() => {
        el.focus()
      }, 10)
    } else {
      const focusable = el.querySelector('input') || el.querySelector('button') || el.ctx.querySelector('input') || el.ctx.querySelector('button')
      if (typeof focusable === 'function') {
        setTimeout(() => {
          focusable.focus()
        }, 10)
      }
    }
  }
}
