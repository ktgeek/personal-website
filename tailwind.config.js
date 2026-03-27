/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.njk",
    "./src/**/*.md",
    "./src/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg:      '#0a0a0f',
          surface: '#12121a',
          border:  '#2a2a3a',
          yellow:  '#ffe600',
          green:   '#39ff14',
          cyan:    '#00f5ff',
          magenta: '#ff00ff',
          dim:     '#8888aa',
          text:    '#c8c8dc',
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono:  ['"Courier New"', 'Courier', 'monospace'],
      },
      typography: (theme) => ({
        arcade: {
          css: {
            '--tw-prose-body':          theme('colors.arcade.text'),
            '--tw-prose-headings':      theme('colors.arcade.cyan'),
            '--tw-prose-lead':          theme('colors.arcade.text'),
            '--tw-prose-links':         theme('colors.arcade.green'),
            '--tw-prose-bold':          theme('colors.arcade.yellow'),
            '--tw-prose-counters':      theme('colors.arcade.dim'),
            '--tw-prose-bullets':       theme('colors.arcade.magenta'),
            '--tw-prose-hr':            theme('colors.arcade.border'),
            '--tw-prose-quotes':        theme('colors.arcade.cyan'),
            '--tw-prose-quote-borders': theme('colors.arcade.magenta'),
            '--tw-prose-captions':      theme('colors.arcade.dim'),
            '--tw-prose-code':          theme('colors.arcade.yellow'),
            '--tw-prose-pre-code':      '#cccccc',
            '--tw-prose-pre-bg':        '#1a1a2a',
            '--tw-prose-th-borders':    theme('colors.arcade.border'),
            '--tw-prose-td-borders':    theme('colors.arcade.border'),
          }
        }
      })
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
