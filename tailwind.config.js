/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vpk: {
          5: '#FF3B30', // Direct Defense (Red)
          4: '#FF9500', // Dual-Use / Satellites (Orange)
          3: '#007AFF', // EdTech & Training (Blue)
          2: '#FFCC00', // Security Equipment (Yellow)
          1: '#8E8E93', // Civilian (Grey)
        },
        cyber: {
          bg: '#0a0d14',
          card: '#121824',
          border: '#1e293b',
          accent: '#38bdf8',
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
        },
      },
      boxShadow: {
        'glow-red': '0 0 15px rgba(255, 59, 48, 0.35)',
        'glow-orange': '0 0 15px rgba(255, 149, 0, 0.35)',
        'glow-blue': '0 0 15px rgba(0, 122, 255, 0.35)',
        'glow-cyan': '0 0 15px rgba(56, 189, 248, 0.35)',
      },
    },
  },
  plugins: [],
};
