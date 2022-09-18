module.exports = {
  content: [
    './index.html',
    './safelist.txt',
    './src/**/*.{vue,js,ts}'
  ],
  mode: 'jit',
  theme: {
    extend: {
      fontFamily: {
        base: ['San Francisco', 'Arial', 'sans-serif'],
        title: ['Quicksand', 'Arial', 'sans-serif']
      },
      colors: {
        borderColor: 'rgba(0, 0, 0, 0.05)'
      },
      spacing: {
        15: '3.75rem',
        2.5: '0.625rem',
        68: '17.5rem'
      },
      screens: {
        md: '800px'
      },
      zIndex: {
        1: 1
      },
      keyframes: {
        wiggle: {
          '0%, 100%': {
            transform: 'rotate(-3deg)'
          },
          '50%': {
            transform: 'rotate(3deg)'
          }
        },
        pulsev2: {
          '50%': {
            opacity: 0.3
          }
        },
        wave: {
          '0%': { transform: 'rotate( 0.0deg)' },
          '10%': { transform: 'rotate(14.0deg)' },
          '20%': { transform: 'rotate(-8.0deg)' },
          '30%': { transform: 'rotate(14.0deg)' },
          '40%': { transform: 'rotate(-4.0deg)' },
          '50%': { transform: 'rotate(10.0deg)' },
          '60%': { transform: 'rotate( 0.0deg)' },
          '100%': { transform: 'rotate( 0.0deg)' }
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        pulsev2: 'pulsev2 2s ease-in-out infinite',
        wave: 'wave 2.5s ease-in-out infinite'
      },
      letterSpacing: {
        bannerWider: '0.09em',
        bannerWidest: '.21em'
      },
      dropShadow: {
        custom: '0px 4px 10px rgb(141, 141, 141, 0.16)'
      }
    }
  },
  plugins: []
}
