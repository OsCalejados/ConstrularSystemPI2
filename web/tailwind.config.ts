import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		borderColor: {
  			primary: '#D9D9D9',
  			contrast: '#f46801'
  		},
  		textColor: {
  			primary: '#3f3f43',
  			secondary: '#5C5E64',
  			terciary: '#71717A',
  			placeholder: '#ABB0B4',
  			contrast: {
  				DEFAULT: '#f46801',
  				hover: '#dc5e01'
  			}
  		},
  		colors: {
  			currency: '#43B682',
  			border: '#D9D9D9',
  			primary: {
  				DEFAULT: '#f46801',
  				hover: '#dc5e01'
  			},
  			danger: {
  				DEFAULT: '#A94442',
  				hover: '#983d3b'
  			},
  			warning: {
  				DEFAULT: '#F3BB1B',
  				hover: '#dba818'
  			},
  			table: {
  				header: '#F9F8FA'
  			},
  			background: {
  				primary: '#FCFBFC',
  				secondary: '#ECF4F4'
  			},
  			status: {
  				paid: '#43B682',
  				pending: {
  					DEFAULT: '#F28000',
  					alternative: '#A94442'
  				}
  			},
  			sidebar: {
  				hover: '#F6F6F6',
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
