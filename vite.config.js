import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  esbuild: { jsxInject: `import React from 'react'` },
  plugins: [reactRefresh()],
})
