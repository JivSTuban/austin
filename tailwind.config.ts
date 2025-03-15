import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		fontFamily: {
    			sans: [
    				'Inter var',
    				'SF Pro Display',
    				'system-ui',
    				'sans-serif'
    			],
    			script: [
    				'Allura',
    				'cursive'
    			]
    		},
    		colors: {
    			'austin-blue': '#4a78a6',
    			'austin-gray': '#dce1e7',
    			'austin-white': '#fffbfc',
    			'austin-dark': '#1b2232',
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'fade-in': {
    				from: {
    					opacity: '0'
    				},
    				to: {
    					opacity: '1'
    				}
    			},
    			'fade-out': {
    				from: {
    					opacity: '1'
    				},
    				to: {
    					opacity: '0'
    				}
    			},
    			'slide-in-right': {
    				from: {
    					transform: 'translateX(100%)'
    				},
    				to: {
    					transform: 'translateX(0)'
    				}
    			},
    			'slide-out-left': {
    				from: {
    					transform: 'translateX(0)'
    				},
    				to: {
    					transform: 'translateX(-100%)'
    				}
    			},
    			'scale-in': {
    				from: {
    					transform: 'scale(0.95)',
    					opacity: '0'
    				},
    				to: {
    					transform: 'scale(1)',
    					opacity: '1'
    				}
    			},
    			'float': {
    				'0%': {
    					transform: 'translateY(0)'
    				},
    				'50%': {
    					transform: 'translateY(-20px)'
    				},
    				'100%': {
    					transform: 'translateY(0)'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'fade-in': 'fade-in 0.3s ease-out',
    			'fade-out': 'fade-out 0.3s ease-out',
    			'slide-in-right': 'slide-in-right 0.3s ease-out',
    			'slide-out-left': 'slide-out-left 0.3s ease-out',
    			'scale-in': 'scale-in 0.2s ease-out',
    			'float': 'float 3s infinite'
    		},
    		transitionDuration: {
    			'250': '250ms',
    			'350': '350ms',
    			'450': '450ms'
    		},
			backgroundImage: {
				'noise-pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 700 700'%3E%3Cdefs%3E%3Cfilter id='nnnoise-filter' x='-20%25' y='-20%25' width='140%25' height='140%25' filterUnits='objectBoundingBox' primitiveUnits='userSpaceOnUse' color-interpolation-filters='linearRGB'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.167' numOctaves='4' seed='15' stitchTiles='stitch' x='0%25' y='0%25' width='100%25' height='100%25' result='turbulence'%3E%3C/feTurbulence%3E%3CfeSpecularLighting surfaceScale='28' specularConstant='0.75' specularExponent='20' lighting-color='%23fff' x='0%25' y='0%25' width='100%25' height='100%25' in='turbulence' result='specularLighting'%3E%3CfeDistantLight azimuth='3' elevation='100'%3E%3C/feDistantLight%3E%3C/feSpecularLighting%3E%3C/filter%3E%3C/defs%3E%3Crect width='700' height='700' fill='%2309090B'%3E%3C/rect%3E%3Crect width='700' height='700' fill='%23ffffff' filter='url(%23nnnoise-filter)'%3E%3C/rect%3E%3C/svg%3E")`,
			  },
    	}
    },
	plugins: [tailwindcssAnimate],
} satisfies Config;
