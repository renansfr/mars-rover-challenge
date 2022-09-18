import { ref } from 'vue'

type BreakpointConfig = {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

export const breakpointsTailwind: BreakpointConfig = {
  sm: 640,
  md: 800,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

const matchMedia = (value: number) => {
  return window.matchMedia(`(min-width: ${value}px)`).matches
}

export const useBreakpoints = (config: BreakpointConfig = breakpointsTailwind) => {
  const matchBreakpoint = (breakpoint: keyof BreakpointConfig) => {
    const breakpointValue = config[breakpoint]
    const matches = ref(matchMedia(breakpointValue))

    window.addEventListener('resize', () => {
      matches.value = matchMedia(breakpointValue)
    }, {
      passive: true
    })
    return matches
  }

  return {
    matchBreakpoint
  }
}
